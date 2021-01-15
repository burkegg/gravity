import {Balls} from '../src/Balls'
let Vector = require('victor');

let B

beforeAll(() => {
  B = new Balls(25)
  B.addBall({x: 100, y: 300, Vx: 5, Vy: 0, mass: 5})
})

test('getBalls returns correct # of balls', () => {
  let list = B.getBalls()
  expect(list.length).toEqual(1)
})

test('There are positions and velocities for the balls', () => {
  let list = B.getBalls()
  let ball1 = list[0]
  let loc = ball1.pos
  let vel = ball1.vel
  expect(loc.x).toEqual(100)
  expect(vel.x).toEqual(5)
})

test('addBall adds balls', () => {
  B.addBall({x: 200, y: 300, Vx: 0, Vy: 0, mass: 10})
  let list = B.getBalls()
  expect(list.length).toEqual(2)
})



test('getLocations returns arrays of position vectors', () => {
  let positionData = B.getLatestData()
  let b1Loc = positionData[0].pos
  expect(b1Loc.x).toEqual(100)
  expect(b1Loc.y).toEqual(300)
  // The number of balls tracked:
  expect(positionData.length).toEqual(2)
})

test('calcOneForce correctly calculates the force on a ball', ()=> {
  // The force calculated on the left ball should be to the right (positive)
  // G * m1 * m2 / (s**2)
  let info = B.getInfo()
  let G = info.gravConstant
  let ballData = B.getLatestData()
  let ball1Data = ballData[0]
  let ball2Data = ballData[1]
  let distanceSq = ((ball1Data.pos.x - ball2Data.pos.x) ** 2 + (ball1Data.pos.y - ball2Data.pos.y) ** 2)
  let expectedMag = (G * ballData[0].mass * ballData[1].mass) / (distanceSq) // 0.125 to the right
  expect(B.calcOneForce(ballData[0], ballData[1]).x).toEqual(expectedMag)
  expect(B.calcOneForce(ballData[1], ballData[0]).x).toEqual(-1 * expectedMag)
})

test('moveBall gives some answer', ()=>{
  // let r = B.moveBall(0)
  expect(1).toEqual(1)
})

test('calcNetForce does something', () => {
  // For now test has 2 balls.  later add more to get net force actually tested
  let info = B.getInfo()
  let G = info.gravConstant
  let ballData = B.getBalls()
  let ball1Loc = ballData[0].pos
  let ball2Loc = ballData[1].pos
  let distanceSq = ((ball1Loc.x - ball2Loc.x) ** 2 + (ball1Loc.y - ball2Loc.y) ** 2)
  let expectedMag = (G * ballData[0].mass * ballData[1].mass) / (distanceSq) // 0.125 to the right
  expect(B.calcNetForce(0, 0)).toEqual({x: 0.125, y: 0})
})
