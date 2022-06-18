const WebSocket = require("ws")
const { randomId } = require("./utils")
const { runner: runnerSettings } = require("./settings")

const clients = new Map()

const STATUS = {
  default: "default",
  subscribed: "subscribed",
  running: "running",
}

const COMMAND = {
  subscribe: "subscribe",
  start: "start",
  stop: "stop",
}

class Client {
  constructor (wsClient, options = {}) {
    this.client = wsClient
    this.id = randomId()
    this.status = STATUS.default
    this.options = options
  }

  subscribe (options = {}) {
    if (this.status != STATUS.default) {
      return this
    }

    console.log(options)

    this.options = options
    this.status = STATUS.subscribed

    clients.set(this.id, this)

    return this
  }

  async start () {
    if (this.status == STATUS.running) {
      return this
    }

    await this._send({
      command: COMMAND.start,
      options: runnerSettings
    })

    this.status = STATUS.running

    return this
  }

  async stop () {
    if (this.status != STATUS.running) {
      return this
    }

    await this._send({ command: COMMAND.stop })

    this.status = STATUS.subscribed

    return this
  }

  disconnect () {
    console.log(`Closing client ID ${this.id}`)

    this.client.close()
    clients.delete(this.id)
  }

  close () {
    if (this.client.readyState !== WebSocket.OPEN) {
      this.disconnect()
    }
  }

  asJson () {
    return { id: this.id, status: this.status, options: this.options }
  }

  async _send (payload = {}) {
    return await this.client.send(JSON.stringify(payload))
  }
}

Client.list = () => {
  return clients
}

Client.findById = (id) => {
  return clients.get(id)
}

Client.closeDisconnected = () => {
  clients.forEach((client) => client.close())
}

Client.listAsJson = () => {
  const data = []

  clients.forEach((client) => {
    const properties = (({ id, status, options }) => ({ id, status, options }))(client)

    data.push(properties)
  })

  return data
}

module.exports = {
  Client: Client,
  COMMAND: COMMAND,
  STATUS: STATUS
}
