const { createServer } = require('@vendia/serverless-express')
const { parse } = require('url')
const next = require('next')

const app = next({ 
  dev: false,
  conf: {
    distDir: '.next'
  }
})
const handle = app.getRequestHandler()

let server

async function createServerlessHandler() {
  if (!server) {
    await app.prepare()
    server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true)
      handle(req, res, parsedUrl)
    })
  }
  return server
}

module.exports.handler = async (event, context) => {
  const server = await createServerlessHandler()
  return server(event, context)
}