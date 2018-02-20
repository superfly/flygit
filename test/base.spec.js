require('../src')
global.window = global
const fetchMock = require('fetch-mock')
const {
  dispatchFetch
} = require('./helper')

import {
  expect
} from 'chai'

describe('FlyGit', () => {
  before(() => {
    fetchMock.mock("*", new Response(`# Hello world`))
  })
  after(() => {
    fetchMock.restore()
  })

  it('fires the event', async () => {
    let res = await dispatchFetch(new Request("http://localhost/"))
    let html = await res.text()
    expect(html).to.include('FlyGit')
    expect(res.status).to.equal(200)
  })
})