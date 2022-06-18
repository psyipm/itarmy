const os = require("os")
const axios = require("axios")

const { Docker } = require("docker-cli-js")

const NETWORK_INFO_URL = "https://api.myip.com"

const join = (items) => {
  return [...new Set(items)].join(" ")
}

const DOCKER_OPTIONS = [
  "-d",
  "--rm",
  "--pull always",
  "--log-driver none"
]

const STATUS = {
  default: "default",
  running: "running",
  stopped: "stopped",
}

class Runner {
  constructor () {
    this.docker = new Docker()
    this.status = STATUS.default
    this.command = null
    this.containerId = null
  }

  async start (options = {}) {
    console.log("Starting...")

    const dockerOptions = join([...DOCKER_OPTIONS, ...(options.dockerOptions || [])])
    const commandArgs = join(options.commandArgs || [])

    this.command = `run ${dockerOptions} ${options.image} ${commandArgs}`
    const result = await this.docker.command(this.command)

    if (result.containerId) {
      this.containerId = result.containerId
      this.status = STATUS.running
    }

    return await this.getStatus()
  }

  async stop () {
    console.log("Stopping...")
  }

  async getStatus () {
    const statusInfo = { status: this.status, containerId: this.containerId }

    console.log(statusInfo)

    return statusInfo
  }
}

Runner.info = async () => {
  const network = await axios.get(NETWORK_INFO_URL)

  return {
    hostname: os.hostname(),
    network: network.data,
    cpus: os.cpus().length,
  }
}

module.exports = Runner
