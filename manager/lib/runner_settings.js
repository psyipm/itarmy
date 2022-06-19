const settings = require("./settings")

const CONTAINER_NAME = "mhddos"

const commpact = (array) => {
  return array.filter(i => i && i.length)
}

const runnerSettings = (clientOptions) => {
  return new RunnerSettings(clientOptions).settings()
}

class RunnerSettings {
  constructor (clientOptions) {
    this.clientOptions = clientOptions
  }

  settings () {
    const data = {
      ...settings.runner,
      dockerOptions: this.dockerOptions(),
      commandArgs: this.commandArgs()
    }

    console.log("Runner settings")
    console.log(this.clientOptions)
    console.log(data)

    return data
  }

  dockerOptions () {
    return commpact([
      this.cpuLimit(),
      "--pull always",
      "--log-driver none",
      `--name ${CONTAINER_NAME}`
    ])
  }

  commandArgs () {
    return commpact([
      "--itarmy",
      "--http-methods GET STRESS",
      `-t ${this.threads()}`,
      `--copies ${this.copies()}`,
      this.vpn()
    ])
  }

  isLiteMode () {
    return this.clientOptions.cpus <= 2
  }

  cpuLimit () {
    if (!this.isLiteMode())
      return ""

    return "--cpus=.7"
  }

  threads () {
    if (this.isLiteMode())
      return 1000

    return this.clientOptions.cpus * 1300
  }

  copies () {
    if (this.isLiteMode())
      return 1

    return this.clientOptions.cpus < 4 ? 1 : 2
  }

  vpn () {
    if (this.clientOptions.network.country == "Ukraine")
      return ""

    return "--vpn"
  }
}

module.exports = { RunnerSettings, runnerSettings }
