let Vector = require('victor');
/*
  Stores x, v, a, m data for all balls
 */

export class Balls {
  constructor(G) {
    this.ballsList = []
    this.G = G
    this.locHistory = [] // [ [{pos: pos, vel: vel}, {pos: pos, vel: vel}], ...]
    this.currTimestep = 0
    this.numTimesteps = 0
    this.sizeTimestep = .00002
  }

  addBall = (ballData) => {
    // ballData as:  {x: initX, y: initY, Vx: initVx, Vy: initVy, mass: m}
    // Take in data and make appropriate vectors.
    // Store as: {pos: vector, vel: vector, mass: m}
    // update locHistory with new array to push location data for this ball
    let pos = new Vector(ballData.x, ballData.y)
    let vel = new Vector(ballData.Vx, ballData.Vy)
    ballData = {pos: pos, vel: vel, mass: ballData.mass, color: ballData.color}
    this.ballsList.push(ballData)
    // this.locHistory.push([{pos: pos, vel: vel, mass: ballData.mass}])
  }

  getBalls = () => {
    return [...this.ballsList]
  }

  getColors = () => {
    return [...this.colors]
  }

  editBallLocation = (idx, locData) => {
    let data = this.ballsList[idx]
    if (data.pos) {
      data.pos.x = locData.x
      data.pos.y = locData.y
    }
  }

  editBallVelocity = (idx, ballData) => {
    if (ballData) {
      let data = this.ballsList[idx]
      // ballData = { x: ###, y: ### }
      // Get the new length of the vector and set that as V, and save Vx and Vy components

      let initPos = new Vector(data.pos.x, data.pos.y)
      let ballDataVector = new Vector(ballData.x, ballData.y)

      ballDataVector.subtract(initPos)
      data.vel.x = ballDataVector.x
      data.vel.y = ballDataVector.y
    }
  }

  getLatestData = () => {
    // given an index, return the positions of all the balls at that index
    let hist = this.locHistory
    let latestData = []
    hist.forEach((trajectory, idx) => {
      latestData.push(trajectory[trajectory.length - 1])
    })
    return latestData
  }

  resetBallLocations = data => {
    this.ballsList = [...data]
  }

  changeMass = (newMass, idx) => {
    console.log('balls', this.ballsList, idx)
    this.ballsList[idx].mass = newMass
  }



  clearBallsList = () => {
    this.ballsList = []
  }

  moveBallSteps = (ballNum) => {
    let startTime = performance.now();

    let iterateEachInTurn = []
    for (let step = 0; step < 10000; step++) {
      this.ballsList.forEach((ball, ballNum) => {
        let tempOneBallData = this.applyForce(ballNum)
        iterateEachInTurn[ballNum] = tempOneBallData
      })
    }
    // TODO:  put the current position into the balls in ballsList and everything uses that
    let endTime = performance.now();
    var timeDiff = endTime - startTime;
    console.log(timeDiff + " ms");
    return iterateEachInTurn
  }

  applyForce = (idx) => {
    let ballData = this.ballsList
    let currVel = new Vector(0, 0)
    let currPos = new Vector(0, 0)

    currVel.copy(ballData[idx].vel)
    currPos.copy(ballData[idx].pos)
    let color = ballData[idx].color
    let mass = ballData[idx].mass
    let f = this.calcNetForce(idx)
    let f2 = new Vector(0,0)
    f2.copy(f)
    let massVect = new Vector(mass, mass)
    let a = f2.divide(massVect)
    a.multiplyScalar(this.sizeTimestep)
    // create new vel and pos vectors and push them into history
    let newVel  = new Vector(currVel.x, currVel.y)
    let newPos = new Vector(ballData[idx].pos.x, ballData[idx].pos.y)
    /*
    a = vf - vo / t
    vf = at + vo
     */
    newVel.add(a)
    let deltaPos = new Vector(newVel.x, newVel.y)
    deltaPos.multiplyScalar(this.sizeTimestep)

    // newVel.multiplyScalar(.5)
    /*
    v = xf - xo / t
    xf = vt + xo
     */
    newPos.add(deltaPos)
    // never added the data to the history?
    let data = {pos: newPos, vel: newVel, mass: mass, color: color}
    this.ballsList[idx] = data
    return data
  }



  calcNetForce = (idx) => {
    // add a row to the history
    let info = this.ballsList

    let netForce = new Vector(0,0)

    info.forEach((ballData, dataIdx) => {
      if (idx !== dataIdx) {
        let f2Add = this.calcOneForce(info[idx], info[dataIdx])
        netForce.add(f2Add)
      }
    })
    return netForce
  }


  getInfo = () => {
    return { gravConstant: this.G, numBalls: this.ballsList.length, numTimesteps: this.numTimesteps, sizeTimestep: this.sizeTimestep, currTimestep: this.currTimestep }
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

  getDataToAnimate = (timestep) => {

    let hist = this.locHistory
    if (timestep < 0) {
      throw new Error("You went below zero")
    }
    let data = []
    let correctNumber = this.getInfo().numBalls
    for (let ballNum = 0; ballNum < correctNumber; ballNum++) {
      if (!hist[ballNum][timestep] || !hist[ballNum][timestep].pos) {
        timestep = hist[1].length - 1
      }
      data.push(hist[ballNum][timestep])
    }
    return data
  }

  manageBalls = () => {
    /*
      delta T, get new loc.
     */
    window.setInterval(()=>{
      let balls = this.ballsList
      balls.forEach((ball, idx) => {
        // calc force, then do the math for that ball to update its position and velocity
        for (let i = 0; i < 5000; i++) {
          this.moveBall(idx)
        }
      })
    }, 5000)
  }

  moveAllBallSteps = () => {
    let allBallData = []
    this.ballsList.forEach((ball, ballNum) => {
      let ballData = this.moveBallSteps(ballNum)
      allBallData.push(ballData)
    })
    return allBallData
  }


}
