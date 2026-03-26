/**
 * ====================================
 * IMAGE DATA – מציאות מהתמונה
 * ====================================
 *
 * HOW TO ADD NEW IMAGES:
 * 1. Place the image file in: images/<category_id>/
 *    e.g. images/parenting/my-image.jpg
 * 2. Add a new entry below under the matching category.
 * 3. Push to GitHub → Cloudflare Pages auto-deploys.
 *
 * CATEGORY STRUCTURE:
 * Each category has:
 *   id       – folder name under images/
 *   label    – Hebrew display name
 *   icon     – emoji shown on tab
 *   images[] – list of images with products
 *
 * IMAGE STRUCTURE:
 *   file        – filename (relative to images/<category_id>/)
 *   title       – Hebrew title for the image
 *   description – short description
 *   products[]  – list of AliExpress products found in the image
 *
 * PRODUCT STRUCTURE:
 *   name   – Hebrew product name
 *   price  – approximate price string (e.g. "₪15–25")
 *   url    – full AliExpress affiliate link
 *   icon   – emoji icon for the product
 *   coords – {x, y} percentage coordinates for the hotspot (0-100)
 */

const SITE_DATA = {
    categories: [
        {
            id: "parenting",
            label: "הורות",
            icon: "👶",
            images: [
                {
                    file: "annotated-nursery.jpg",
                    title: "חדר תינוקות מודרני ורחב",
                    description: "מבט רחב על חדר תינוקות מעוצב עם פריטים נבחרים מ-AliExpress",
                    products: [
                        {
                            name: "מיטת תינוק מעץ אורן טבעי",
                            price: "₪1,250",
                            url: "https://www.aliexpress.com/item/1005007129769976.html",
                            icon: "🛏️",
                            coords: { x: 35, y: 65 }
                        },
                        {
                            name: "שטיח ענן רך ופרוותי",
                            price: "₪45",
                            url: "https://www.aliexpress.com/item/1005007980084828.html",
                            icon: "☁️",
                            coords: { x: 50, y: 85 }
                        },
                        {
                            name: "כיסא נדנדה ראטן מעוצב",
                            price: "₪1,650",
                            url: "https://www.aliexpress.com/item/1005009148075112.html",
                            icon: "🪑",
                            coords: { x: 75, y: 70 }
                        },
                        {
                            name: "סט מדפי ענן דקורטיביים",
                            price: "₪85",
                            url: "https://www.aliexpress.com/item/1005006821107202.html",
                            icon: "☁️",
                            coords: { x: 20, y: 30 }
                        }
                    ]
                }
            ]
        },
        {
            id: "kitchen",
            label: "מטבח",
            icon: "🍳",
            images: [
                {
                    file: "annotated-kitchen.jpg",
                    title: "מטבח מודרני עם מוצרים נבחרים",
                    description: "מטבח מעוצב עם פריטים שניתן למצוא ב-AliExpress, כולל סימונים על התמונה",
                    products: [
                        {
                            name: "קומקום חשמלי מעוצב שחור מט",
                            price: "₪180",
                            url: "https://www.aliexpress.com/item/1005009283926938.html",
                            icon: "🫖",
                            coords: { x: 30, y: 60 }
                        },
                        {
                            name: "סט צנצנות תבלינים עם מעמד עץ",
                            price: "₪95",
                            url: "https://www.aliexpress.com/item/1005009886221452.html",
                            icon: "🧂",
                            coords: { x: 60, y: 55 }
                        },
                        {
                            name: "דיספנסר שמן זכוכית מעוצב",
                            price: "₪35",
                            url: "https://www.aliexpress.com/item/1005008182446725.html",
                            icon: "🧴",
                            coords: { x: 70, y: 65 }
                        },
                        {
                            name: "פס מגנטי לסכינים מפלדת אל-חלד",
                            price: "₪65",
                            url: "https://www.aliexpress.com/item/1005009394802008.html",
                            icon: "🔪",
                            coords: { x: 85, y: 40 }
                        }
                    ]
                }
            ]
        },
        {
            id: "gadgets",
            label: "גאדג׳טים",
            icon: "📱",
            images: [
                {
                    file: "3d-printer-filament.jpg",
                    title: "פילמנט PETG למדפסת תלת-ממד",
                    description: "פילמנט איכותי של KINGROON במחיר מבצע מטורף",
                    products: [
                        {
                            name: "KINGROON PETG 3D Printer Filament",
                            price: "₪150",
                            url: "https://www.aliexpress.com/item/1005004895787583.html",
                            icon: "🖨️",
                            coords: { x: 50, y: 50 }
                        }
                    ]
                },
                {
                    file: "weather-station.jpg",
                    title: "תחנת מזג אוויר חכמה",
                    description: "תחנת מזג אוויר ניידת עם חיבור Wifi",
                    products: [
                        {
                            name: "GeekMagic Ultra Portable Smart Wifi Weather Station",
                            price: "₪7",
                            url: "https://www.aliexpress.com/item/1005006966276512.html",
                            icon: "🌡️",
                            coords: { x: 50, y: 50 }
                        }
                    ]
                }
            ]
        },
        {
            id: "home",
            label: "בית ועיצוב",
            icon: "🏠",
            images: [
                {
                    file: "wide-living-room-clean.jpg",
                    title: "סלון מודרני רחב ומעוצב",
                    description: "מבט פנורמי על סלון מודרני עם 7 פריטים נבחרים מתחת ל-100$",
                    products: [
                        {
                            name: "מנורת עמידה מינימליסטית",
                            price: "₪110",
                            url: "https://www.aliexpress.com/item/1005009692606690.html",
                            icon: "💡",
                            coords: { x: 34, y: 27 }
                        },
                        {
                            name: "שעון קיר נורדי גדול 80 ס״מ",
                            price: "₪156",
                            url: "https://www.aliexpress.com/item/1005008525381412.html",
                            icon: "🕐",
                            coords: { x: 57, y: 30 }
                        },
                        {
                            name: "ספה מודרנית רחבה",
                            price: "₪350",
                            url: "https://www.aliexpress.com/w/wholesale-modern-sofa.html",
                            icon: "🛋️",
                            coords: { x: 50, y: 55 }
                        },
                        {
                            name: "שולחן קפה מעץ טבעי",
                            price: "₪280",
                            url: "https://www.aliexpress.com/w/wholesale-modern-wood-coffee-table.html",
                            icon: "☕",
                            coords: { x: 43, y: 72 }
                        },
                        {
                            name: "שטיח שאגי לבן ורך",
                            price: "₪120",
                            url: "https://www.aliexpress.com/w/wholesale-plush-white-area-rug.html",
                            icon: "🧶",
                            coords: { x: 40, y: 85 }
                        },
                        {
                            name: "סט 3 כדים קרמיים",
                            price: "₪70",
                            url: "http://www.aliexpress.com/w/wholesale-ceramic-vase-sets.html",
                            icon: "🏺",
                            coords: { x: 11, y: 54 }
                        },
                        {
                            name: "כרבולית סרוגה עבה",
                            price: "₪60",
                            url: "https://www.aliexpress.com/i/1005007387488589.html",
                            icon: "🧣",
                            coords: { x: 78, y: 60 }
                        }
                    ]
                }
            ]
        }
    ]
};
