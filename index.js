addEventListener('fetch', event => {
  event.respondWith(handleRequest(event));
})

/**
 * Fetch and log a request
 * @param {Request} request
 */
async function handleRequest(event) {
  try {
    if (event.request.method === 'GET') {
      let response = await serveAsset(event)
      if (response.status > 399) {
        response = new Response(response.statusText, { status: response.status })
      }
      return response
    } else {
      return new Response('Method not allowed', { status: 405 });
    }
  } catch (error) {
    return new Response(error, {status: 500});
  }
}

async function serveAsset(event) {
  try {
    const url = new URL(event.request.url);
    const BUCKET_URL = await STORAGE_NAMESPACE.get("s3Url");
    if (BUCKET_URL == null) {
      return new Response("BUCKET_URL not found", {status: 404});  
    }
    return fetch(`${BUCKET_URL}${url.pathname}`);
  } catch (error) {
    console.log("Failed to get kv value");
    throw(error);
  }
}
