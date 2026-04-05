/**
 * _worker.js – Cloudflare Pages Advanced Mode Worker
 * 
 * This file is placed in the build output directory (site/).
 * Cloudflare Pages detects it and uses it as the Worker for all requests.
 * 
 * - /api/* requests → handled by the API logic below
 * - All other requests → served as static assets via env.ASSETS
 * 
 * Uses Cloudflare KV (SITE_DATA binding) to store site data.
 */

// ── Helpers ──────────────────────────────────────────────────────

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data, null, 2), {
        status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

function errorResponse(message, status = 400) {
    return jsonResponse({ error: message }, status);
}

const DEFAULT_DATA = { categories: [] };

async function getData(kv) {
    const raw = await kv.get('site_data');
    if (!raw) return { ...DEFAULT_DATA };
    try {
        return JSON.parse(raw);
    } catch {
        return { ...DEFAULT_DATA };
    }
}

async function setData(kv, data) {
    await kv.put('site_data', JSON.stringify(data));
}

function findCategory(data, categoryId) {
    return data.categories.find(c => c.id === categoryId) || null;
}

function findImage(category, imageFile) {
    return (category.images || []).find(i => i.file === imageFile) || null;
}

function guessContentType(filename) {
    const ext = (filename.split('.').pop() || '').toLowerCase();
    const types = {
        jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
        webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml',
        avif: 'image/avif',
    };
    return types[ext] || 'application/octet-stream';
}

// ── Main Worker export ───────────────────────────────────────────

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // Handle CORS preflight
        if (method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Max-Age': '86400',
                },
            });
        }

        // Non-API requests → serve static assets
        if (!path.startsWith('/api/')) {
            return env.ASSETS.fetch(request);
        }

        // API requests need KV
        const kv = env.SITE_DATA;
        if (!kv) {
            return errorResponse(
                'KV namespace SITE_DATA not bound. Configure in Cloudflare Dashboard → Pages → Settings → Bindings.',
                500
            );
        }

        try {
            return await handleAPI(path, method, request, kv);
        } catch (err) {
            return errorResponse(`Internal error: ${err.message}`, 500);
        }
    },
};

// ── API Router ───────────────────────────────────────────────────

async function handleAPI(path, method, request, kv) {

    // ── GET /api/health ──────────────────────────────────
    if (path === '/api/health' && method === 'GET') {
        const data = await getData(kv);
        return jsonResponse({
            status: 'ok',
            categories: data.categories.length,
            total_images: data.categories.reduce((sum, c) => sum + (c.images || []).length, 0),
        });
    }

    // ── GET /api/data ────────────────────────────────────
    if (path === '/api/data' && method === 'GET') {
        const data = await getData(kv);
        return jsonResponse(data);
    }

    // ── GET /api/data.js ─────────────────────────────────
    if (path === '/api/data.js' && method === 'GET') {
        const data = await getData(kv);
        const js = `const SITE_DATA = ${JSON.stringify(data)};`;
        return new Response(js, {
            headers: {
                'Content-Type': 'application/javascript; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=60',
            },
        });
    }

    // ── POST /api/data/seed ──────────────────────────────
    if (path === '/api/data/seed' && method === 'POST') {
        const body = await request.json();
        if (!body.categories || !Array.isArray(body.categories)) {
            return errorResponse('Body must contain a "categories" array');
        }
        await setData(kv, body);
        return jsonResponse({ status: 'seeded', categories: body.categories.length });
    }

    // ── GET /api/categories ──────────────────────────────
    if (path === '/api/categories' && method === 'GET') {
        const data = await getData(kv);
        const result = data.categories.map(c => ({
            id: c.id,
            label: c.label,
            icon: c.icon,
            image_count: (c.images || []).length,
        }));
        return jsonResponse(result);
    }

    // ── POST /api/categories ─────────────────────────────
    if (path === '/api/categories' && method === 'POST') {
        const body = await request.json();
        const { id, label, icon = '📁' } = body;
        if (!id || !label) return errorResponse('Missing required fields: id, label');

        const data = await getData(kv);
        if (findCategory(data, id)) {
            return errorResponse(`Category '${id}' already exists`, 409);
        }

        data.categories.push({ id, label, icon, images: [] });
        await setData(kv, data);
        return jsonResponse({ status: 'created', category: id }, 201);
    }

    // ── DELETE /api/categories/:id ───────────────────────
    const catMatch = path.match(/^\/api\/categories\/([^/]+)$/);
    if (catMatch && method === 'DELETE') {
        const categoryId = decodeURIComponent(catMatch[1]);
        const data = await getData(kv);
        const cat = findCategory(data, categoryId);
        if (!cat) return errorResponse(`Category '${categoryId}' not found`, 404);

        data.categories = data.categories.filter(c => c.id !== categoryId);
        await setData(kv, data);
        return jsonResponse({ status: 'deleted', category: categoryId });
    }

    // ── GET /api/categories/:id/images ───────────────────
    const imagesMatch = path.match(/^\/api\/categories\/([^/]+)\/images$/);
    if (imagesMatch && method === 'GET') {
        const categoryId = decodeURIComponent(imagesMatch[1]);
        const data = await getData(kv);
        const cat = findCategory(data, categoryId);
        if (!cat) return errorResponse(`Category '${categoryId}' not found`, 404);
        return jsonResponse(cat.images || []);
    }

    // ── POST /api/categories/:id/images ──────────────────
    if (imagesMatch && method === 'POST') {
        const categoryId = decodeURIComponent(imagesMatch[1]);
        const data = await getData(kv);
        const cat = findCategory(data, categoryId);
        if (!cat) return errorResponse(`Category '${categoryId}' not found`, 404);

        const body = await request.json();
        const { file, title, description = '', products = [] } = body;
        if (!file || !title) return errorResponse('Missing required fields: file, title');

        if (findImage(cat, file)) {
            return errorResponse(`Image '${file}' already exists in '${categoryId}'`, 409);
        }

        const entry = { file, title, description, products };
        cat.images = cat.images || [];
        cat.images.push(entry);
        await setData(kv, data);
        return jsonResponse({ status: 'added', image: entry }, 201);
    }

    // ── POST /api/categories/:id/images/upload ───────────
    const uploadMatch = path.match(/^\/api\/categories\/([^/]+)\/images\/upload$/);
    if (uploadMatch && method === 'POST') {
        const categoryId = decodeURIComponent(uploadMatch[1]);
        const data = await getData(kv);
        const cat = findCategory(data, categoryId);
        if (!cat) return errorResponse(`Category '${categoryId}' not found`, 404);

        const body = await request.json();
        const { file, title, description = '', products = [], image_base64 } = body;
        if (!file || !title) return errorResponse('Missing required fields: file, title');

        if (findImage(cat, file)) {
            return errorResponse(`Image '${file}' already exists in '${categoryId}'`, 409);
        }

        // Store image binary in KV if base64 provided
        if (image_base64) {
            const imageBytes = Uint8Array.from(atob(image_base64), c => c.charCodeAt(0));
            await kv.put(`image:${categoryId}/${file}`, imageBytes.buffer, {
                metadata: { contentType: guessContentType(file) },
            });
        }

        const entry = { file, title, description, products };
        cat.images = cat.images || [];
        cat.images.push(entry);
        await setData(kv, data);

        return jsonResponse({
            status: 'uploaded',
            image: entry,
            image_url: image_base64 ? `/api/images/${categoryId}/${file}` : null,
        }, 201);
    }

    // ── GET /api/images/:category/:file ──────────────────
    // Redirect to static file — images are served from site/images/
    const imageServeMatch = path.match(/^\/api\/images\/([^/]+)\/(.+)$/);
    if (imageServeMatch && method === 'GET') {
        const categoryId = decodeURIComponent(imageServeMatch[1]);
        const fileName = decodeURIComponent(imageServeMatch[2]);
        const staticUrl = new URL(`/images/${categoryId}/${fileName}`, request.url);
        return Response.redirect(staticUrl.toString(), 301);
    }

    // ── DELETE /api/categories/:id/images/:file ──────────
    const singleImageMatch = path.match(/^\/api\/categories\/([^/]+)\/images\/([^/]+)$/);
    if (singleImageMatch && method === 'DELETE') {
        const categoryId = decodeURIComponent(singleImageMatch[1]);
        const imageFile = decodeURIComponent(singleImageMatch[2]);
        const data = await getData(kv);
        const cat = findCategory(data, categoryId);
        if (!cat) return errorResponse(`Category '${categoryId}' not found`, 404);

        const img = findImage(cat, imageFile);
        if (!img) return errorResponse(`Image '${imageFile}' not found in '${categoryId}'`, 404);

        cat.images = (cat.images || []).filter(i => i.file !== imageFile);
        try { await kv.delete(`image:${categoryId}/${imageFile}`); } catch {}
        await setData(kv, data);
        return jsonResponse({ status: 'deleted', image: imageFile });
    }

    // ── GET /api/categories/:id/images/:file/products ────
    const productsMatch = path.match(/^\/api\/categories\/([^/]+)\/images\/([^/]+)\/products$/);
    if (productsMatch && method === 'GET') {
        const categoryId = decodeURIComponent(productsMatch[1]);
        const imageFile = decodeURIComponent(productsMatch[2]);
        const data = await getData(kv);
        const cat = findCategory(data, categoryId);
        if (!cat) return errorResponse(`Category '${categoryId}' not found`, 404);
        const img = findImage(cat, imageFile);
        if (!img) return errorResponse(`Image '${imageFile}' not found in '${categoryId}'`, 404);
        return jsonResponse(img.products || []);
    }

    // ── POST /api/categories/:id/images/:file/products ───
    if (productsMatch && method === 'POST') {
        const categoryId = decodeURIComponent(productsMatch[1]);
        const imageFile = decodeURIComponent(productsMatch[2]);
        const data = await getData(kv);
        const cat = findCategory(data, categoryId);
        if (!cat) return errorResponse(`Category '${categoryId}' not found`, 404);
        const img = findImage(cat, imageFile);
        if (!img) return errorResponse(`Image '${imageFile}' not found in '${categoryId}'`, 404);

        const body = await request.json();
        const { name, price, url: productUrl, icon = '🛒' } = body;
        if (!name || !price || !productUrl) {
            return errorResponse('Missing required fields: name, price, url');
        }

        const product = { name, price, url: productUrl, icon };
        img.products = img.products || [];
        img.products.push(product);
        await setData(kv, data);
        return jsonResponse({ status: 'added', product, total_products: img.products.length }, 201);
    }

    // ── DELETE /api/categories/:id/images/:file/products/:index ──
    const deleteProductMatch = path.match(/^\/api\/categories\/([^/]+)\/images\/([^/]+)\/products\/(\d+)$/);
    if (deleteProductMatch && method === 'DELETE') {
        const categoryId = decodeURIComponent(deleteProductMatch[1]);
        const imageFile = decodeURIComponent(deleteProductMatch[2]);
        const productIndex = parseInt(deleteProductMatch[3], 10);

        const data = await getData(kv);
        const cat = findCategory(data, categoryId);
        if (!cat) return errorResponse(`Category '${categoryId}' not found`, 404);
        const img = findImage(cat, imageFile);
        if (!img) return errorResponse(`Image '${imageFile}' not found`, 404);

        const products = img.products || [];
        if (productIndex < 0 || productIndex >= products.length) {
            return errorResponse(`Product index ${productIndex} out of range (0–${products.length - 1})`, 404);
        }

        const removed = products.splice(productIndex, 1)[0];
        await setData(kv, data);
        return jsonResponse({ status: 'deleted', removed_product: removed });
    }

    // ── Not found ────────────────────────────────────────
    return errorResponse(`Route not found: ${method} ${path}`, 404);
}
