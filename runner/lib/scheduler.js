class Scheduler {
  constructor () {
    this.intervals = new Set()
  }

  schedule (callbackFn, intervalSeconds) {
    const intervalHandle = setInterval(callbackFn, intervalSeconds * 1000)

    this.intervals.add(intervalHandle)

    return intervalHandle
  }

  clear (intervalHandle) {
    clearInterval(intervalHandle)
    this.intervals.delete(intervalHandle)
  }

  clearAll () {
    this.intervals.forEach(intervalHandle => this.clear(intervalHandle))
  }
}

module.exports = Scheduler
