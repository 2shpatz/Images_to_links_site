"""
MCP Server for מציאות מהתמונה (AliExpress Deals) site.

This server talks to the Cloudflare-hosted API to manage the site remotely.
No local file access needed — works from anywhere.

Set SITE_URL env var to your Cloudflare Pages domain, e.g.:
    export ALIEXPRESS_SITE_URL="https://images-to-links-site.ohadshpindel.workers.dev"

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
                    "SITE_URL": "https://images-to-links-site.ohadshpindel.workers.dev"
                }
            }
        }
    }
"""

import json
import os

import httpx
from mcp.server.fastmcp import FastMCP

# ── Configuration ──────────────────────────────────────────────────
SITE_URL = os.environ.get(
    "SITE_URL",
    os.environ.get("ALIEXPRESS_SITE_URL", "")
).rstrip("/")

if not SITE_URL:
    raise RuntimeError(
        "SITE_URL (or ALIEXPRESS_SITE_URL) env var is required. "
        "Set it to your Cloudflare Pages URL, e.g.: "
        "https://images-to-links-site.ohadshpindel.workers.dev"
    )

API_BASE = f"{SITE_URL}/api"

mcp = FastMCP(
    "aliexpress-deals",
    instructions="Manage images and AliExpress product links for the מציאות מהתמונה site (remote API)",
)

# ── HTTP helpers ───────────────────────────────────────────────────
_client = httpx.Client(timeout=30.0)


def _api_get(path: str) -> dict | list:
    """GET request to the site API."""
    resp = _client.get(f"{API_BASE}{path}")
    resp.raise_for_status()
    return resp.json()


def _api_post(path: str, body: dict) -> dict:
    """POST JSON to the site API."""
    resp = _client.post(f"{API_BASE}{path}", json=body)
    resp.raise_for_status()
    return resp.json()


def _api_delete(path: str) -> dict:
    """DELETE request to the site API."""
    resp = _client.delete(f"{API_BASE}{path}")
    resp.raise_for_status()
    return resp.json()


def _api_put(path: str, body: dict) -> dict:
    """PUT JSON to the site API."""
    resp = _client.put(f"{API_BASE}{path}", json=body)
    resp.raise_for_status()
    return resp.json()


# ── MCP Tools ──────────────────────────────────────────────────────

@mcp.tool()
def list_categories() -> str:
    """
    List all categories on the site with their image counts.
    Returns a JSON array of categories.
    """
    result = _api_get("/categories")
    return json.dumps(result, ensure_ascii=False, indent=2)


@mcp.tool()
def create_category(category_id: str, label: str, icon: str = "📁") -> str:
    """
    Create a new category for organizing images.

    Args:
        category_id: Unique ID (used as folder name, e.g. "pets", "sports"). ASCII only.
        label: Hebrew display name (e.g. "חיות מחמד")
        icon: Emoji icon for the tab (e.g. "🐾")
    """
    result = _api_post("/categories", {"id": category_id, "label": label, "icon": icon})
    return json.dumps(result, ensure_ascii=False, indent=2)


@mcp.tool()
def delete_category(category_id: str) -> str:
    """
    Delete a category and all its images.

    Args:
        category_id: The category ID to delete.
    """
    result = _api_delete(f"/categories/{category_id}")
    return json.dumps(result, ensure_ascii=False, indent=2)


@mcp.tool()
def list_images(category_id: str) -> str:
    """
    List all image entries in a category with their products.

    Args:
        category_id: The category to list images from.
    """
    result = _api_get(f"/categories/{category_id}/images")
    return json.dumps(result, ensure_ascii=False, indent=2)


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
    Products can be added afterward with add_product.
    The image will be stored in Cloudflare KV and served from the API.

    Args:
        category_id: Target category ID (e.g. "parenting", "kitchen").
        title: Hebrew title for the image entry.
        filename: Desired filename (e.g. "my-photo.jpg").
        image_data_base64: The image file content encoded as base64 string.
        description: Hebrew description of the image.
    """
    result = _api_post(f"/categories/{category_id}/images/upload", {
        "file": filename,
        "title": title,
        "description": description,
        "image_base64": image_data_base64,
    })
    if result.get("image_url"):
        result["full_image_url"] = f"{SITE_URL}{result['image_url']}"
    return json.dumps(result, ensure_ascii=False, indent=2)


@mcp.tool()
def add_image_entry(
    category_id: str,
    file: str,
    title: str,
    description: str = "",
) -> str:
    """
    Add a data entry for an image. Use when the image is already available
    at a known URL or in the images/ directory.

    Args:
        category_id: Target category ID.
        file: Image filename or path.
        title: Hebrew title for the image.
        description: Hebrew description.
    """
    result = _api_post(f"/categories/{category_id}/images", {
        "file": file,
        "title": title,
        "description": description,
    })
    return json.dumps(result, ensure_ascii=False, indent=2)


@mcp.tool()
def delete_image(category_id: str, image_file: str) -> str:
    """
    Delete an image entry and its stored image data.

    Args:
        category_id: The category containing the image.
        image_file: The image filename to delete.
    """
    result = _api_delete(f"/categories/{category_id}/images/{image_file}")
    return json.dumps(result, ensure_ascii=False, indent=2)


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

    Args:
        category_id: The category containing the image.
        image_file: The image filename to add the product to.
        name: Hebrew product name (e.g. "מנורת לילה LED").
        price: Price range string (e.g. "₪15–30").
        url: Full AliExpress product URL (affiliate link).
        icon: Emoji icon for the product (e.g. "💡").
        coords_x: Hotspot X position as percentage (0–100). Where the product is in the image.
        coords_y: Hotspot Y position as percentage (0–100). Where the product is in the image.
    """
    body = {"name": name, "price": price, "url": url, "icon": icon}
    if coords_x is not None and coords_y is not None:
        body["coords"] = {"x": coords_x, "y": coords_y}
    result = _api_post(f"/categories/{category_id}/images/{image_file}/products", body)
    return json.dumps(result, ensure_ascii=False, indent=2)


@mcp.tool()
def remove_product(category_id: str, image_file: str, product_index: int) -> str:
    """
    Remove a product from an image by its index (0-based).

    Args:
        category_id: The category containing the image.
        image_file: The image filename.
        product_index: Zero-based index of the product to remove.
    """
    result = _api_delete(f"/categories/{category_id}/images/{image_file}/products/{product_index}")
    return json.dumps(result, ensure_ascii=False, indent=2)


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
    body = {}
    if title is not None:
        body["title"] = title
    if description is not None:
        body["description"] = description
    result = _api_put(f"/categories/{category_id}/images/{image_file}", body)
    return json.dumps(result, ensure_ascii=False, indent=2)


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
    body = {}
    if name is not None:
        body["name"] = name
    if price is not None:
        body["price"] = price
    if url is not None:
        body["url"] = url
    if icon is not None:
        body["icon"] = icon
    if coords_x is not None and coords_y is not None:
        body["coords"] = {"x": coords_x, "y": coords_y}
    result = _api_put(f"/categories/{category_id}/images/{image_file}/products/{product_index}", body)
    return json.dumps(result, ensure_ascii=False, indent=2)


@mcp.tool()
def get_site_data() -> str:
    """
    Get the full site data (all categories, images, and products).
    Useful for understanding current state before making changes.
    """
    data = _api_get("/data")
    return json.dumps({"site_url": SITE_URL, "data": data}, ensure_ascii=False, indent=2)


@mcp.tool()
def get_site_info() -> str:
    """
    Get info about the site: live URL, health status, and stats.
    Useful to verify the MCP server is correctly configured.
    """
    try:
        health = _api_get("/health")
    except Exception as e:
        return json.dumps({
            "site_url": SITE_URL,
            "api_base": API_BASE,
            "status": "error",
            "error": str(e),
        }, ensure_ascii=False, indent=2)

    return json.dumps({
        "site_url": SITE_URL,
        "api_base": API_BASE,
        "status": health.get("status", "unknown"),
        "total_categories": health.get("categories", 0),
        "total_images": health.get("total_images", 0),
    }, ensure_ascii=False, indent=2)


@mcp.tool()
def seed_data(data_json: str) -> str:
    """
    Seed the site with initial data (replaces all existing data).
    Use carefully — this overwrites everything.

    Args:
        data_json: Full SITE_DATA JSON string with a "categories" array.
    """
    try:
        data = json.loads(data_json)
    except json.JSONDecodeError as e:
        return json.dumps({"error": f"Invalid JSON: {e}"})

    if "categories" not in data:
        return json.dumps({"error": "JSON must contain a 'categories' array"})

    result = _api_post("/data/seed", data)
    return json.dumps(result, ensure_ascii=False, indent=2)


# ── Run ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    mcp.run()
