module.exports = {
  manager: {
    httpPort: process.env.HTTP_PORT || 3003,
    wsPort: process.env.WS_PORT || 7071,
  },

  runner: {
    image: "ghcr.io/porthole-ascend-cinnamon/mhddos_proxy:latest",
    reportInterval: 60,
    restartInterval: 7200,
  }
}
