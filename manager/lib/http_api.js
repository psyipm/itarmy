const express = require("express")
const app = express()

const settings = require("./settings")
const { Client } = require("./client")

app.get("/clients", (req, res) => {
  res.json(Client.listAsJson())
})

app.put("/clients/:id/start", async (req, res) => {
  const client = Client.findById(req.params.id)
  if (!client)
    return res.sendStatus(404)

  await client.start()

  res.json(client.asJson())
})

app.put("/clients/:id/stop", async (req, res) => {
  const client = Client.findById(req.params.id)
  if (!client)
    return res.sendStatus(404)

  await client.stop()

  res.json(client.asJson())
})

app.delete("/clients/:id", async (req, res) => {
  const client = Client.findById(req.params.id)
  if (!client)
    return res.sendStatus(404)

  await client.disconnect()

  res.json(client.asJson())
})

const listen = () => {
  const httpPort = settings.manager.httpPort

  app.listen(httpPort, () => {
    console.log(`API listening on port ${httpPort}`)
  })
}

module.exports = { listen, app }
