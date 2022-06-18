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
  exited: "exited",
  error: "error"
}

class Runner {
  constructor () {
    this.docker = new Docker()

    this.status = STATUS.default
    this.command = null
    this.containerId = null
    this.containerStats = {}
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

    try {
      const result = await this.docker.command(`stop ${this.containerId}`)

      if ((result.raw || "").includes(this.containerId)) {
        this.containerId = null
        this.status = STATUS.exited
      }
    } catch (error) {
      console.log(error)
    }

    return await this.getStatus()
  }

  async getStatus () {
    if (this.status == STATUS.exited) {
      console.log(this)

      return { status: this.status }
    }

    try {
      const stats = await this.docker.command(`stats ${this.containerId} --no-stream --format "{{ json . }}"`)

      this.containerStats = JSON.parse(stats.raw)
      this.status = STATUS.running
    } catch (error) {
      console.log(error)

      this.status = STATUS.error
      this.containerStats = {}
    }

    return { status: this.status, containerId: this.containerId, stats: this.containerStats }
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
