let Vector = require('victor');
/*
  Stores x, v, a, m data for all balls
 */

export class Balls {
  constructor() {
    this.ballsList = []
    this.G = 225
    this.locHistory = []
    this.timestep = .05
  }

  addBall = (ballData) => {
    // ballData as:  {x: initX, y: initY, Vx: initVx, Vy: initVy, mass: m}
    // Take in data and make appropriate vectors.
    // Store as: {pos: vector, vel: vector, mass: m}
    let pos = new Vector(ballData.x, ballData.y)
    let vel = new Vector(ballData.Vx, ballData.Vy)
    ballData = {pos: pos, vel: vel, mass: ballData.mass}
    this.ballsList.push(ballData)
    this.locHistory.push([])
  }

  getBalls = () => {
    return this.ballsList
    // return this.ballsList.map(ball => {
    //   return {x: ball.pos.x, y: ball.pos.y, Vx: ball.vel.x, Vy: ball.vel.y, mass: ball.mass}
    // })
  }

  getLocations = (speed) => {
    let locations = []
    this.locHistory.forEach((ballHistory, idx) => {
      // lochistory is going to be [[...], [...], [...]]
      locations.push(ballHistory)
    })
    // this.locHistory = this.locHistory[idx].slice(speed)
    console.log('locationsssssss', locations)
    return locations
  }

  manageBalls = () => {
    /*
      delta T, get new loc.
     */
    window.setInterval(()=>{
      let balls = this.ballsList
      console.log("data in class:", this.locHistory)
      balls.forEach((ball, idx) => {
        // calc force, then do the math for that ball to update its position and velocity
        let f = this.calcNetForce(ball, idx)
        let f2 = new Vector(0,0)
        f2.copy(f)
        let massVect = new Vector(ball.mass, ball.mass)
        let a = f2.divide(massVect)
        a.multiplyScalar(this.timestep)
        ball.vel.addX(a)
        ball.vel.addY(a)
        ball.pos.addX(ball.vel)
        ball.pos.addY(ball.vel)
        // this.locHistory[idx].push(ball.pos)
        balls[idx] = ball
        console.log('history:', this.locHistory)
      })
    }, 55)
  }

  calcNetForce = (ball, idx) => {
    // do 1/r2 for all other balls, unless super close.
    let netForce = new Vector(0,0)
    this.ballsList.forEach((otherBall, otherIdx) => {
      if (idx !== otherIdx) {
        // console.log('pre:', netForce)
        let f2Add = this.calcOneForce(otherBall, ball)
        netForce.add(f2Add)
        // console.log('calc:', f2Add)
        // console.log('post:', netForce)
      }
    })
    return netForce
  }

  calcOneForce = (ball1, ball2) => {
    // get the force on ball 1
    // let s = Math.sqrt(ball.x - otherBall.x) ** 2 + (ball.y - otherBall.y) ** 2)
    let s2 = ball1.pos.distanceSq(ball2.pos)
    if (s2 < 150) {
      let tooClose = new Vector(0, 0)
      return tooClose
    }// prevent infinity.  eventually make smooshes

    let f = (this.G * ball1.mass * ball2.mass) / s2
    // get normalized vector from ball1 to ball 2.  This will be force on ball 1.
    // a - b gets you from a to b

    let b1Copy = {}
    b1Copy.pos = new Vector(0,0)
    b1Copy.pos.copy(ball1.pos)
    let fVector = b1Copy.pos.subtract(ball2.pos)
    fVector.normalize()
    fVector.multiplyScalar(f)
    return fVector
  }
}
