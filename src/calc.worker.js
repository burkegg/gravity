// eslint-disable-next-line no-restricted-globals
self.addEventListener("message", handleMotion);
let Vector = require('victor');

// expecting: event.data = {type: '
function handleMotion(event) {
  // eslint-disable-next-line no-restricted-globals

  let sizeTimestep = 0.000015
  let G = 400
  // let initData = event.data
  let initData = []


  let dataToWrite = []
  let running = false

  let centerOfMass = new Vector(0, 0)
  let centerOnMass = false



  const init = () => {
    initData = event.data.animationInfo.map(ballData => {
      return {pos: new Vector(ballData.pos.x, ballData.pos.y), vel: new Vector(ballData.vel.x, ballData.vel.y), color: ballData.color, mass: ballData.mass, ballIdx: ballData.ballIdx}
    })
    centerOfMass = calcCenterOfMass(initData)
    running = true
    centerOnMass = event.data.centerOnMass
  }

  // returns com
  const calcCenterOfMass = (ballData) => {
    /*
    com = x1m1 + x2m2 ... / totalmass
     */

    let totalMass = 0
    let XweightedMasses = 0
    let YweightedMasses = 0
    for (let i = 0; i < ballData.length; i++) {
      totalMass += ballData[i].mass
      XweightedMasses += ballData[i].mass * ballData[i].pos.x
      YweightedMasses += ballData[i].mass * ballData[i].pos.y
    }
    let comX = XweightedMasses / totalMass
    let comY = YweightedMasses / totalMass
    let com = new Vector(comX, comY)
    // console.log("COM: ", com)
    return com
  }

  const calcOneForce = (ballData1, ballData2) => {

    // given which ball (e.g. ball1, ball2....) by index (0, 1, 2...)
    // so we can get their mass and maybe look up other properties later if we need.
    let s2 = ballData1.pos.distanceSq(ballData2.pos)

    let f = (G * ballData1.mass * ballData2.mass) / (s2 + 0.2 * s2)
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

  const applyForce = (ballData) => {
    let f = calcNetForce(ballData.ballIdx)
    let massVect = new Vector(ballData.mass, ballData.mass)
    f.divide(massVect)
    f.multiplyScalar(sizeTimestep)
    // create new vel and pos vectors and push them into history
    let newVel  = new Vector(ballData.vel.x, ballData.vel.y)
    let newPos = new Vector(ballData.pos.x, ballData.pos.y)
    /*
    a = vf - vo / t
    vf = at + vo
     */

    newVel.add(f)

    let deltaPos = new Vector(newVel.x, newVel.y)
    deltaPos.multiplyScalar(sizeTimestep)
    /*
    v = xf - xo / t
    xf = vt + xo
     */

    newPos.add(deltaPos)
    let data = {pos: newPos, vel: newVel, mass: ballData.mass, color: ballData.color, ballIdx: ballData.ballIdx}
    return data
  }

  const calcNetForce = (idx) => {
    // add a row to the history
    // let info = initData
    let netForce = new Vector(0,0)

    initData.forEach((ballData, dataIdx) => {
      if (idx !== dataIdx) {
        let f2Add = calcOneForce(initData[idx], initData[dataIdx])
        netForce.add(f2Add)
      }
    })
    return netForce
  }

  const startCalcs = () => {
    //   let startTime = performance.now();
    let comInit = centerOfMass

    for (let step = 0; step < 10000; step++) {
      let tempData = []
      initData.forEach((ball, ballNum) => {
        let tempOneBallData = applyForce(ball)
        tempData[ballNum] = tempOneBallData
      })
      initData = tempData
    }
    // let endTime = performance.now();
    // var timeDiff = endTime - startTime;
    // console.log(timeDiff + " ms");
    if (centerOnMass) {
      let comFin = calcCenterOfMass(initData)
      comFin.subtract(comInit)
      initData.forEach(ballData => {
        ballData.pos.x = ballData.pos.x - comFin.x
        ballData.pos.y = ballData.pos.y - comFin.y
      })
      centerOfMass = calcCenterOfMass(initData)
    }
    this.postMessage(initData)
  }


  if (event.data.type === 'running' && event.data.info === true) {
    init()
    this.setInterval(startCalcs, 20)
  }

  if (event.data.type === 'running' && event.data.info === false) {
    running = false
    initData = []
  }
}
