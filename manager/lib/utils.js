module.exports = {
  randomId: () => {
    return Math.random().toString(16).replace(/0./, '')
  }
}
