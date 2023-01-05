/**
 * Service worker.
 */
const version = '1.0.0'

self.addEventListener('install', (event) => {
  console.log('SW: Installed. ', version)
  /**
   * Caches assets from a predefined list of file paths.
   *
   * @returns {Promise} - A Promise that resolves when the assets have been added to the cache.
   */
  const cacheAssets = async () => {
    const cache = await self.caches.open(version)
    console.log('SW: Caching.')
    return cache.addAll([
      'index.html',
      'css/styles.css',
      'images/memory-game/backside.png',
      'images/memory-game/hero.png',
      'images/memory-game/kirby.png',
      'images/memory-game/mario.png',
      'images/memory-game/megaman.png',
      'images/memory-game/pacman.png',
      'images/memory-game/pirahnaplant.png',
      'images/memory-game/reset.png',
      'images/memory-game/winner.gif',
      'images/memory-game/winner.mp3',
      'images/memory-game/wolf.png',
      'images/memory-game/yoshi.png'
    ])
  }

  event.waitUntil(cacheAssets())
})

self.addEventListener('fetch', (event) => {
  console.log('SW: Fetching.')
  /**
   * Asynchronously fetches a request and stores the response in the cache.
   * If the fetch fails, it returns the cached response for the request.
   *
   * @param {Request} request - The request to fetch.
   * @returns {Promise<Response>} - A Promise that resolves with the response.
   */
  const cachedFetch = async (request) => {
    try {
      const response = await fetch(request)

      const cache = await caches.open(version)
      cache.put(request, response.clone())

      return response
    } catch (error) {
      console.info('SW: Serving cached result')
      return self.caches.match(request)
    }
  }

  event.respondWith(cachedFetch(event.request))
})
