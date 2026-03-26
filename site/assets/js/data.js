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
