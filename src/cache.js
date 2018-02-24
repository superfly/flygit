/*
 * The `fly.cache` is a volatile, k/v store for keeping data in each edge location.
 * It's useful for storing fully rendered versions of backend data, and can reduce request
 * times by an order of magnitude.
 *
 * For this application, a generic `CacheResponse` function is useful. It takes a cache key,
 * which is generated based on the requested file, and a function for generating content
 * when the cache has no data for a given request.
 */

export default async function cacheResponse(key, fetchFn) {
  try {
    let cacheStatus = "MISS"

    /*
     * We may want to apply cache filling logic in multiple places, wrapping it in a
     * new async function is a convenient way to do that.
     */
    async function fillAndSet() {
      const resp = await fetchFn();
      if (resp.status > 200) {
        /*
         * When the fetchFn returns an error, no caching.
         */
        return resp
      }
      const body = await resp.text()
      const entry = {
        body: body,
        contentType: resp.headers.get('content-type'),
        time: Date.now()
      }
      fly.cache.set(key, JSON.stringify(entry), 86400)
      return resp
    }

    let cached = await fly.cache.getString(key)
    let response

    if (!cached) {
      console.log("cache miss:", key)
      response = await fillAndSet()
      cacheStatus = "MISS"

      response.headers.set('x-cache', cacheStatus)
      return response
    } else {
      console.log("cache hit:", key)
      cacheStatus = "HIT"

      cached = JSON.parse(cached)
      /*
       * If the cached entry is more than 5 minutes old, refresh it in the background.
       *
       * Since `fillAndSet` is an async function, it returns a promise immediately
       * and doesn't affect response time.
       */
      if (cached.time < (Date.now() - 5 * 60 * 1000)) {
        fillAndSet().then(function(result) {
          console.log("cache refreshed:", key)
        }).catch(function(err) {
          console.log("error in refresh")
          console.log("cache refresh failed:", err)
        })
        cacheStatus = "HIT+REFRESH"
      }

      /*
       * The response includes an X-cache headers, which is a pseudo standard way of indicating
       * whether the data comes from the cache, or was generated anew.
       */
      return new Response(cached.body, {
        headers: {
          'content-type': cached.contentType,
          'x-cache': cacheStatus
        }
      })
    }
  } catch (e) {
    console.log("Unexpected error when caching: ", e)

    return new Response("Our caching blew up", {
      status: 500
    })
  }
}