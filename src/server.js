const Hapi = require('@hapi/hapi')
const routes = require('./route')
const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost'
  })
  server.route(routes)
  await server.start()
  console.log(`Server sedang berjalan pada ${server.info.uri}`)
}
init()
