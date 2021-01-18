import React from 'react'

class GravCanvas extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      listeners: [],
      draggingPosition: null,
      isDragging: false,
    }
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.canvasRef.current.width = document.getElementById('canvasContainer').clientWidth * 0.8
    this.canvasRef.current.height = document.getElementById('canvasContainer').clientHeight
  }

  componentDidUpdate() {
    const { locations } = this.props
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d');

    if (!this.props.traces) {
      this.backGround()
    }
    locations.forEach((ball, idx) => {
      this.showBall(ball.pos.x, ball.pos.y, ball.mass)
    })
  }

  showBall = (x, y, m, idx) => {
    const { running } = this.props
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Create circle
    const circle = new Path2D();
    circle.arc(Math.round(x), Math.round(y), 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';

    if (!running) {
      console.log('not running')
      canvas.addEventListener('mousedown', (e) => {
        if (ctx.isPointInPath(circle, e.offsetX, e.offsetY)) {
          ctx.fillStyle = 'green';
          console.log('inside')
          let mouseInfo = this.getMousePos(canvas, e)
          console.log(mouseInfo)
        }
        else {
          ctx.fillStyle = 'red';
        }
      })
    }
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fill(circle);
  }

  getMousePos(canvas, evt) {
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
