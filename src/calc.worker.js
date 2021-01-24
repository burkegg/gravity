// eslint-disable-next-line no-restricted-globals
self.addEventListener("message", handleMotion);
let Vector = require('victor');

// expecting: event.data = {type: '
function handleMotion(event) {
  // eslint-disable-next-line no-restricted-globals

  let sizeTimestep = 0.000015
  let G = 400
  // let initData = event.data
  let initDataNeedsVectors = []
  let initData = []


  let dataToWrite = []
  let running = false


  if (event.data.type === 'running' && event.data.info === true) {
    console.log("start!!!!")
    running = true
  }
  console.log("event", event.data, running)

  if (event.data.type === 'running' && event.data.info === false) {
    console.log("stop!!!!")
    running = false
    initDataNeedsVectors = []
    initData = []
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
    // RE-think
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
    while (running) {
      for (let step = 0; step < 8000; step++) {
        let tempData = []
        initData.forEach((ball, ballNum) => {
          let tempOneBallData = applyForce(ball)
          tempData[ballNum] = tempOneBallData
        })
        dataToWrite = tempData
        initData = tempData
      }
      let endTime = performance.now();
      // var timeDiff = endTime - startTime;
      // console.log(timeDiff + " ms");
      this.postMessage(dataToWrite)
    }
  }

  if (running) {
    initDataNeedsVectors = event.data.animationInfo
    initData = initDataNeedsVectors.map(ballData => {
      return {pos: new Vector(ballData.pos.x, ballData.pos.y), vel: new Vector(ballData.vel.x, ballData.vel.y), color: ballData.color, mass: ballData.mass, ballIdx: ballData.ballIdx}
    })
    startCalcs()
  }


}
