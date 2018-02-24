import getContentTypeFor from './mime'
import cacheResponse from './cache'

const REGEX_CHARSET = /;\s*charset\s*=\s*([^\s;]+)/i

fly.http.route("/", function fileHandler(req, route) {
  const pageTpl = require('./views/index.pug')
  const body = pageTpl({
    devDomain: app.config.devDomain,
    cdnDomain: app.config.cdnDomain
  })
  return new Response(body, {
    headers: {
      'content-type': 'text/html'
    }
  })
})

// Gist
fly.http.route("/:username/:gistid([0-9a-f]{1,100})/raw/*path", function gistHandler(req, route) {
  const params = route.params
  const url = `${app.config.baseGistUrl}/${params.username}/${params.gistid}/raw/${params['*']}`
  return tryCache(req, url)
})

// Repo file
fly.http.route("/:username/:repo/*path", function repoHandler(req, route) {
  const params = route.params
  const url = `${app.config.baseRepoUrl}/${params.username}/${params.repo}/${params['*']}`
  return tryCache(req, url)
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


/*
 * Catch all if none of the routes got matched
 */
fly.http.respondWith(async (req) => {
  return new Response("Hello! We only support whirled peas.", {
    status: 404
  })
})

async function tryCache(req, url) {
  const reqUrl = new URL(req.url)

  const shouldCache = `https://${reqUrl.hostname}` === app.config.cdnDomain

  if (shouldCache) {
    console.log(`On production domain (detected ${reqUrl.hostname}). Will cache`)
    return cacheResponse(reqUrl.pathname, async () => {
      return fetchFile(req, url)
    })
  }

  console.log(`Not on production domain (detected ${reqUrl.hostname}). Will NOT cache`)

  return fetchFile(req, url)
}

async function fetchFile(req, url) {
  const response = await fetch(url)

  const contentType = response.headers.get('content-type')
  // Choose an appropriate Content-Type, preserving the charset specified in
  // the response if there was one.
  let charset = REGEX_CHARSET.exec(contentType)
  response.headers.set('Content-Type', getContentTypeFor(pathWithIndex(req), charset && charset[1]));

  return handleErrors(response)
}

function handleErrors(response) {
  try {
    const status = response.status

    if (status < 400) {
      return response
    }

    const body = require(`. / views / errors / $ {
          status
        }.html `).toString()

    return new Response(body, {
      headers: {
        'content-type': 'text/html'
      }
    })
  } catch (e) {
    /*
     * There's no error pages for this HTTP status code. Let's just return
     * the original response.
     */
    console.log("HTML ERROR: ", e)
    return response
  }
}

function pathWithIndex(req) {
  const path = new URL(req.url).pathname
  if (/\/$/.test(path)) {
    path += 'index.html';
  }

  return path;
}

function contentTypeForRequest(req) {
  return getContentTypeFor(pathWithIndex(req))
}