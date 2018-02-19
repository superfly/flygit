const mime = require('./mime')

const baseRepoUrl = 'https://raw.githubusercontent.com'
const REGEX_CHARSET = /;\s*charset\s*=\s*([^\s;]+)/i

const devDomain = 'dev.flygit.fly.io'
const cdnDomain = 'flygit.fly.io'

fly.http.route("/", function fileHandler(req, route) {
  const pageTpl = require('./views/index.pug')
  const body = pageTpl({
    devDomain: devDomain,
    cdnDomain: cdnDomain
  })
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

    const contentType = response.headers.get('content-type')
    // Choose an appropriate Content-Type, preserving the charset specified in
    // the response if there was one.
    let charset = REGEX_CHARSET.exec(contentType)
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
fly.http.route("/css/flygit.css", function(req, route) {
  const params = route.params
  try {
    const css = require("./stylesheets/flygit.css").toString()
    return new Response(css, {
      headers: {
        'content-type': 'text/css'
      }
    })
  } catch (e) {
    console.log("CSS ERROR: ", e)
    return new Response("not found", {
      status: 404
    })
  }
})

/*
 * There are a couple of different images in this project, so we can create a
 * parameterized route to handle all of them.
 */
fly.http.route("/img/:filename(^\\w+).:format", function staticImage(req, route) {
  try {
    /*
     * Webpack is smart. It recognizes that we might need every image in `/images`/,
     * so it helpfully bundles all of them up for runtime require calls.
     */
    const params = route.params
    const format = params.format
    const img = require(`./images/${params.filename}.${params.format}`)
    return new Response(img, {
      headers: {
        'content-type': contentTypeForRequest(req)
      }
    })
  } catch (e) {
    console.log("IMAGE ERROR: ", e)
    return new Response("not found", {
      status: 404
    })
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

function pathWithIndex(req) {
  const path = new URL(req.url).pathname
  if (/\/$/.test(path)) {
    path += 'index.html';
  }

  return path;
}

function contentTypeForRequest(req) {
  return mime.contentType(pathWithIndex(req))
}