exports.dispatchFetch = function dispatchFetch(request) {
  return new Promise((resolve, reject) => {
    let event = new FetchEvent('fetch', {
      request: request
    }, function(err, res) {
      if (err)
        return reject(err)
      resolve(res)
    })
    dispatchEvent(event)
  })
}