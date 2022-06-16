const WebSocket = require("ws")

const wsPort = 7071

const wss = new WebSocket.Server({ port: wsPort, path: "/v1/subscribe" })

const { Client, COMMAND } = require("./lib/client")

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

wss.on('connection', (ws) => {
  console.log(`Client connected`)

  const client = new Client(ws)

  ws.on("message", (data) => handleMessage(client, data))

  ws.on("close", () => client.close())
})

setInterval(() => {
  Client.closeDisconnected()
}, 30 * 1000)

console.log(`WS listening on ${wsPort}`)

// HTTP

const httpPort = 3003

const express = require('express')
const app = express()

app.get("/clients", (req, res) => {
  res.json(Client.asJson())
})

app.put("/clients/:id/start", (req, res) => {
  const client = Client.list().get(req.params.id)
  client.start()

  res.json(client.asJson())
})

app.put("/clients/:id/stop", (req, res) => {
  const client = Client.list().get(req.params.id)
  client.stop()

  res.json(client.asJson())
})

app.delete("/clients/:id", (req, res) => {
  const client = Client.list().get(req.params.id)
  client.disconnect()

  res.json(client.asJson())
})

app.listen(httpPort, () => {
  console.log(`API listening on port ${httpPort}`)
})
