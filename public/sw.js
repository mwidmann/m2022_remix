self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  const method = event.request.method

  if (method.toLowerCase() !== 'get') return

  if (
    url.pathname.startsWith('/fonts/') ||
    url.pathname.startsWith('/favicon') ||
    url.pathname.startsWith('/build/') ||
    url.pathname.startsWith('/app/')
  ) {
    event.respondWith(
      caches.open('assets').then(async (cache) => {
        const cacheResponse = await cache.match(event.request)
        if (cacheResponse) return cacheResponse

        const fetchResponse = await fetch(event.request)
        cache.put(event.request, fetchResponse.clone())

        return fetchResponse
      })
    )
  }

  return
})