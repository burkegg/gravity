import MyWorker from './calc.worker'
let Vector = require('victor');

export class Balls {
  constructor(G, numThreads = 1) {
    this.ballsList = []
    this.G = G
    this.numThreads = numThreads
    this.currTimestep = 0
    this.numTimesteps = 0
    this.sizeTimestep = .00001
    this.initData = []
    this.nextData = []
    this.threadPool = []
    // this.makeThreads(numThreads)
    this.dataIdx = 0
    this.worker = new MyWorker()
  }

  makeThreads = (numThreads) => {
    for (let i = 0; i < numThreads; i++) {
      this.threadPool.push(new MyWorker())
    }
  }

  addBall = (ballData) => {
    let pos = new Vector(ballData.x, ballData.y)
    let vel = new Vector(ballData.Vx, ballData.Vy)
    let currBallIdx = this.initData.length
    ballData = {pos: pos, vel: vel, mass: ballData.mass, color: ballData.color, ballIdx: currBallIdx}
    this.initData.push(ballData)
    this.nextData.push(ballData)
  }

  getBalls = () => {
    return [...this.nextData]
  }

  editBallLocation = (idx, locData) => {
    let data = this.initData[idx]
    if (data.pos) {
      data.pos.x = locData.x
      data.pos.y = locData.y
    }
    this.nextData = [...this.initData]
  }

  editBallVelocity = (idx, ballData) => {
    if (ballData) {
      let data = this.initData[idx]
      // ballData = { x: ###, y: ### }
      // Get the new length of the vector and set that as V, and save Vx and Vy components

      let initPos = new Vector(data.pos.x, data.pos.y)
      let ballDataVector = new Vector(ballData.x, ballData.y)

      ballDataVector.subtract(initPos)
      data.vel.x = ballDataVector.x
      data.vel.y = ballDataVector.y
      this.nextData = [...this.initData]
    }
  }

  resetBallLocations = data => {
    this.initData = [...data]
    this.nextData = [...data]
  }

  changeMass = (newMass, idx) => {
    this.initData[idx].mass = newMass
    this.nextData[idx].mass = newMass
  }
  clearBallsList = () => {
    this.initData = []
    this.nextData = []
  }

  moveBallSteps = () => {
    // let startTime = performance.now();
    // this.worker.postMessage(1);
    // this.worker.addEventListener('message', event => {console.log('worker response:', event)});
    let iterateEachInTurn = []
    let dataToWrite = []
    for (let step = 0; step < 10000; step++) {
      let tempData = []
      this.initData.forEach((ball, ballNum) => {
        let tempOneBallData = this.applyForce(ball)
        tempData[ballNum] = tempOneBallData
      })
      this.initData = tempData
    }
    // this.nextData = this.initData
    // let endTime = performance.now();
    // var timeDiff = endTime - startTime;
    // console.log(timeDiff + " ms 2");
    return this.initData
  }

  applyForce = (ballData) => {
    // RE-think
    let f = this.calcNetForce(ballData.ballIdx)

    let massVect = new Vector(ballData.mass, ballData.mass)
    f.divide(massVect)

    f.multiplyScalar(this.sizeTimestep)
    // create new vel and pos vectors and push them into history
    let newVel  = new Vector(ballData.vel.x, ballData.vel.y)
    let newPos = new Vector(ballData.pos.x, ballData.pos.y)
    /*
    a = vf - vo / t
    vf = at + vo
     */

    newVel.add(f)

    let deltaPos = new Vector(newVel.x, newVel.y)
    deltaPos.multiplyScalar(this.sizeTimestep)
    /*
    v = xf - xo / t
    xf = vt + xo
     */

    newPos.add(deltaPos)
    let data = {pos: newPos, vel: newVel, mass: ballData.mass, color: ballData.color, ballIdx: ballData.ballIdx}
    return data
  }

  calcNetForce = (idx) => {
    // add a row to the history
    let info = this.initData

    let netForce = new Vector(0,0)

    info.forEach((ballData, dataIdx) => {
      if (idx !== dataIdx) {
        let f2Add = this.calcOneForce(info[idx], info[dataIdx])
        netForce.add(f2Add)
      }
    })
    return netForce
  }

  calcOneForce = (ballData1, ballData2) => {
    // given which ball (e.g. ball1, ball2....) by index (0, 1, 2...)
    // so we can get their mass and maybe look up other properties later if we need.
    let s2 = ballData1.pos.distanceSq(ballData2.pos)

    let f = (this.G * ballData1.mass * ballData2.mass) / (s2 + 0.2 * s2)
    if (s2 < 5) {
      f = 0
    }
    let b2Copy = {}
    b2Copy.pos = new Vector(0,0)
    b2Copy.pos.copy(ballData2.pos)
    let fVector = b2Copy.pos.subtract(ballData1.pos)
    fVector.normalize()
    fVector.multiplyScalar(f)
    return fVector
  }
}
