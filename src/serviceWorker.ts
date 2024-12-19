/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

self.addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.url.includes('api.anthropic.com')) {
    const modifiedRequest = new Request(event.request.url, {
      method: event.request.method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': event.request.headers.get('x-api-key') || '',
        'anthropic-version': '2023-06-01'
      },
      body: event.request.body,
      mode: 'cors',
      credentials: 'omit'
    });

    event.respondWith(
      fetch(modifiedRequest)
        .then(response => {
          const modifiedResponse = new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version'
            }
          });
          return modifiedResponse;
        })
    );
  }
});
