/**
 * ====================================
 * IMAGE DATA – מציאות מהתמונה
 * ====================================
 *
 * ⚠️  THIS FILE IS THE SINGLE SOURCE OF TRUTH FOR ALL SITE CONTENT.
 *     Images and product data defined here are PERMANENT – they are
 *     deployed as static code via GitHub → Cloudflare Pages.
 *
 * ═══════════════════════════════════════════════════════════════════
 * 🤖 AI AGENT INSTRUCTIONS — HOW TO ADD NEW CONTENT
 * ═══════════════════════════════════════════════════════════════════
 *
 * STEP 1 — Save the image file:
 *   Place the image in:  site/images/<category_id>/<filename>.jpg
 *   Example:             site/images/parenting/cozy-nursery.jpg
 *   Supported formats:   .jpg, .jpeg, .png, .webp
 *   Keep filenames lowercase, use hyphens (no spaces).
 *
 * STEP 2 — Add an entry in this file:
 *   Find (or create) the category in the SITE_DATA.categories array.
 *   Push a new object into that category's `images` array:
 *
 *   {
 *       file: "cozy-nursery.jpg",              // filename only
 *       title: "חדר תינוק מעוצב",               // Hebrew title
 *       description: "תיאור קצר בעברית",         // Hebrew description
 *       products: [                             // AliExpress products
 *           {
 *               name: "שם המוצר בעברית",
 *               price: "$XX.XX",
 *               url: "https://www.aliexpress.com/item/XXXXX.html",
 *               icon: "🍼",                     // emoji for the product
 *               coords: { x: 50, y: 50 }       // hotspot position (0-100%)
 *           }
 *       ]
 *   }
 *
 * STEP 3 — Commit & push:
 *   Both the image file AND this data.js change must be committed.
 *   git add site/images/<category_id>/<filename> site/assets/js/data.js
 *   git commit -m "Add new image: <title>"
 *   git push
 *   Cloudflare Pages will auto-deploy within ~1 minute.
 *
 * TO CREATE A NEW CATEGORY:
 *   Add an object to SITE_DATA.categories:
 *   { id: "pets", label: "חיות מחמד", icon: "🐾", images: [] }
 *   Then create the folder: site/images/pets/
 *
 * IMPORTANT RULES:
 *   - NEVER store images in a database or KV — always as files in git.
 *   - Every image file MUST have a matching entry in this file.
 *   - Every entry here MUST have a matching image file on disk.
 *   - Product coords {x, y} are percentages (0–100) from top-left.
 *   - Use the MCP tools (via mcp_server/) for guided content management.
 *
 * ═══════════════════════════════════════════════════════════════════
 */

const SITE_DATA = {
    "categories": [
        {
            "id": "home",
            "label": "בית ועיצוב",
            "icon": "🏠",
            "images": [
                {
                    "file": "perfect-match-living-room.jpg",
                    "title": "סלון מודרני מינימליסטי",
                    "description": "סלון מעוצב עם 7 פריטים מ-AliExpress שנבחרו בקפידה ויוצרו לתמונה זו",
                    "products": [
                        {
                            "name": "מנורת עמידה LED ספירלה",
                            "price": "$50.56",
                            "url": "https://www.aliexpress.com/item/1005009692606690.html",
                            "icon": "💡",
                            "coords": {
                                "x": 18,
                                "y": 50
                            }
                        },
                        {
                            "name": "שעון קיר נורדי זהב ושחור",
                            "price": "$31.30",
                            "url": "https://www.aliexpress.com/item/1005008525381412.html",
                            "icon": "🕐",
                            "coords": {
                                "x": 55,
                                "y": 25
                            }
                        },
                        {
                            "name": "כרבולית סרוגה עבה אפורה",
                            "price": "$45.99",
                            "url": "https://www.aliexpress.com/item/1005007387488589.html",
                            "icon": "🧣",
                            "coords": {
                                "x": 70,
                                "y": 55
                            }
                        },
                        {
                            "name": "שולחן קפה מעץ טבעי",
                            "price": "$89.50",
                            "url": "https://www.aliexpress.com/w/wholesale-modern-wood-coffee-table.html",
                            "icon": "☕",
                            "coords": {
                                "x": 45,
                                "y": 75
                            }
                        },
                        {
                            "name": "שטיח שאגי לבן רך",
                            "price": "$65.00",
                            "url": "https://www.aliexpress.com/w/wholesale-plush-white-area-rug.html",
                            "icon": "🧶",
                            "coords": {
                                "x": 35,
                                "y": 85
                            }
                        },
                        {
                            "name": "סט כדים קרמיים לבן",
                            "price": "$28.75",
                            "url": "https://www.aliexpress.com/w/wholesale-ceramic-vase-sets.html",
                            "icon": "🏺",
                            "coords": {
                                "x": 75,
                                "y": 50
                            }
                        },
                        {
                            "name": "ספה מודרנית בצבע בז׳",
                            "price": "$299.00",
                            "url": "https://www.aliexpress.com/w/wholesale-modern-sofa.html",
                            "icon": "🛋️",
                            "coords": {
                                "x": 65,
                                "y": 65
                            }
                        }
                    ]
                },
                {
                    "file": "modern-living-room.jpg",
                    "title": "סלון מודרני חם",
                    "description": "חלל מגורים מעוצב עם פריטים לרכישה מ-AliExpress",
                    "products": []
                },
                {
                    "file": "wide-living-room.jpg",
                    "title": "סלון רחב ומרווח",
                    "description": "תמונת סלון פנורמית עם מוצרים מ-AliExpress",
                    "products": []
                },
                {
                    "file": "wide-living-room-clean.jpg",
                    "title": "סלון מינימליסטי נקי",
                    "description": "סלון נקי ומסודר עם פריטי עיצוב לרכישה",
                    "products": []
                },
                {
                    "file": "annotated-living-room.jpg",
                    "title": "סלון מעוצב עם סימונים",
                    "description": "סלון עם פריטים מסומנים לרכישה ישירה",
                    "products": []
                }
            ]
        },
        {
            "id": "kitchen",
            "label": "מטבח",
            "icon": "🍳",
            "images": [
                {
                    "file": "annotated-kitchen.jpg",
                    "title": "מטבח מודרני מאובזר",
                    "description": "מטבח מעוצב עם כלים וגאדג׳טים לרכישה מ-AliExpress",
                    "products": []
                }
            ]
        },
        {
            "id": "gadgets",
            "label": "גאדג׳טים",
            "icon": "🔧",
            "images": [
                {
                    "file": "3d-printer-filament.jpg",
                    "title": "מדפסת תלת מימד וחומרים",
                    "description": "ציוד הדפסת תלת מימד זמין ב-AliExpress",
                    "products": []
                },
                {
                    "file": "weather-station.jpg",
                    "title": "תחנת מזג אוויר ביתית",
                    "description": "גאדג׳ט מזג אוויר חכם לבית מ-AliExpress",
                    "products": []
                }
            ]
        },
        {
            "id": "parenting",
            "label": "הורות",
            "icon": "👶",
            "images": [
                {
                    "file": "annotated-nursery.jpg",
                    "title": "חדר תינוק מעוצב",
                    "description": "חדר ילדים עם פריטים מומלצים מ-AliExpress",
                    "products": []
                }
            ]
        }
    ]
};
