import myWorker from "./src/calc.worker";


export class ThreadManager {
  constructor(numThreads = 1, initData) {
    this.initData = initData
    this.numThreads = numThreads
    this.threadPool = []
    this.addThreads(numThreads)
    this.jobQ = []
    this.numBalls = initData.length
    this.currIdx = 0
  }

  enqueueJob = (job) => {
    this.jobQ.push(job)
  }

  walkJobs = (idx) => {
    // Since we are going to keep copies of both old and new data,
    // we don't need to shift.  We can just walk through the array and
    // overwrite the old array after we've got a full new array.
    // updates this.currIdx and returns data
    // Do I need to worry about competing calls to this?  I don't have mutex.
    this.currIdx = idx + 1
    return this.initData[idx]
  }

  doCalc = (data) => {
    worker.postMessage({idx: i, loc: {x: 0, y: 0}, vel: {x: 1, y: 2}})
  }

  postNewData = () => {

  }

  addThreads = (numThreads) => {
    for (let i = 0; i < numThreads; i++) {
      const worker = new myWorker();
      this.threadPool.push(worker)
    }
  }

  shiftThread = () => {

  }

}


// worker.postMessage({idx: i, loc: {x: 0, y: 0}, vel: {x: 1, y: 2}});
// worker.addEventListener('message', event => this.setState({counter: event.data}));
