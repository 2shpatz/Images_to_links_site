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
            "id": "kitchen",
            "label": "מטבח",
            "icon": "🍳",
            "images": [
                {
                    "file": "kitchen_room_final.jpg",
                    "title": "מטבח מודרני ומעוצב",
                    "description": "מטבח מאובזר במוצרים איכותיים מאליאקספרס לשיפור חווית הבישול והאירוח.",
                    "products": [
                        {
                            "name": "מנורת תליון LED מוזהבת",
                            "price": "₪240.70",
                            "url": "https://he.aliexpress.com/item/1005006966366435.html",
                            "icon": "💡",
                            "coords": {
                                "x": 50,
                                "y": 20
                            }
                        },
                        {
                            "name": "כסאות בר נורדיים (זוג)",
                            "price": "₪725.83",
                            "url": "https://he.aliexpress.com/item/1005010640884262.html",
                            "icon": "🪑",
                            "coords": {
                                "x": 40,
                                "y": 75
                            }
                        },
                        {
                            "name": "אייר פרייר 5 ליטר",
                            "price": "₪297.26",
                            "url": "https://he.aliexpress.com/item/1005010207199904.html",
                            "icon": "🍳",
                            "coords": {
                                "x": 75,
                                "y": 55
                            }
                        },
                        {
                            "name": "קומקום חשמלי Midea",
                            "price": "₪118.45",
                            "url": "https://he.aliexpress.com/item/1005010113215929.html",
                            "icon": "🫖",
                            "coords": {
                                "x": 20,
                                "y": 60
                            }
                        },
                        {
                            "name": "טוסטר 2 פרוסות",
                            "price": "₪87.55",
                            "url": "https://he.aliexpress.com/item/1005008519687981.html",
                            "icon": "🍞",
                            "coords": {
                                "x": 30,
                                "y": 60
                            }
                        },
                        {
                            "name": "סט סכינים מקצועי 7 חלקים",
                            "price": "₪89.78",
                            "url": "https://he.aliexpress.com/item/1005007358970951.html",
                            "icon": "🔪",
                            "coords": {
                                "x": 60,
                                "y": 60
                            }
                        },
                        {
                            "name": "מעמד תבלינים 3 קומות",
                            "price": "₪83.09",
                            "url": "https://he.aliexpress.com/item/1005009278474082.html",
                            "icon": "🧂",
                            "coords": {
                                "x": 85,
                                "y": 60
                            }
                        }
                    ]
                }
            ]
        },
        {
            "id": "gaming",
            "label": "גיימינג",
            "icon": "🎮",
            "images": [
                {
                    "file": "gaming_room_final.jpg",
                    "title": "חדר גיימינג מודרני עם מוצרי אליאקספרס",
                    "description": "כל המוצרים אמיתיים וזמינים באליאקספרס. חדר גיימינג מעוצב לשיפור חווית המשחק.",
                    "products": [
                        {
                            "name": "מקלדת מכנית RK RKG68",
                            "price": "₪128.44",
                            "url": "https://he.aliexpress.com/item/1005003716446397.html",
                            "icon": "⌨️",
                            "coords": {
                                "x": 45,
                                "y": 65
                            }
                        },
                        {
                            "name": "עכבר Razer Basilisk V3",
                            "price": "₪153.63",
                            "url": "https://he.aliexpress.com/item/1005010650792010.html",
                            "icon": "🖱️",
                            "coords": {
                                "x": 60,
                                "y": 68
                            }
                        },
                        {
                            "name": "אוזניות ONIKUMA X25",
                            "price": "₪69.82",
                            "url": "https://he.aliexpress.com/item/1005008196060222.html",
                            "icon": "🎧",
                            "coords": {
                                "x": 30,
                                "y": 55
                            }
                        },
                        {
                            "name": "מנורות קיר משושות RGB",
                            "price": "₪77.10",
                            "url": "https://he.aliexpress.com/item/1005006275326644.html",
                            "icon": "💡",
                            "coords": {
                                "x": 50,
                                "y": 25
                            }
                        },
                        {
                            "name": "משטח עכבר RGB ענק",
                            "price": "₪48.81",
                            "url": "https://he.aliexpress.com/item/1005003823347076.html",
                            "icon": "⬛",
                            "coords": {
                                "x": 50,
                                "y": 70
                            }
                        },
                        {
                            "name": "מעמד לבקר ואוזניות",
                            "price": "₪24.36",
                            "url": "https://he.aliexpress.com/item/1005007096432815.html",
                            "icon": "🎮",
                            "coords": {
                                "x": 70,
                                "y": 60
                            }
                        }
                    ]
                }
            ]
        },
        {
            "id": "camping",
            "label": "קמפינג וטיולים",
            "icon": "🏕️",
            "images": [
                {
                    "file": "camping_room_final.jpg",
                    "title": "קמפינג וטיולים בטבע",
                    "description": "ציוד קמפינג איכותי ומודרני לחוויית שטח מושלמת.",
                    "products": [
                        {
                            "name": "כירה אינפרא אדומה BISINNA",
                            "price": "₪144.13",
                            "url": "https://he.aliexpress.com/item/1005009594126670.html",
                            "icon": "🔥",
                            "coords": {
                                "x": 45,
                                "y": 75
                            }
                        },
                        {
                            "name": "מכונת אספרסו ניידת",
                            "price": "₪121.72",
                            "url": "https://he.aliexpress.com/item/1005009460471862.html",
                            "icon": "☕",
                            "coords": {
                                "x": 55,
                                "y": 70
                            }
                        },
                        {
                            "name": "עששית קמפינג רטרו",
                            "price": "₪30.00",
                            "url": "https://he.aliexpress.com/item/1005006727508946.html",
                            "icon": "🏮",
                            "coords": {
                                "x": 35,
                                "y": 60
                            }
                        },
                        {
                            "name": "שולחן קמפינג מתקפל",
                            "price": "₪74.64",
                            "url": "https://he.aliexpress.com/item/1005005653995402.html",
                            "icon": "🪑",
                            "coords": {
                                "x": 50,
                                "y": 80
                            }
                        },
                        {
                            "name": "תיק אחסון טקטי",
                            "price": "₪47.95",
                            "url": "https://he.aliexpress.com/item/1005009045188656.html",
                            "icon": "🎒",
                            "coords": {
                                "x": 70,
                                "y": 65
                            }
                        },
                        {
                            "name": "סט סירים CAMPINGMOON",
                            "price": "₪47.16",
                            "url": "https://he.aliexpress.com/item/1005007353164081.html",
                            "icon": "🍲",
                            "coords": {
                                "x": 40,
                                "y": 70
                            }
                        }
                    ]
                }
            ]
        }
    ]
};
