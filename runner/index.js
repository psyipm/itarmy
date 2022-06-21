const WebSocket = require("ws")

const Runner = require("./lib/runner")
const Scheduler = require("./lib/scheduler")
const settings = require("./lib/settings")

const client = new WebSocket(settings.manager.url)
const runner = new Runner()
const scheduler = new Scheduler()

client.addEventListener("open", async (event) => {
  console.log("Connected")

  const server = event.target
  const payload = {
    command: "subscribe",
    options: await Runner.info()
  }

  server.send(JSON.stringify(payload))
})

client.addEventListener("message", async (event) => {
  const server = event.target

  const message = JSON.parse(event.data)
  const { command, options } = message

  switch (command) {
    case "start":
      await runner.start(options)

      scheduler.schedule(async () => {
        server.send(JSON.stringify({
          command: "stats",
          options: await runner.getStatus()
        }))
      }, options.reportInterval)

      scheduler.schedule(async () => {
        await runner.stop()
        await runner.start(options)
      }, options.restartInterval)

      break;

    case "stop":
      await runner.stop()
      scheduler.clearAll()
      break;

    default:
      console.log("Received unsupported command: %s", command)
      break;
  }
})

client.addEventListener("close", async () => {
  console.log("Server disconnected")

  await gracefulShutdown()
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
