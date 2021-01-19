import React from 'react'

class GravCanvas extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      listeners: [],
      isDragging: false,
      whichBall: null,
    }
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.canvasRef.current.width = document.getElementById('canvasContainer').clientWidth * 0.8
    this.canvasRef.current.height = document.getElementById('canvasContainer').clientHeight
    this.addEventListeners()
  }

  componentDidUpdate() {
    const { locations } = this.props
    const canvas = this.canvasRef.current
    if (!this.props.traces) {
      this.backGround()
    }
    locations.forEach((ball, idx) => {
      this.showBall(ball.pos.x, ball.pos.y, ball.mass, idx, ball.color)
    })

  }

  addEventListeners = (circle, idx) => {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { running, allowDragging } = this.props

    let handleMouseDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (ctx.isPointInPath(circle, e.offsetX, e.offsetY)) {
        this.setState({isDragging: true, whichBall: idx})
      }
    }
    let handleMouseUp = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setState({isDragging: false, whichball: null})
    }
    let handleMouseMove = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.state.isDragging && idx === this.state.whichBall) {
        let mouseInfo = this.getMousePos(e)
        this.props.handleDragDrop(mouseInfo, idx)
      }
    }
    if (!running && allowDragging) {
      canvas.addEventListener('mousedown', handleMouseDown)
      canvas.addEventListener('mouseup', handleMouseUp)
      canvas.addEventListener('mousemove', handleMouseMove)
    }
  }

  showBall = (x, y, m, idx, color) => {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Create circle
    const circle = new Path2D();
    circle.arc(Math.round(x), Math.round(y), 10, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill(circle);
  }

  getMousePos(evt) {
    const canvas = this.canvasRef.current;
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  backGround = () => {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }
  render() {
    return (
      <canvas ref={this.canvasRef} style={{border:1, borderStyle: "solid"}}/>
    )
  }
}

export default GravCanvas
