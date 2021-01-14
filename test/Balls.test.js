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
    let positionData = B.getLocations()
    let b1Loc = positionData[0]
    expect(b1Loc.x).toEqual(100)
    expect(b1Loc.y).toEqual(300)
    // The number of balls tracked:
    console.log('positionData', positionData)
    expect(positionData.length).toEqual(2)
  })
