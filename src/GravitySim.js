import React from 'react'

import {Balls} from './Balls'
import RightSide from "./RightSide";
import GravCanvas from './GravCanvas'

class GravitySim extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animationInfo: [],
      running: false,
      showTraces: false,
    }
    this.balls = new Balls(400)
  }
  componentDidMount() {
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }
  updateAnimationState = () => {
    if (this.state.running) {
      this.balls.ballsList.forEach((ball, idx) => {
        let ballData = this.balls.moveBallSteps()
        this.setState({animationInfo: ballData})
      })
    }
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.rAF);
  }

  selectNumberBalls = (e) => {
    let b = this.balls
    switch (e.target.value) {
      case '1':
        b.addBall({x: 500, y: 500, Vx: 0, Vy: 1, mass: 1000})
        break;
      case '2':
        b.addBall({x: 500, y: 500, Vx: 0, Vy: 1, mass: 1000})
        b.addBall({x: 870, y: 500, Vx: 0, Vy: -25, mass: 20})
        break;
      case '3':
        b.addBall({x: 500, y: 500, Vx: 0, Vy: 1, mass: 1000})
        b.addBall({x: 870, y: 500, Vx: 0, Vy: -25, mass: 20})
        b.addBall({x: 890, y: 500, Vx: 0, Vy: -10, mass: 1})
        break;
      case '4':
        b.addBall({x: 500, y: 500, Vx: 0, Vy: 1, mass: 1000})
        b.addBall({x: 870, y: 500, Vx: 0, Vy: -25, mass: 20})
        b.addBall({x: 890, y: 500, Vx: 0, Vy: -10, mass: 1})
        b.addBall({x: 250, y: 200, Vx: 5, Vy: 5, mass: 1})
        break;
    }
    this.setInitBallInfoState()
  }
  stopStart = (e) => {
    this.setState({running: !this.state.running})
  }

  handleDragDrop = (e) => {
    console.log('dragDrop:', e)
  }

  setInitBallInfoState = () => {
    let data = this.balls.getBalls()
    data.forEach((ball) => {
      this.setState({animationInfo: data})
    })
  }
  toggleTraces = (e) => {
    this.setState({traces: !this.state.traces})
  }

  render() {
    return (
      <React.Fragment>
        <GravCanvas locations={this.state.animationInfo} running={this.state.running} traces={this.state.traces}/>
        <RightSide
          running={this.state.running}
          startHandler={this.stopStart}
          selectNumberBalls={this.selectNumberBalls}
          ballsReady={this.state.animationInfo}
          toggleTraces={this.toggleTraces}/>
      </React.Fragment>
    )
  }
}

export default GravitySim
