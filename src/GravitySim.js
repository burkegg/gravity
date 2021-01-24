import React from 'react'

import {Balls} from './tBalls'
import RightSide from "./RightSide";
import GravCanvas from './GravCanvas'
import MyWorker from './calc.worker'

class GravitySim extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animationInfo: [],
      running: false,
      showTraces: false,
      allowDragging: true,
      isDragging: false,
      initPositions: [],
      draggingVectorIdx: false,
      isVectorDragging: false,
      awaitingData: false,
    }
    this.balls = new Balls(400)
    this.worker = new MyWorker()
  }
  componentDidMount() {
    this.rAF = requestAnimationFrame(this.updateAnimationState);
    this.worker.addEventListener('message', event => {
      this.setState({
        animationInfo: event.data,
        awaitingData: false,
      })
    })
    console.log('Basic worker version')
  }

  updateAnimationState = () => {
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rAF);
    this.worker.terminate()
  }

  selectNumberBalls = (e) => {
    let b = this.balls
    b.clearBallsList()
    switch (e.target.value) {
      case '1':
        b.addBall({x: 500, y: 500, Vx: 0, Vy: 1, mass: 1000, color: 'yellow'})
        break;
      case '2':
        b.addBall({x: 500, y: 500, Vx: 0, Vy: -20, mass: 1000, color: 'yellow'})
        b.addBall({x: 50, y: 500, Vx: 0, Vy: -25, mass: 20, color: 'aqua'})
        break;
      case '3':
        b.addBall({x: 500, y: 500, Vx: 0, Vy: 1, mass: 1000, color: 'yellow'})
        b.addBall({x: 870, y: 500, Vx: 0, Vy: -25, mass: 20, color: 'aqua'})
        b.addBall({x: 890, y: 500, Vx: 0, Vy: -10, mass: 1, color: 'springGreen'})
        break;
      case '4':
        b.addBall({x: 500, y: 500, Vx: 0, Vy: 1, mass: 1000, color: 'yellow'})
        b.addBall({x: 870, y: 500, Vx: 0, Vy: -25, mass: 20, color: 'aqua'})
        b.addBall({x: 890, y: 500, Vx: 0, Vy: -10, mass: 1, color: 'springGreen'})
        b.addBall({x: 250, y: 200, Vx: 5, Vy: 5, mass: 1, color: 'red'})
        break;
    }
    this.setInitBallInfoState()
  }
  stopStart = (e) => {
    this.setState({running: !this.state.running}, () => {
      console.log("PRE postMessage", this.state.running)
      this.worker.postMessage({type: 'running', info: this.state.running, animationInfo: this.state.animationInfo})
      if (!this.state.running) {
        this.worker.terminate()
        this.worker = new MyWorker()
        this.worker.addEventListener('message', event => {
          this.setState({
            animationInfo: event.data,
            awaitingData: false,
          })
        })
      }
    })

    console.log('stopstart')

    // this.worker.postMessage({type: 'data', info: this.state.animationInfo})
  }

  handleDragDrop = (e, idx) => {
    this.setState({allowDragging: false})
    // let ballData = this.state.animationInfo[idx]
    this.balls.updateBallData(this.state.animationInfo)
    this.balls.editBallLocation(idx, e)
    let data = this.balls.getBalls()
    this.setState({animationInfo: data, initPositions: [...data]})
    this.setInitBallInfoState()
  }

  handleVectorDrag = (e, idx) => {
    this.setState({ allowDragging: false })
    this.balls.editBallVelocity(idx, e)
    let data = this.balls.getBalls()
    this.setState({ animationInfo: data, initPositions: [...data]})
  }

  resetPositionsToInit = () => {
    this.balls.resetBallLocations(this.state.initPositions)
    this.setState({animationInfo: [...this.state.initPositions]})
  }

  setInitBallInfoState = () => {
    let data = this.balls.getBalls()
    this.setState({animationInfo: data, initPositions: [...data]})
  }
  toggleTraces = (e) => {
    this.setState({traces: !this.state.traces})
  }
  handleChangeMass = (e) => {
    let newMass = e.target.valueAsNumber
    let idx = parseInt(e.target.id[e.target.id.length - 1])
    if ( typeof newMass === 'number' && newMass > 0) {
      this.balls.changeMass(newMass, idx)
      let data = this.balls.getBalls()
      this.setState({ animationInfo: data, initPositions: [...data]})
    }
  }

  render() {
    return (
      <React.Fragment>
        <GravCanvas
          locations={this.state.animationInfo}
          running={this.state.running}
          traces={this.state.traces}
          allowDragging={this.state.allowDragging}
          handleDragDrop={this.handleDragDrop}
          handleVectorDrag={this.handleVectorDrag}
          handleVectorDown={this.handleVectorDown}/>
        <RightSide
          running={this.state.running}
          startHandler={this.stopStart}
          selectNumberBalls={this.selectNumberBalls}
          animationInfo={this.state.animationInfo}
          toggleTraces={this.toggleTraces}
          reset={this.resetPositionsToInit}
          handleChangeMass={this.handleChangeMass}/>
      </React.Fragment>
    )
  }
}

export default GravitySim
