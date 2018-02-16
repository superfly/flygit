const mime = require('./mime')

const baseRepoUrl = 'https://raw.githubusercontent.com'
const REGEX_CHARSET = /;\s*charset\s*=\s*([^\s;]+)/i

fly.http.route("/", function fileHandler(req, route) {
  const pageTpl = require('./views/index.pug')
  const body = pageTpl({})
  return new Response(body, {
    headers: {
      'content-type': 'text/html'
    }
  })
})

fly.http.route("/:username/:repo/*path", function fileHandler(req, route) {
  const params = route.params
  return async () => {
    const response = await fetchFile(params.username, params.repo, params['*'])

    console.log(response)
    console.log(response.status)
    console.log(response.headers)
    const contentType = response.headers.get('content-type')
    console.log("content-type: ", contentType)
    // Choose an appropriate Content-Type, preserving the charset specified in
    // the response if there was one.
    let charset = REGEX_CHARSET.exec(contentType)
    console.log("charset: ", charset[1])
    console.log("new filepath: ", pathWithIndex(req))
    console.log("new filepath: ", route)
    console.log("new content-type: ", mime.contentType(pathWithIndex(req), charset && charset[1]))
    response.headers.set('Content-Type', mime.contentType(pathWithIndex(req), charset && charset[1]));

    return response
  }
})

fly.http.respondWith(async (req) => {
  return new Response("Hello! We only support whirled peas.", {
    status: 404
  })
})

async function fetchFile(username, repoName, filePath) {
  const url = `${baseRepoUrl}/${username}/${repoName}/${filePath}`
  return await fetch(url)
}

function pathWithIndex(path) {
  if (/\/$/.test(path)) {
    path += 'index.html';
  }

  return path;
}