// WS API

const { init: initWsApi } = require("./lib/ws_runner_api")
initWsApi()

const { Client } = require("./lib/client")

setInterval(() => {
  Client.closeDisconnected()
}, 30 * 1000)

// HTTP API

const { listen: initHttpApi } = require("./lib/http_api")
initHttpApi()

const gracefulShutdown = async () => {
  console.log("Shutting down...")

  Client.list().forEach(client => client.disconnect())

  process.exit()
}

process.on("SIGINT", gracefulShutdown)
process.on("SIGTERM", gracefulShutdown)

process.on("exit", () => {
  console.log("Exiting")
})
