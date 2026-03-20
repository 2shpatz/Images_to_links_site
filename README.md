# מציאות מהתמונה – מוצרי AliExpress מתוך תמונות AI

אתר סטטי (HTML/CSS/JS) שמציג תמונות שנוצרו ע"י AI, ומקשר כל פריט בתמונה למוצר אמיתי ב-AliExpress.
ניתן להרצה מקומית עם Docker ולהעלאה חינמית ל-Cloudflare Pages.

כולל **MCP Server** לניהול תמונות ומוצרים ישירות דרך AI Agent, ו-**REST API** לאינטגרציות HTTP.

## מבנה הפרויקט

```
aliexpress_deals/
├── Dockerfile              ← הרצה מקומית עם nginx
├── docker-compose.yml      ← docker-compose up (site + API)
├── nginx.conf              ← nginx config
├── README.md               ← הקובץ הזה
├── mcp_config.json         ← הגדרות MCP לקליינט (Claude Desktop / VS Code)
├── api/                    ← REST API לניהול (FastAPI)
│   ├── Dockerfile
│   ├── app.py
│   └── requirements.txt
├── mcp_server/             ← MCP Server לשימוש עם AI Agents
│   ├── __init__.py
│   ├── __main__.py
│   ├── server.py
│   └── requirements.txt
└── site/                   ← קבצי האתר (static) – Cloudflare מצביע לכאן
    ├── index.html
    ├── assets/
    │   ├── css/style.css
    │   └── js/
    │       ├── data.js     ← ⭐ קובץ הנתונים
    │       └── script.js
    └── images/             ← ⭐ תמונות לפי קטגוריה
        ├── parenting/
        ├── kitchen/
        ├── gadgets/
        └── home/
```

## איך מוסיפים תמונה חדשה ומוצרים

### 1. הוסיפו את התמונה לתיקייה המתאימה
```bash
# לדוגמה – תמונה חדשה בקטגוריית הורות:
cp my-new-image.jpg site/images/parenting/
```

### 2. עדכנו את קובץ הנתונים `site/assets/js/data.js`
הוסיפו רשומה חדשה למערך `images` בקטגוריה הרלוונטית:

```javascript
{
    file: "my-new-image.jpg",        // שם הקובץ (בתיקיית הקטגוריה)
    title: "שם התמונה בעברית",
    description: "תיאור קצר של התמונה",
    products: [
        {
            name: "שם המוצר בעברית",
            price: "₪15–30",               // טווח מחירים משוער
            url: "https://www.aliexpress.com/item/XXXXX.html",  // קישור affiliate
            icon: "🛒"                     // אמוג׳י מתאים
        }
    ]
}
```

### 3. Push ל-GitHub
```bash
git add .
git commit -m "הוספת תמונה חדשה – מטבח"
git push
```

Cloudflare Pages יבנה ויפרוס אוטומטית תוך ~30 שניות.

## איך מוסיפים קטגוריה חדשה

1. צרו תיקייה חדשה: `site/images/<category_id>/`
2. הוסיפו קטגוריה חדשה ב-`data.js`:

```javascript
{
    id: "pets",          // שם התיקייה
    label: "חיות מחמד",  // שם בעברית
    icon: "🐾",          // אמוג׳י
    images: [ /* ... */ ]
}
```

## הרצה מקומית עם Docker

```bash
docker compose up --build
```

- **אתר:** http://localhost:8081
- **API:** http://localhost:8082 (Swagger docs: http://localhost:8082/docs)

## MCP Server – ניהול דרך AI Agent

ה-MCP Server מאפשר ל-AI Agent (כמו Claude, Copilot וכו׳) לנהל את האתר ישירות:
- העלאת תמונות חדשות
- הוספת/מחיקת קטגוריות
- הוספת קישורי מוצרים מ-AliExpress
- צפייה בכל הנתונים הקיימים

### התקנה

```bash
cd landing_pages/aliexpress_deals
pip install -r mcp_server/requirements.txt
```

### הגדרה ב-Claude Desktop

הוסיפו לקובץ `~/.config/Claude/claude_desktop_config.json`:

```json
{
    "mcpServers": {
        "aliexpress-deals": {
            "command": "python",
            "args": ["-m", "mcp_server"],
            "cwd": "/path/to/landing_pages/aliexpress_deals",
            "env": {
                "SITE_DIR": "/path/to/landing_pages/aliexpress_deals/site"
            }
        }
    }
}
```

### הגדרה ב-VS Code (Copilot)

הוסיפו לקובץ `.vscode/mcp.json` בתיקיית הפרויקט:

```json
{
    "servers": {
        "aliexpress-deals": {
            "command": "python",
            "args": ["-m", "mcp_server"],
            "cwd": "${workspaceFolder}/landing_pages/aliexpress_deals",
            "env": {
                "SITE_DIR": "${workspaceFolder}/landing_pages/aliexpress_deals/site"
            }
        }
    }
}
```

### כלים זמינים (MCP Tools)

| כלי | תיאור |
|---|---|
| `list_categories` | הצגת כל הקטגוריות |
| `create_category` | יצירת קטגוריה חדשה |
| `delete_category` | מחיקת קטגוריה |
| `list_images` | הצגת תמונות בקטגוריה |
| `upload_image` | העלאת תמונה (base64) עם כותרת ותיאור |
| `add_image_entry` | הוספת רשומה לתמונה קיימת |
| `delete_image` | מחיקת תמונה |
| `add_product` | הוספת קישור מוצר לתמונה |
| `remove_product` | הסרת מוצר מתמונה |
| `get_site_data` | צפייה בכל הנתונים |

### דוגמאות שימוש עם AI Agent

אפשר לבקש מה-Agent טבעית:
- *"תעלה את התמונה הזו לקטגוריית מטבח עם הכותרת 'מטבח מודרני'"*
- *"תוסיף מוצר מנורת LED למחיר 25–45 ש"ח לתמונה nursery-room.jpg בקטגוריית הורות"*
- *"תצור קטגוריה חדשה 'חיות מחמד' עם הסמל 🐾"*
- *"תראה לי את כל הנתונים באתר"*

## REST API

ה-API רץ על port 8082 (בתוך Docker) ומספק את אותן יכולות דרך HTTP:

| Method | Endpoint | תיאור |
|---|---|---|
| `GET` | `/api/categories` | רשימת קטגוריות |
| `POST` | `/api/categories` | יצירת קטגוריה |
| `DELETE` | `/api/categories/{id}` | מחיקת קטגוריה |
| `GET` | `/api/categories/{id}/images` | רשימת תמונות |
| `POST` | `/api/categories/{id}/images/upload` | העלאת תמונה (multipart) |
| `POST` | `/api/categories/{id}/images/entry` | הוספת רשומת תמונה |
| `DELETE` | `/api/categories/{id}/images/{file}` | מחיקת תמונה |
| `GET` | `/api/categories/{id}/images/{file}/products` | רשימת מוצרים |
| `POST` | `/api/categories/{id}/images/{file}/products` | הוספת מוצר |
| `DELETE` | `/api/categories/{id}/images/{file}/products/{idx}` | מחיקת מוצר |
| `GET` | `/api/data` | כל הנתונים |
| `GET` | `/api/health` | בדיקת תקינות |

תיעוד מלא (Swagger): http://localhost:8082/docs

## העלאה ל-Cloudflare Pages (חינם)

1. העלו את הפרויקט ל-GitHub
2. היכנסו ל-[Cloudflare Dashboard → Pages](https://dash.cloudflare.com/?to=/:account/pages)
3. לחצו **Create a project** → **Connect to Git**
4. בחרו את ה-repo
5. הגדרות Build:
   - **Build command:** _(השאירו ריק)_
   - **Build output directory:** `landing_pages/aliexpress_deals/site`
6. לחצו **Save and Deploy**

האתר יקבל כתובת חינמית: `https://<project-name>.pages.dev`

### עדכון אוטומטי
כל push ל-GitHub → Cloudflare Pages בונה ומפרוס מחדש אוטומטית.
אין צורך בבסיס נתונים – הכל סטטי בקוד.

## תהליך עבודה מומלץ

1. **צרו תמונה** עם AI (Midjourney, DALL-E, וכדומה)
2. **זהו מוצרים** בתמונה ומצאו אותם ב-AliExpress (רצוי עם affiliate link)
3. **הוסיפו** את התמונה לתיקייה ואת הנתונים ל-`data.js`
4. **Push** ל-GitHub → האתר מתעדכן אוטומטית

## רישיון

MIT
# Images_to_links_site
