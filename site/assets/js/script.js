/* ====================================
   ALIEXPRESS DEALS – JAVASCRIPT
   ==================================== */

// ============ STATE ============
let currentCategory = null;

// ============ INIT ============
async function initSite() {
    // Try loading data from API, fall back to static data.js
    await loadSiteData();

    buildNavTabs();
    buildCategoryTabs();

    // Default to first category
    if (SITE_DATA.categories.length > 0) {
        selectCategory(SITE_DATA.categories[0].id);
    }

    initFadeIn();
    initHeaderScroll();
    initOrbParallax();
}

// Check readyState instead of DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSite);
} else {
    initSite();
}

// ============ LOAD DATA FROM API ============
async function loadSiteData() {
    try {
        const resp = await fetch('/api/data');
        if (resp.ok) {
            const data = await resp.json();
            if (data && data.categories && data.categories.length > 0) {
                // Merge API data into static SITE_DATA by matching category IDs
                data.categories.forEach(apiCat => {
                    const staticCat = SITE_DATA.categories.find(c => c.id === apiCat.id);
                    if (staticCat) {
                        // Add images from API that aren't in static data
                        if (apiCat.images && apiCat.images.length > 0) {
                            apiCat.images.forEach(apiImg => {
                                if (!staticCat.images.find(i => i.file === apiImg.file)) {
                                    staticCat.images.push(apiImg);
                                }
                            });
                        }
                    } else {
                        // New category from API
                        SITE_DATA.categories.push(apiCat);
                    }
                });
            }
        }
    } catch (e) {
        // API unavailable – use static data.js fallback
        console.log('API unavailable, using static data.js');
    }
}

// ============ BUILD NAV TABS ============
function buildNavTabs() {
    const navLinks = document.getElementById('nav-links');
    const mobileMenu = document.getElementById('mobile-menu');

    SITE_DATA.categories.forEach(cat => {
        // Desktop nav
        const a = document.createElement('a');
        a.textContent = `${cat.icon} ${cat.label}`;
        a.dataset.category = cat.id;
        a.addEventListener('click', () => {
            selectCategory(cat.id);
            scrollToSection('gallery');
        });
        navLinks.appendChild(a);

        // Mobile nav
        const ma = document.createElement('a');
        ma.textContent = `${cat.icon} ${cat.label}`;
        ma.dataset.category = cat.id;
        ma.addEventListener('click', () => {
            selectCategory(cat.id);
            scrollToSection('gallery');
            toggleMobileMenu();
        });
        mobileMenu.appendChild(ma);
    });
}

// ============ BUILD CATEGORY TABS ============
function buildCategoryTabs() {
    const tabsBar = document.getElementById('tabs-bar');

    // "All" tab
    const allBtn = document.createElement('button');
    allBtn.className = 'tab-btn';
    allBtn.textContent = '🌟 הכל';
    allBtn.dataset.category = '__all__';
    allBtn.addEventListener('click', () => selectCategory('__all__'));
    tabsBar.appendChild(allBtn);

    SITE_DATA.categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn';
        btn.textContent = `${cat.icon} ${cat.label}`;
        btn.dataset.category = cat.id;
        btn.addEventListener('click', () => selectCategory(cat.id));
        tabsBar.appendChild(btn);
    });
}

// ============ SELECT CATEGORY ============
function selectCategory(categoryId) {
    currentCategory = categoryId;

    // Update active states on tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === categoryId);
    });

    // Update nav active states
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
        if (categoryId === '__all__') {
            a.classList.remove('active');
        } else {
            a.classList.toggle('active', a.dataset.category === categoryId);
        }
    });

    renderGallery(categoryId);
}

// ============ RENDER GALLERY ============
function renderGallery(categoryId) {
    const grid = document.getElementById('gallery-grid');
    const empty = document.getElementById('empty-state');
    grid.innerHTML = '';

    let images = [];

    if (categoryId === '__all__') {
        SITE_DATA.categories.forEach(cat => {
            cat.images.forEach(img => {
                images.push({ ...img, categoryId: cat.id, categoryLabel: cat.label, categoryIcon: cat.icon });
            });
        });
    } else {
        const cat = SITE_DATA.categories.find(c => c.id === categoryId);
        if (cat) {
            cat.images.forEach(img => {
                images.push({ ...img, categoryId: cat.id, categoryLabel: cat.label, categoryIcon: cat.icon });
            });
        }
    }

    if (images.length === 0) {
        empty.style.display = 'block';
        grid.style.display = 'none';
        return;
    }

    empty.style.display = 'none';
    grid.style.display = 'grid';

    images.forEach((img, idx) => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.addEventListener('click', () => openModal(img));

        // Try static path first, then API-served image from KV
        const staticPath = `images/${img.categoryId}/${img.file}`;
        const apiPath = `/api/images/${img.categoryId}/${img.file}`;

        card.innerHTML = `
            <img class="gallery-card-image" src="${staticPath}" alt="${img.title}"
                 onerror="if(this.dataset.tried){this.src='data:image/svg+xml,${encodeURIComponent(placeholderSVG(img.title))}';}else{this.dataset.tried='1';this.src='${apiPath}';}" loading="lazy" />
            <div class="gallery-card-body">
                <div class="gallery-card-title">${img.title}</div>
                <div class="gallery-card-count">
                    ${img.categoryIcon} ${img.categoryLabel} · <span>${img.products.length} מוצרים</span>
                </div>
            </div>
        `;

        // Stagger animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, idx * 80);

        grid.appendChild(card);
    });
}

// ============ PLACEHOLDER SVG ============
function placeholderSVG(title) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#f8ece0"/>
        <text x="200" y="140" text-anchor="middle" font-family="Arial" font-size="16" fill="#bbb">🖼️</text>
        <text x="200" y="170" text-anchor="middle" font-family="Arial" font-size="13" fill="#aaa">${title}</text>
    </svg>`;
}

// ============ MODAL ============
function openModal(imageData) {
    const overlay = document.getElementById('modal-overlay');
    const modalImg = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-description');
    const modalProducts = document.getElementById('modal-products');

    const staticPath = `images/${imageData.categoryId}/${imageData.file}`;
    const apiPath = `/api/images/${imageData.categoryId}/${imageData.file}`;
    modalImg.src = staticPath;
    modalImg.onerror = function() {
        if (!this.dataset.tried) {
            this.dataset.tried = '1';
            this.src = apiPath;
        } else {
            this.src = `data:image/svg+xml,${encodeURIComponent(placeholderSVG(imageData.title))}`;
        }
    };
    modalTitle.textContent = imageData.title;
    modalDesc.textContent = imageData.description;

    // Build product links and hotspots
    modalProducts.innerHTML = '';
    const hotspotContainer = document.getElementById('hotspot-container');
    hotspotContainer.innerHTML = '';

    imageData.products.forEach((product, idx) => {
        // 1. Create Product Link
        const link = document.createElement('a');
        link.className = 'product-link';
        link.href = product.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.dataset.index = idx;

        link.innerHTML = `
            <div class="product-link-icon">${product.icon}</div>
            <div class="product-link-info">
                <div class="product-link-name">${product.name}</div>
                <div class="product-link-price">${product.price}</div>
            </div>
            <div class="product-link-arrow">←</div>
        `;

        // 2. Create Hotspot (if coordinates exist)
        let hotspot = null;
        if (product.coords) {
            hotspot = document.createElement('div');
            hotspot.className = 'hotspot';
            hotspot.style.left = `${product.coords.x}%`;
            hotspot.style.top = `${product.coords.y}%`;
            hotspot.dataset.index = idx;
            hotspotContainer.appendChild(hotspot);
            
            // Show hotspots with a slight delay
            setTimeout(() => hotspot.classList.add('visible'), 300 + (idx * 100));

            // Hotspot Hover -> Link Glow
            hotspot.addEventListener('mouseenter', () => {
                hotspot.classList.add('active');
                link.classList.add('active');
                link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
            hotspot.addEventListener('mouseleave', () => {
                hotspot.classList.remove('active');
                link.classList.remove('active');
            });
            hotspot.addEventListener('click', (e) => {
                e.stopPropagation();
                window.open(product.url, '_blank');
            });
        }

        // Link Hover -> Hotspot Glow
        link.addEventListener('mouseenter', () => {
            link.classList.add('active');
            if (hotspot) hotspot.classList.add('active');
        });
        link.addEventListener('mouseleave', () => {
            link.classList.remove('active');
            if (hotspot) hotspot.classList.remove('active');
        });

        modalProducts.appendChild(link);
    });

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal(event) {
    if (event && event.target !== event.currentTarget && !event.target.closest('.modal-close')) return;
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

// Close modal/preview on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const preview = document.getElementById('image-preview-overlay');
        if (preview.classList.contains('open')) {
            preview.classList.remove('open');
        } else {
            closeModal();
        }
    }
});

// ============ SMOOTH SCROLL ============
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ============ MOBILE MENU ============
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('open');
}

// ============ FADE-IN ON SCROLL ============
function initFadeIn() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));
}

// ============ HEADER SCROLL EFFECT ============
function initHeaderScroll() {
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ============ ORB PARALLAX ============
function initOrbParallax() {
    const orb = document.querySelector('.floating-orb');
    if (orb) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 25;
            const y = (e.clientY / window.innerHeight - 0.5) * 25;
            orb.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        });
    }
}

// ============ IMAGE PREVIEW ============
function openImagePreview() {
    const modalImg = document.getElementById('modal-image');
    const preview = document.getElementById('image-preview-overlay');
    const previewImg = document.getElementById('preview-image');
    previewImg.src = modalImg.src;
    preview.classList.add('open');
}

function closeImagePreview(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('image-preview-overlay').classList.remove('open');
}

console.log('מציאות מהתמונה loaded ✨');
