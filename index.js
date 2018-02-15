const baseRepoUrl = 'https://raw.githubusercontent.com'

fly.http.route("/:username/:repo/*path", function fileHandler(req, route) {
  const params = route.params
  return fetchFile(params.username, params.repo, params['*'])
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