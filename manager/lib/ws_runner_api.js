const settings = require("./settings")
const { Client, COMMAND } = require("./client")

const WebSocket = require("ws")

const wsPort = settings.manager.wsPort
const wss = new WebSocket.Server({ port: wsPort, path: "/v1/runner" })

const handleMessage = (client, data) => {
  const { command, options } = JSON.parse(data)
  console.log(`Received command: ${command}`)

  switch (command) {
    case COMMAND.subscribe:
      client.subscribe(options)
      client.start()
      break;

    default:
      console.log("Received unsupported command: %s", data)
      break;
  }
}

const init = () => {
  wss.on("connection", (ws) => {
    console.log("Client connected")

    const client = new Client(ws)

    ws.on("message", (data) => handleMessage(client, data))

    ws.on("close", () => client.close())
  })

  console.log(`WS listening on ${wsPort}`)
}

module.exports = { init, wss }
