// Balls class but with threading, hopefully!

export class Balls {
  constructor(G, numThreads) {
    this.ballsList = []
    this.G = G
    this.numThreads = numThreads
    this.currTimestep = 0
    this.numTimesteps = 0
    this.sizeTimestep = .00005
    this.initData = []
    this.nextData = []
    this.threadPool = []
    this.makeThreads(numThreads)
    this.dataIdx = 0
  }

  makeThreads = (numThreads) => {
    for (let i = 0; i < numThreads; i++) {
      this.threadPool.push(new MyWorker())
    }
  }


}
