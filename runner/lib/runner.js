const { Docker } = require("docker-cli-js")

const join = (items) => {
  return [...new Set(items)].join(" ")
}

const DOCKER_OPTIONS = [
  "-d",
  "--rm",
  "--pull always",
  "--log-driver none"
]

class Runner {
  constructor () {
    this.docker = new Docker()
  }

  async start (options = {}) {
    console.log("Starting...", options)

    let dockerOptions = join([...DOCKER_OPTIONS, ...(options.dockerOptions || [])])
    let commandArgs = join(options.commandArgs || [])

    let command = `run ${dockerOptions} ${options.image} ${commandArgs}`

    console.log(command)

    let result = await this.docker.command(command)

    console.log(result)

    return result
  }

  async stop () {
    console.log("Stopping...")
  }
}

module.exports = Runner
