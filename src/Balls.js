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
    this.sizeTimestep = .00005
  }

  addBall = (ballData) => {
    // ballData as:  {x: initX, y: initY, Vx: initVx, Vy: initVy, mass: m}
    // Take in data and make appropriate vectors.
    // Store as: {pos: vector, vel: vector, mass: m}
    // update locHistory with new array to push location data for this ball
    let pos = new Vector(ballData.x, ballData.y)
    let vel = new Vector(ballData.Vx, ballData.Vy)
    ballData = {pos: pos, vel: vel, mass: ballData.mass}
    this.ballsList.push(ballData)
    this.locHistory.push([{pos: pos, vel: vel, mass: ballData.mass}])
  }

  getBalls = () => {
    return this.ballsList
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

  getDataToAnimate = (timestep) => {
    console.log('timiestep', timestep)
    console.log('num avail:', this.locHistory[0].length)

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

  updateTimestep = () => {
    this.currTimestep += 1
  }

  manageBalls = () => {
    /*
      delta T, get new loc.
     */
    window.setInterval(()=>{
      let balls = this.ballsList
      balls.forEach((ball, idx) => {
        // calc force, then do the math for that ball to update its position and velocity
        for (let i = 0; i < 4000; i++) {
          this.moveBall(idx)
        }
      })
      this.updateTimestep()
    }, 50)
  }

  moveBall = (idx) => {
    let hist = this.getLatestData()
    let currVel = new Vector(0, 0)
    let currPos = new Vector(0, 0)
    currVel.copy(hist[idx].vel)
    currPos.copy(hist[idx].pos)
    let mass = hist[idx].mass
    let f = this.calcNetForce(idx)
    let f2 = new Vector(0,0)
    f2.copy(f)
    let massVect = new Vector(mass, mass)
    let a = f2.divide(massVect)
    a.multiplyScalar(this.sizeTimestep)
    // create new vel and pos vectors and push them into history
    let newVel  = new Vector(currVel.x, currVel.y)
    let newPos = new Vector(hist[idx].pos.x, hist[idx].pos.y)
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
    let data = {pos: newPos, vel: newVel, mass: mass}
    this.updateHistory(idx, data)
  }

  updateHistory = (idx, data) => {
    this.locHistory[idx].push(data)
  }

  calcNetForce = (idx) => {
    // add a row to the history
    let info = []
    this.locHistory.forEach(ballHistory => {
      info.push(ballHistory[ballHistory.length - 1])
    })
    // info is the current state of all balls

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
}
