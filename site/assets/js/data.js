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
                    file: "perfect-match-living-room.jpg",
                    title: "סלון מודרני מינימליסטי",
                    description: "סלון מעוצב עם 7 פריטים מ-AliExpress שנבחרו בקפידה ויוצרו לתמונה זו",
                    products: [
                        {
                            name: "מנורת עמידה LED ספירלה",
                            price: "$50.56",
                            url: "https://www.aliexpress.com/item/1005009692606690.html",
                            icon: "💡",
                            coords: { x: 18, y: 50 }
                        },
                        {
                            name: "שעון קיר נורדי זהב ושחור",
                            price: "$31.30",
                            url: "https://www.aliexpress.com/item/1005008525381412.html",
                            icon: "🕐",
                            coords: { x: 55, y: 25 }
                        },
                        {
                            name: "כרבולית סרוגה עבה אפורה",
                            price: "$45.99",
                            url: "https://www.aliexpress.com/item/1005007387488589.html",
                            icon: "🧣",
                            coords: { x: 70, y: 55 }
                        },
                        {
                            name: "שולחן קפה מעץ טבעי",
                            price: "$89.50",
                            url: "https://www.aliexpress.com/w/wholesale-modern-wood-coffee-table.html",
                            icon: "☕",
                            coords: { x: 45, y: 75 }
                        },
                        {
                            name: "שטיח שאגי לבן רך",
                            price: "$65.00",
                            url: "https://www.aliexpress.com/w/wholesale-plush-white-area-rug.html",
                            icon: "🧶",
                            coords: { x: 35, y: 85 }
                        },
                        {
                            name: "סט כדים קרמיים לבן",
                            price: "$28.75",
                            url: "https://www.aliexpress.com/w/wholesale-ceramic-vase-sets.html",
                            icon: "🏺",
                            coords: { x: 75, y: 50 }
                        },
                        {
                            name: "ספה מודרנית בצבע בז׳",
                            price: "$299.00",
                            url: "https://www.aliexpress.com/w/wholesale-modern-sofa.html",
                            icon: "🛋️",
                            coords: { x: 65, y: 65 }
                        }
                    ]
                }
            ]
        }
    ]
};
