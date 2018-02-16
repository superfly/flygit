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

/*
 * Static file handling in Fly Apps relies is a little odd. There's no file system available
 * when this Javascript is executed, so we bundle statis assets using
 * [Webpack](/webpack.config.js). This is similar to the asset compilation steps in most
 * web frameworks.
 *
 * Webpack loads and processes scss files like
 * [index.scss](/src/stylesheets/index.scss) into string constants.
 * We add routes for each of `/screen.css`, and the necessary font files.
 */
const css = require('./stylesheets/rawgit.css').toString()
fly.http.route("/css/rawgit.css", function(req, params) {
  return new Response(css, {
    headers: {
      'content-type': 'text/css'
    }
  })
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