require('../src')
global.window = global
const fetchMock = require('fetch-mock')
const {
  dispatchFetch
} = require('./helper')
import {
  expect
} from 'chai'

const body = "# This is some very simple project README"

describe('FileHandler', () => {
  before(() => {
    fetchMock.mock("*", new Response(body, {
      headers: {
        'content-type': 'text-plain'
      }
    }))
  })
  after(() => {
    fetchMock.restore()
  })

  it("proxies a file and sets a correct Content-Type", async () => {

    let res = await dispatchFetch(new Request("http://localhost/blah/blah/master/README.md"))
    let html = await res.text()
    expect(html).to.equal(body)
    expect(res.status).to.equal(200)
    expect(res.headers.get('content-type')).to.equal('text/markdown')
  })
})