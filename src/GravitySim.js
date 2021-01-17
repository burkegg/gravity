import React, { useRef, useEffect } from 'react'

import {Balls} from './Balls'
import RightSide from "./RightSide";

class GravitySim extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animationInfo: [],
      running: false,
    }
    this.balls = new Balls(400)
  }
  componentDidMount() {
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }
  updateAnimationState = () => {
    // Update animation info here
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

  setInitBallInfoState = () => {
    let data = this.balls.getBalls()
    data.forEach((ball) => {
      this.setState({animationInfo: data})
    })
  }

  render() {
    return (
      <React.Fragment>
        <Canvas locations={this.state.animationInfo} running={this.state.running}/>
        <RightSide
          running={this.state.running}
          startHandler={this.stopStart}
          selectNumberBalls={this.selectNumberBalls}/>
      </React.Fragment>
    )
  }
}

class Canvas extends React.Component{
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    //     const canvas = canvasRef.current


  }

  componentDidMount() {
    this.canvasRef.current.width = document.getElementById('canvasContainer').clientWidth * 0.8
    this.canvasRef.current.height = document.getElementById('canvasContainer').clientHeight

  }

  componentDidUpdate() {
    const { locations, running } = this.props
    if (running) {
      locations.forEach(ball => {
        this.showBall(ball.pos.x, ball.pos.y)
      })
    }
  }
  showBall = (x, y) => {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f53d3d'
    ctx.beginPath()
    ctx.rect(Math.round(x), Math.round(y), 4,4)
    ctx.fill()
  }

  // backGround = ctx => {
  //   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  // }
  render() {
    return (
      <canvas ref={this.canvasRef} style={{border:1, borderStyle: "solid"}}/>
    )
  }
}


export default GravitySim
