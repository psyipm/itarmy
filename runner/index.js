const WebSocket = require("ws")
const os = require("os")
const { Docker } = require("docker-cli-js")

const client = new WebSocket("ws://localhost:7071/v1/runner")

client.addEventListener("open", (event) => {
  console.log("Connected")

  const server = event.target
  const payload = {
    command: "subscribe",
    options: {
      hostname: os.hostname()
    }
  }

  server.send(JSON.stringify(payload))
})

client.addEventListener("message", (data) => {
  const message = JSON.parse(data.data)
  const { command, options } = message

  switch (command) {
    case "start":
      startAttack(options)
      break;

    case "stop":
      stopAttack()
      break;

    default:
      console.log("Received unsupported command: %s", command)
      break;
  }
})

const startAttack = async (options = {}) => {
  console.log("startAttack", options)
}

const stopAttack = async () => {
  console.log("stopAttack")
}

client.addEventListener("close", async () => {
  await stopAttack()

  console.log("Closing")
})

const gracefulShutdown = async () => {
  console.log("Shutting down...")

  await stopAttack()
  process.exit()
}

process.on("SIGINT", gracefulShutdown)
process.on("SIGTERM", gracefulShutdown)
