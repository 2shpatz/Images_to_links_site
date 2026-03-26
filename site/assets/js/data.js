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
 */

const SITE_DATA = {
    categories: [
        {
            id: "parenting",
            label: "הורות",
            icon: "👶",
            images: [
                {
                    file: "nursery-room.jpg",
                    title: "חדר תינוקות מעוצב",
                    description: "חדר ילדים מעוצב עם פריטים שניתן למצוא ב-AliExpress",
                    products: [
                        {
                            name: "מנורת לילה LED לחדר ילדים",
                            price: "₪25–45",
                            url: "https://www.aliexpress.com/item/example1.html",
                            icon: "💡"
                        },
                        {
                            name: "מדבקות קיר דקורטיביות",
                            price: "₪10–30",
                            url: "https://www.aliexpress.com/item/example2.html",
                            icon: "🎨"
                        },
                        {
                            name: "ארגונית צעצועים מבד",
                            price: "₪35–60",
                            url: "https://www.aliexpress.com/item/example3.html",
                            icon: "🧸"
                        }
                    ]
                },
                {
                    file: "stroller-park.jpg",
                    title: "טיול בפארק עם עגלה",
                    description: "עגלת תינוק ואביזרים שימושיים לטיולים",
                    products: [
                        {
                            name: "מאוורר קליפס נטען USB",
                            price: "₪20–40",
                            url: "https://www.aliexpress.com/item/example4.html",
                            icon: "🌀"
                        },
                        {
                            name: "תיק החתלה רב-תכליתי",
                            price: "₪50–90",
                            url: "https://www.aliexpress.com/item/example5.html",
                            icon: "🎒"
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
                    file: "modern-kitchen.jpg",
                    title: "מטבח מודרני מאובזר",
                    description: "גאדג׳טים למטבח שיהפכו את הבישול לקל יותר",
                    products: [
                        {
                            name: "קולפן ירקות רב-תכליתי",
                            price: "₪8–15",
                            url: "https://www.aliexpress.com/item/example6.html",
                            icon: "🥕"
                        },
                        {
                            name: "ארגונית מגירות מטבח",
                            price: "₪20–45",
                            url: "https://www.aliexpress.com/item/example7.html",
                            icon: "📦"
                        },
                        {
                            name: "מדחום מטבח דיגיטלי",
                            price: "₪15–30",
                            url: "https://www.aliexpress.com/item/example8.html",
                            icon: "🌡️"
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
                    file: "desk-setup.jpg",
                    title: "שולחן עבודה מסודר",
                    description: "אביזרים לשולחן שישדרגו את סביבת העבודה",
                    products: [
                        {
                            name: "מעמד לפטופ מתכוונן",
                            price: "₪30–70",
                            url: "https://www.aliexpress.com/item/example9.html",
                            icon: "💻"
                        },
                        {
                            name: "פד טעינה אלחוטי",
                            price: "₪15–35",
                            url: "https://www.aliexpress.com/item/example10.html",
                            icon: "🔋"
                        },
                        {
                            name: "תאורת LED לצג",
                            price: "₪40–80",
                            url: "https://www.aliexpress.com/item/example11.html",
                            icon: "💡"
                        }
                    ]
                },
                {
                    file: "3d-printer-filament.jpg",
                    title: "פילמנט PETG למדפסת תלת-ממד",
                    description: "פילמנט איכותי של KINGROON במחיר מבצע מטורף",
                    products: [
                        {
                            name: "KINGROON PETG 3D Printer Filament",
                            price: "₪150",
                            url: "https://www.aliexpress.com/item/example-3d.html",
                            icon: "🖨️"
                        }
                    ]
                },
                {
                    file: "weather-station.jpg",
                    title: "תחנת מזג אוויר חכמה",
                    description: "תחנת מזג אוויר ניידת עם חיבור Wifi",
                    products: [
                        {
                            name: "Small Portable Smart Wifi Weather Station",
                            price: "₪7",
                            url: "https://www.aliexpress.com/item/example-weather.html",
                            icon: "🌡️"
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
                    file: "living-room.jpg",
                    title: "סלון מעוצב",
                    description: "פריטי עיצוב לסלון שמשדרגים כל חלל",
                    products: [
                        {
                            name: "כרית נוי דקורטיבית",
                            price: "₪15–35",
                            url: "https://www.aliexpress.com/item/example12.html",
                            icon: "🛋️"
                        },
                        {
                            name: "שעון קיר מודרני",
                            price: "₪25–55",
                            url: "https://www.aliexpress.com/item/example13.html",
                            icon: "🕐"
                        }
                    ]
                }
            ]
        }
    ]
};
