/**
 * Service worker.
 */
const version = '1.0.0'

self.addEventListener('install', (event) => {
  console.log('SW: Installed. ', version)
  const cacheAssets = async () => {
    const cache = await self.caches.open(version)
    console.log('SW: Caching.')
    return cache.addAll([
      'index.html',
      'css/styles.css'
    ])
  }

  event.waitUntil(cacheAssets())
  // TODO: Add caching
})

self.addEventListener('activate', (event) => {
  console.log('SW: Activated. ', version)
  // TODO: CLear old cache
})

self.addEventListener('fetch', (event) => {
  console.log('SW: Fetching.')
  const cachedFetch = async (request) => {
    try {
      const response = await fetch(request)

      const cache = await caches.open(version)
      cache.put(request, response.clone())

      return response
    } catch (error) {
      console.info('SW: Serving cached result')
      return caches.match(request)
    }
  }

  event.respondWith(cachedFetch(event.request))
  // TODO: Cache new content when online, serve cached content when offline
})

self.addEventListener('message', (event) => {
  console.log('SW: Message received.')
  // TODO: Handle events from main app.
})

self.addEventListener('push', (event) => {
  console.log('SW: Received push message from server.')
  // TODO: Show a notification.
})
