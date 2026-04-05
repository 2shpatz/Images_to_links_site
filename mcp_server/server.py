"""
MCP Server for מציאות מהתמונה (AliExpress Deals) site.

═══════════════════════════════════════════════════════════════════
LOCAL-FILE ARCHITECTURE — Images & data are stored as CODE, not DB.
═══════════════════════════════════════════════════════════════════

This server manages the site by reading/writing LOCAL files:
  • site/assets/js/data.js  — product & image metadata (the source of truth)
  • site/images/<category>/  — image files

After making changes, commit & push to GitHub. Cloudflare Pages
auto-deploys from git within ~1 minute.

IMPORTANT FOR AI AGENTS:
  After using upload_image or any data-modifying tool, you MUST run:
    cd /home/shpatz/projects/landing_pages/aliexpress_deals
    git add site/ && git commit -m "Add content" && git push
    npx wrangler deploy
  All three steps are required! git push alone does NOT deploy.
  The site is a Cloudflare Worker, not Pages.

Set SITE_DIR env var to point to the site/ folder. Example:
    export SITE_DIR="/path/to/landing_pages/aliexpress_deals/site"

Run with:
    python -m mcp_server

Configure in MCP clients:
    {
        "mcpServers": {
            "aliexpress-deals": {
                "command": "python3",
                "args": ["-m", "mcp_server"],
                "cwd": "/path/to/landing_pages/aliexpress_deals",
                "env": {
                    "SITE_DIR": "/path/to/landing_pages/aliexpress_deals/site"
                }
            }
        }
    }
"""

import base64
import json
import os
import re
import shutil
from pathlib import Path

from mcp.server.fastmcp import FastMCP

# ── Configuration ──────────────────────────────────────────────────
# Resolve SITE_DIR: explicit env, or fall back to <cwd>/site
_default_site_dir = str(Path.cwd() / "site")
SITE_DIR = Path(os.environ.get("SITE_DIR", _default_site_dir))
DATA_JS_PATH = SITE_DIR / "assets" / "js" / "data.js"
IMAGES_DIR = SITE_DIR / "images"

if not DATA_JS_PATH.exists():
    raise RuntimeError(
        f"data.js not found at {DATA_JS_PATH}. "
        f"Set SITE_DIR env var to the site/ folder, e.g.: "
        f"export SITE_DIR=/path/to/landing_pages/aliexpress_deals/site"
    )

mcp = FastMCP(
    "aliexpress-deals",
    instructions=(
        "Manage images and AliExpress product links for the מציאות מהתמונה site.\n"
        "All changes are saved to LOCAL FILES (data.js + site/images/).\n"
        "After making changes, commit & push to git to deploy.\n"
        "NEVER store images in a database — always as files in git."
    ),
)


# ── data.js read / write ──────────────────────────────────────────
def _read_data() -> dict:
    """Parse SITE_DATA from data.js → Python dict."""
    if not DATA_JS_PATH.exists():
        return {"categories": []}

    text = DATA_JS_PATH.read_text(encoding="utf-8")
    match = re.search(r"const\s+SITE_DATA\s*=\s*(\{.*\})\s*;?\s*$", text, re.DOTALL)
    if not match:
        raise ValueError("Could not parse data.js — const SITE_DATA = {...} not found")

    js_obj = match.group(1)
    # JS → valid JSON
    js_obj = re.sub(r'(?<!:)//.*', '', js_obj)                    # single-line comments (not URLs like https://)
    js_obj = re.sub(r"/\*.*?\*/", "", js_obj, flags=re.DOTALL)   # multi-line comments
    js_obj = re.sub(r'(?<=[{,\n])\s*(\w+)\s*:', r' "\1":', js_obj)  # unquoted keys
    js_obj = re.sub(r",\s*([}\]])", r"\1", js_obj)               # trailing commas

    return json.loads(js_obj)


def _write_data(data: dict) -> None:
    """Write data dict back to data.js preserving the AI-agent instruction header."""
    # Read current file to preserve everything before 'const SITE_DATA'
    current = DATA_JS_PATH.read_text(encoding="utf-8")
    header_match = re.search(r"(const\s+SITE_DATA\s*=)", current)
    if header_match:
        header = current[: header_match.start()]
    else:
        header = ""

    json_str = json.dumps(data, ensure_ascii=False, indent=4)
    DATA_JS_PATH.write_text(
        f"{header}const SITE_DATA = {json_str};\n",
        encoding="utf-8",
    )


# ── Helpers ────────────────────────────────────────────────────────
def _find_category(data: dict, category_id: str) -> dict | None:
    for cat in data["categories"]:
        if cat["id"] == category_id:
            return cat
    return None


def _find_image(category: dict, image_file: str) -> dict | None:
    for img in category.get("images", []):
        if img["file"] == image_file:
            return img
    return None


def _ensure_category_dir(category_id: str) -> Path:
    d = IMAGES_DIR / category_id
    d.mkdir(parents=True, exist_ok=True)
    return d


# ── MCP Tools ──────────────────────────────────────────────────────

@mcp.tool()
def get_site_data() -> str:
    """
    Get the full site data (all categories, images, and products).
    Useful for understanding current state before making changes.
    Data is read from the local data.js file — this is the source of truth.
    """
    data = _read_data()
    return json.dumps(data, ensure_ascii=False, indent=2)


@mcp.tool()
def get_site_info() -> str:
    """
    Get info about the local site files: paths, categories, image counts,
    and which image files exist on disk.
    """
    data = _read_data()
    categories_info = []
    for cat in data.get("categories", []):
        cat_dir = IMAGES_DIR / cat["id"]
        disk_files = sorted(f.name for f in cat_dir.iterdir() if f.is_file()) if cat_dir.exists() else []
        data_files = [img["file"] for img in cat.get("images", [])]
        categories_info.append({
            "id": cat["id"],
            "label": cat["label"],
            "icon": cat["icon"],
            "images_in_data": len(data_files),
            "files_on_disk": len(disk_files),
            "disk_files": disk_files,
            "data_files": data_files,
        })

    return json.dumps({
        "site_dir": str(SITE_DIR),
        "data_js_path": str(DATA_JS_PATH),
        "images_dir": str(IMAGES_DIR),
        "total_categories": len(data.get("categories", [])),
        "categories": categories_info,
    }, ensure_ascii=False, indent=2)


@mcp.tool()
def list_categories() -> str:
    """
    List all categories on the site with their image counts.
    Returns a JSON array of categories.
    """
    data = _read_data()
    result = [
        {
            "id": cat["id"],
            "label": cat["label"],
            "icon": cat["icon"],
            "image_count": len(cat.get("images", [])),
        }
        for cat in data["categories"]
    ]
    return json.dumps(result, ensure_ascii=False, indent=2)


@mcp.tool()
def create_category(category_id: str, label: str, icon: str = "📁") -> str:
    """
    Create a new category for organizing images.
    Creates the category in data.js AND the images/<category_id>/ folder.

    Args:
        category_id: Unique ID (used as folder name, e.g. "pets", "sports"). ASCII lowercase, hyphens ok.
        label: Hebrew display name (e.g. "חיות מחמד")
        icon: Emoji icon for the tab (e.g. "🐾")
    """
    data = _read_data()
    if _find_category(data, category_id):
        return json.dumps({"error": f"Category '{category_id}' already exists"})

    data["categories"].append(
        {"id": category_id, "label": label, "icon": icon, "images": []}
    )
    _ensure_category_dir(category_id)
    _write_data(data)
    return json.dumps({"status": "created", "category": category_id})


@mcp.tool()
def delete_category(category_id: str) -> str:
    """
    Delete a category, its data entries, and its image files from disk.

    Args:
        category_id: The category ID to delete.
    """
    data = _read_data()
    cat = _find_category(data, category_id)
    if not cat:
        return json.dumps({"error": f"Category '{category_id}' not found"})

    data["categories"] = [c for c in data["categories"] if c["id"] != category_id]

    cat_dir = IMAGES_DIR / category_id
    if cat_dir.exists():
        shutil.rmtree(cat_dir)

    _write_data(data)
    return json.dumps({"status": "deleted", "category": category_id})


@mcp.tool()
def list_images(category_id: str) -> str:
    """
    List all image entries in a category with their products.

    Args:
        category_id: The category to list images from.
    """
    data = _read_data()
    cat = _find_category(data, category_id)
    if not cat:
        return json.dumps({"error": f"Category '{category_id}' not found"})
    return json.dumps(cat.get("images", []), ensure_ascii=False, indent=2)


@mcp.tool()
def upload_image(
    category_id: str,
    title: str,
    filename: str,
    image_data_base64: str,
    description: str = "",
) -> str:
    """
    Upload an image (as base64) to a category and create a data entry.
    The image is saved as a FILE in site/images/<category_id>/<filename>.
    Products can be added afterward with add_product.

    IMPORTANT — Full workflow to add a new entry:
      1. Call upload_image (this tool) to save image + create data entry
      2. Call add_product (once per product) to attach AliExpress links
      3. Deploy: run these commands in terminal:
           git add site/ && git commit -m "Add <title>" && git push
           npx wrangler deploy
         Both git push AND wrangler deploy are required!

    Args:
        category_id: Target category ID (e.g. "parenting", "kitchen").
        title: Hebrew title for the image entry.
        filename: Desired filename (e.g. "my-photo.jpg"). Lowercase, hyphens, no spaces.
        image_data_base64: The image file content encoded as a base64 string.
        description: Hebrew description of the image.
    """
    data = _read_data()
    cat = _find_category(data, category_id)
    if not cat:
        return json.dumps({"error": f"Category '{category_id}' not found. Create it first with create_category."})

    # Validate filename
    safe_name = re.sub(r"[^\w\-.]", "_", filename)
    ext = Path(safe_name).suffix.lower()
    if ext not in {".jpg", ".jpeg", ".png", ".webp"}:
        return json.dumps({"error": f"Unsupported file type: {ext}. Use .jpg, .png, or .webp"})

    # Decode and save image file
    try:
        image_bytes = base64.b64decode(image_data_base64)
    except Exception as e:
        return json.dumps({"error": f"Invalid base64 data: {e}"})

    cat_dir = _ensure_category_dir(category_id)
    dest = cat_dir / safe_name

    # Avoid overwriting
    counter = 1
    stem = Path(safe_name).stem
    while dest.exists():
        safe_name = f"{stem}_{counter}{ext}"
        dest = cat_dir / safe_name
        counter += 1

    dest.write_bytes(image_bytes)

    # Add entry to data.js
    image_entry = {
        "file": safe_name,
        "title": title,
        "description": description,
        "products": [],
    }
    cat["images"].append(image_entry)
    _write_data(data)

    return json.dumps({
        "status": "uploaded",
        "image": image_entry,
        "file_path": f"site/images/{category_id}/{safe_name}",
        "reminder": "Run: git add site/ && git commit -m 'Add image' && git push && npx wrangler deploy",
    }, ensure_ascii=False, indent=2)


@mcp.tool()
def add_image_entry(
    category_id: str,
    file: str,
    title: str,
    description: str = "",
) -> str:
    """
    Add a data entry for an image that already exists in site/images/<category_id>/.
    Use this when the image file is already on disk but missing from data.js.

    Args:
        category_id: Target category ID.
        file: Image filename (must already exist in site/images/<category_id>/).
        title: Hebrew title for the image.
        description: Hebrew description.
    """
    data = _read_data()
    cat = _find_category(data, category_id)
    if not cat:
        return json.dumps({"error": f"Category '{category_id}' not found"})

    if _find_image(cat, file):
        return json.dumps({"error": f"Image entry '{file}' already exists in '{category_id}'"})

    # Verify the file exists on disk
    file_path = IMAGES_DIR / category_id / file
    if not file_path.exists():
        return json.dumps({
            "error": f"Image file not found at {file_path}. Upload it first with upload_image.",
            "expected_path": str(file_path),
        })

    entry = {"file": file, "title": title, "description": description, "products": []}
    cat["images"].append(entry)
    _write_data(data)
    return json.dumps({"status": "added", "image": entry}, ensure_ascii=False, indent=2)


@mcp.tool()
def delete_image(category_id: str, image_file: str, delete_file: bool = True) -> str:
    """
    Delete an image entry from data.js and optionally the image file from disk.

    Args:
        category_id: The category containing the image.
        image_file: The image filename to delete.
        delete_file: Also delete the file from disk (default: True).
    """
    data = _read_data()
    cat = _find_category(data, category_id)
    if not cat:
        return json.dumps({"error": f"Category '{category_id}' not found"})

    img = _find_image(cat, image_file)
    if not img:
        return json.dumps({"error": f"Image '{image_file}' not found in '{category_id}'"})

    cat["images"] = [i for i in cat["images"] if i["file"] != image_file]

    if delete_file:
        file_path = IMAGES_DIR / category_id / image_file
        if file_path.exists():
            file_path.unlink()

    _write_data(data)
    return json.dumps({"status": "deleted", "image": image_file})


@mcp.tool()
def add_product(
    category_id: str,
    image_file: str,
    name: str,
    price: str,
    url: str,
    icon: str = "🛒",
    coords_x: float | None = None,
    coords_y: float | None = None,
) -> str:
    """
    Add an AliExpress product link to an image entry.
    The product will be shown as a clickable hotspot on the image.

    Args:
        category_id: The category containing the image.
        image_file: The image filename to add the product to.
        name: Hebrew product name (e.g. "מנורת לילה LED").
        price: Price string (e.g. "$15.30" or "₪15–30").
        url: Full AliExpress product URL (affiliate link preferred).
        icon: Emoji icon for the product (e.g. "💡").
        coords_x: Hotspot X position as percentage (0–100). Where the product appears in the image.
        coords_y: Hotspot Y position as percentage (0–100). Where the product appears in the image.
    """
    data = _read_data()
    cat = _find_category(data, category_id)
    if not cat:
        return json.dumps({"error": f"Category '{category_id}' not found"})

    img = _find_image(cat, image_file)
    if not img:
        return json.dumps({"error": f"Image '{image_file}' not found in '{category_id}'"})

    product = {"name": name, "price": price, "url": url, "icon": icon}
    if coords_x is not None and coords_y is not None:
        product["coords"] = {"x": coords_x, "y": coords_y}

    img["products"].append(product)
    _write_data(data)
    return json.dumps({
        "status": "added",
        "product": product,
        "total_products": len(img["products"]),
    }, ensure_ascii=False, indent=2)


@mcp.tool()
def remove_product(category_id: str, image_file: str, product_index: int) -> str:
    """
    Remove a product from an image by its index (0-based).

    Args:
        category_id: The category containing the image.
        image_file: The image filename.
        product_index: Zero-based index of the product to remove.
    """
    data = _read_data()
    cat = _find_category(data, category_id)
    if not cat:
        return json.dumps({"error": f"Category '{category_id}' not found"})

    img = _find_image(cat, image_file)
    if not img:
        return json.dumps({"error": f"Image '{image_file}' not found in '{category_id}'"})

    products = img.get("products", [])
    if product_index < 0 or product_index >= len(products):
        return json.dumps({"error": f"Product index {product_index} out of range (0–{len(products) - 1})"})

    removed = products.pop(product_index)
    _write_data(data)
    return json.dumps({"status": "deleted", "removed_product": removed}, ensure_ascii=False, indent=2)


@mcp.tool()
def update_image_entry(
    category_id: str,
    image_file: str,
    title: str | None = None,
    description: str | None = None,
) -> str:
    """
    Update an existing image entry's title or description.

    Args:
        category_id: The category containing the image.
        image_file: The image filename to update.
        title: New Hebrew title (leave empty to keep current).
        description: New Hebrew description (leave empty to keep current).
    """
    data = _read_data()
    cat = _find_category(data, category_id)
    if not cat:
        return json.dumps({"error": f"Category '{category_id}' not found"})

    img = _find_image(cat, image_file)
    if not img:
        return json.dumps({"error": f"Image '{image_file}' not found in '{category_id}'"})

    if title is not None:
        img["title"] = title
    if description is not None:
        img["description"] = description

    _write_data(data)
    return json.dumps({"status": "updated", "image": img}, ensure_ascii=False, indent=2)


@mcp.tool()
def update_product(
    category_id: str,
    image_file: str,
    product_index: int,
    name: str | None = None,
    price: str | None = None,
    url: str | None = None,
    icon: str | None = None,
    coords_x: float | None = None,
    coords_y: float | None = None,
) -> str:
    """
    Update an existing product on an image.

    Args:
        category_id: The category containing the image.
        image_file: The image filename.
        product_index: Zero-based index of the product to update.
        name: New Hebrew product name (leave empty to keep current).
        price: New price string (leave empty to keep current).
        url: New AliExpress URL (leave empty to keep current).
        icon: New emoji icon (leave empty to keep current).
        coords_x: New hotspot X position as percentage (0–100).
        coords_y: New hotspot Y position as percentage (0–100).
    """
    data = _read_data()
    cat = _find_category(data, category_id)
    if not cat:
        return json.dumps({"error": f"Category '{category_id}' not found"})

    img = _find_image(cat, image_file)
    if not img:
        return json.dumps({"error": f"Image '{image_file}' not found in '{category_id}'"})

    products = img.get("products", [])
    if product_index < 0 or product_index >= len(products):
        return json.dumps({"error": f"Product index {product_index} out of range (0–{len(products) - 1})"})

    product = products[product_index]
    if name is not None:
        product["name"] = name
    if price is not None:
        product["price"] = price
    if url is not None:
        product["url"] = url
    if icon is not None:
        product["icon"] = icon
    if coords_x is not None and coords_y is not None:
        product["coords"] = {"x": coords_x, "y": coords_y}

    _write_data(data)
    return json.dumps({"status": "updated", "product": product}, ensure_ascii=False, indent=2)


@mcp.tool()
def seed_data(data_json: str) -> str:
    """
    Replace ALL site data with the provided JSON. Use carefully — this
    overwrites every category, image entry, and product in data.js.

    Args:
        data_json: Full SITE_DATA JSON string with a "categories" array.
    """
    try:
        data = json.loads(data_json)
    except json.JSONDecodeError as e:
        return json.dumps({"error": f"Invalid JSON: {e}"})

    if "categories" not in data:
        return json.dumps({"error": "JSON must contain a 'categories' array"})

    _write_data(data)
    return json.dumps({"status": "seeded", "categories": len(data["categories"])})


# ── Run ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    mcp.run()
