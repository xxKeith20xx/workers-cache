export default {
  async fetch(request, env, ctx) {
    const cacheKey = new URL('https://keith20.org/logo.png'); // Custom cache key
    const cache = caches.default;

    // Check if the response is already cached
    let cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      console.log('Serving from cache');
      return addCorsHeaders(cachedResponse);
    }

    console.log('Fetching from origin');
    const originUrl = 'https://keith20.org/logo.png'; // File to fetch
    const response = await fetch(originUrl);

    if (!response.ok) {
      return new Response('Failed to fetch file', { status: 500 });
    }

    // Clone response before caching
    const responseClone = new Response(response.body, response);

    // Store in Cache API with a custom key
    ctx.waitUntil(cache.put(cacheKey, responseClone));

    return addCorsHeaders(response);
  },
};

// Function to add CORS headers
function addCorsHeaders(response) {
  const newHeaders = new Headers(response.headers);
  newHeaders.set('Access-Control-Allow-Origin', '*'); // Allow all domains
  newHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  newHeaders.set('Access-Control-Allow-Headers', 'Content-Type');

  return new Response(response.body, { ...response, headers: newHeaders });
}
