import React from 'react'

class GravCanvas extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      listeners: [],
      isDragging: false,
      whichBall: null,
      dragOk: false,
    }
    this.canvasRef = React.createRef();
    this.circles = []
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

  addEventListeners = () => {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { running, allowDragging } = this.props

    let handleMouseDown = (e) => {
      if (running) {
        return
      }
      e.preventDefault();
      e.stopPropagation();
      // See if we're inside any circles:
      this.circles.forEach((circle, idx) => {
        if (ctx.isPointInPath(circle, e.offsetX, e.offsetY)) {
          this.setState({isDragging: true, whichBall: idx})
        }
      })
    }

    let handleMouseUp = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setState({isDragging: false, whichBall: null})
    }


    let handleMouseMove = (e) => {
      if (!running && this.state.isDragging) {
        e.preventDefault();
        e.stopPropagation();
        let mouseInfo = this.getMousePos(e)
        this.props.handleDragDrop(mouseInfo, this.state.whichBall)
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
    this.circles[idx] = circle
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
