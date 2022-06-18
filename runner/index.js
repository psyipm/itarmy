const WebSocket = require("ws")

const Runner = require("./lib/runner")
const settings = require("./lib/settings")

const client = new WebSocket(settings.manager.url)
const runner = new Runner()

client.addEventListener("open", async (event) => {
  console.log("Connected")

  const server = event.target
  const payload = {
    command: "subscribe",
    options: await Runner.info()
  }

  server.send(JSON.stringify(payload))
})

client.addEventListener("message", async (data) => {
  const message = JSON.parse(data.data)
  const { command, options } = message

  switch (command) {
    case "start":
      await runner.start(options)
      break;

    case "stop":
      await runner.stop()
      break;

    default:
      console.log("Received unsupported command: %s", command)
      break;
  }
})

client.addEventListener("close", async () => {
  await runner.stop()

  console.log("Closing")
})

const gracefulShutdown = async () => {
  console.log("Shutting down...")

  await runner.stop()
  process.exit()
}

process.on("SIGINT", gracefulShutdown)
process.on("SIGTERM", gracefulShutdown)

process.on("exit", () => {
  console.log("Exiting")
})
