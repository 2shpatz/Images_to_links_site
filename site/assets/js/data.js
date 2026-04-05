/**
 * ====================================
 * IMAGE DATA – מציאות מהתמונה
 * ====================================
 *
 * ⚠️  THIS FILE IS THE SINGLE SOURCE OF TRUTH FOR ALL SITE CONTENT.
 *     Images and product data defined here are PERMANENT – they are
 *     deployed as static code via GitHub + Cloudflare Workers.
 *
 * ═══════════════════════════════════════════════════════════════════
 * 🤖 AI AGENT INSTRUCTIONS — HOW TO ADD A NEW ENTRY
 * ═══════════════════════════════════════════════════════════════════
 *
 * OPTION A — Using MCP tools (RECOMMENDED for AI agents):
 *   1. Call `upload_image` with category_id, title, filename,
 *      image_data_base64, and description.
 *      → This saves the image to site/images/<category>/<file>
 *        AND adds the entry to this data.js file automatically.
 *   2. Call `add_product` once per product to attach AliExpress links
 *      with hotspot coordinates to the image.
 *   3. Deploy: run in terminal:
 *      cd /home/shpatz/projects/landing_pages/aliexpress_deals
 *      git add site/ && git commit -m "Add <title>" && git push
 *      npx wrangler deploy
 *   The MCP server name is "aliexpress-deals".
 *
 * OPTION B — Manual file editing:
 *   1. Save image to:  site/images/<category_id>/<filename>.jpg
 *      Formats: .jpg, .jpeg, .png, .webp. Lowercase, hyphens, no spaces.
 *   2. Add entry in categories array below (see structure reference).
 *   3. Deploy (same as step 3 above).
 *
 * ENTRY STRUCTURE REFERENCE:
 *   {
 *       "file": "cozy-nursery.jpg",
 *       "title": "חדר תינוק מעוצב",
 *       "description": "תיאור קצר בעברית",
 *       "products": [
 *           {
 *               "name": "שם המוצר בעברית",
 *               "price": "$XX.XX",
 *               "url": "https://www.aliexpress.com/item/XXXXX.html",
 *               "icon": "🍼",
 *               "coords": { "x": 50, "y": 50 }
 *           }
 *       ]
 *   }
 *
 * TO CREATE A NEW CATEGORY:
 *   MCP: call `create_category` with id, label, and icon.
 *   Manual: add to array: { "id": "pets", "label": "חיות מחמד", "icon": "🐾", "images": [] }
 *   Then create folder: site/images/pets/
 *
 * ⚠️  DEPLOYMENT — THREE STEPS REQUIRED:
 *   1. git add site/ && git commit -m "<message>"
 *   2. git push
 *   3. npx wrangler deploy   ← THIS IS REQUIRED! git push alone does NOT deploy.
 *   The site is a Cloudflare Worker (not Pages). Only `wrangler deploy` updates it.
 *
 * IMPORTANT RULES:
 *   - NEVER store images in a database or KV — always as files in git.
 *   - Every image MUST have at least 1 product with coords. No empty entries.
 *   - Product coords {x, y} are percentages (0–100) from top-left of image.
 *   - All text (title, description, product names) should be in Hebrew.
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
        },
        {
            "id": "parenting",
            "label": "חדר תינוק",
            "icon": "🍼",
            "images": [
                {
                    "file": "cozy-nursery-room.jpg",
                    "title": "חדר תינוק מעוצב ומודרני",
                    "description": "חדר תינוק סקנדינבי חמים עם עיצוב פסטלי, ריהוט עץ טבעי ופריטים מקסימים לתינוק.",
                    "products": [
                        {
                            "name": "מנורת לילה LED בצורת ירח וגלקסיה",
                            "price": "₪3.17",
                            "url": "https://he.aliexpress.com/item/1005007273995598.html",
                            "icon": "🌙",
                            "coords": {
                                "x": 15,
                                "y": 30
                            }
                        },
                        {
                            "name": "מובייל בובות רכות תלוי לעריסה",
                            "price": "₪14.55",
                            "url": "https://he.aliexpress.com/item/1005007168414935.html",
                            "icon": "🧸",
                            "coords": {
                                "x": 60,
                                "y": 15
                            }
                        },
                        {
                            "name": "מובייל מוזיקלי לעריסה עם מקרן כוכבים ושלט רחוק",
                            "price": "₪57.24",
                            "url": "https://he.aliexpress.com/item/1005006210230524.html",
                            "icon": "⭐",
                            "coords": {
                                "x": 55,
                                "y": 5
                            }
                        },
                        {
                            "name": "משטח EVA רך לרצפה בדוגמת עלים – 4 חלקים",
                            "price": "₪26.30",
                            "url": "https://he.aliexpress.com/item/1005006996285747.html",
                            "icon": "🌿",
                            "coords": {
                                "x": 45,
                                "y": 85
                            }
                        },
                        {
                            "name": "מדבקת קיר טבלת גובה ג׳ירף לחדר ילדים",
                            "price": "₪9.28",
                            "url": "https://he.aliexpress.com/item/1005007038234910.html",
                            "icon": "🦒",
                            "coords": {
                                "x": 85,
                                "y": 40
                            }
                        },
                        {
                            "name": "תאורת לילה LED אלחוטית עם חיישן תנועה",
                            "price": "₪6.48",
                            "url": "https://he.aliexpress.com/item/1005006860874836.html",
                            "icon": "💡",
                            "coords": {
                                "x": 20,
                                "y": 55
                            }
                        }
                    ]
                }
            ]
        }
    ]
};
