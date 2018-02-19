const db = require('mime-db')

db['application/n-triples'] = {
  charset: 'utf-8',
  compressible: true,
  extensions: ['nt']
}

db['application/rdf+xml'] = {
  compressible: true,
  extensions: ['rdf', 'owl']
}

db['application/vnd.geo+json'] = {
  charset: 'utf-8',
  compressible: true,
  extensions: ['geojson']
}

db['application/x-bat'] = {
  charset: 'utf-8',
  compressible: true,
  extensions: ['bat']
}

db['text/shex'] = {
  charset: 'utf-8',
  compressible: true,
  extensions: ['shex', 'shexc']
}

db['text/x-handlebars-template'] = {
  charset: 'utf-8',
  compressible: true,
  extensions: ['handlebars', 'hbs']
}

// Create a lookup map of extensions to types.
let extensions = Object.create(null)

Object.keys(db).forEach(type => {
  let exts = db[type].extensions

  if (exts) {
    exts.forEach(extension => {
      extensions[extension] = type
    })
  }
})


export function contentType(filePath, forceCharset) {
  let ext = filePath.match(/.\.([^.]+?)$/)
  let type = (ext && extensions[ext[1].toLowerCase()]) || 'application/octet-stream'
  let charset = forceCharset || db[type].charset

  if (charset) {
    type += ';charset=' + charset.toLowerCase()
  }

  return type
}