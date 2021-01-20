import React from 'react'

class GravCanvas extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      listeners: [],
      isDragging: false,
      whichBall: null,
      dragOk: false,
      receivedLocs: false,

    }
    this.canvasRef = React.createRef();
    this.circles = []
    this.arrows = []
    this.ballLocs = []
  }

  componentDidMount() {
    this.canvasRef.current.width = document.getElementById('canvasContainer').clientWidth * 0.8
    this.canvasRef.current.height = document.getElementById('canvasContainer').clientHeight
    // this.addBallEventListeners()
  }

  componentDidUpdate() {
    const { locations } = this.props

    this.ballLocs = [...locations]
    const canvas = this.canvasRef.current
    if (!this.props.traces) {
      this.backGround()
    }
    locations.forEach((ball, idx) => {
      this.showBall(ball.pos.x, ball.pos.y, ball.mass, idx, ball.color)
    })
    this.drawArrows()
    if (locations.length && !this.state.receivedLocs) {
      this.setState({receivedLocs: true}, () => {
        this.addBallEventListeners()
      })
    }
  }

  drawArrows = () => {
    // Maybe if I can return the arrows themselves?  I think I need to be able to test against the context when
    // things have been rotated and translated - which isn't the ctx when we're doing the test.
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { running, locations } = this.props
    let width = 10
    if (!running) {
      locations.forEach((location, idx) => {
        let height = Math.sqrt(location.vel.x ** 2 + location.vel.y ** 2)
        let pos = location.pos
        let vel = location.vel
        ctx.save()
        ctx.translate(pos.x, pos.y)
        ctx.rotate(this.angleBetweenPoints(vel) * Math.PI / 180)
        ctx.translate(-pos.x, -pos.y)
        let p = new Path2D()
        p.moveTo(-width / 2 + pos.x, 0 + pos.y)
        p.lineTo(width / 2 + pos.x, 0 + pos.y)
        p.lineTo(width / 2 + pos.x,height + pos.y)
        p.lineTo(width / 2 +10 + pos.x, height + pos.y)
        p.lineTo(0 + pos.x, height + 20 + pos.y)
        p.lineTo(0 - width / 2 - 10 + pos.x, height + pos.y)
        p.lineTo(-width / 2 + pos.x, height + pos.y)
        p.closePath()
        ctx.stroke(p)
        // ctx.fill(p)
        this.arrows[idx] = p
        ctx.restore()
      })
    }
  }

  angleBetweenPoints = (V) => {
    // Canvas uses a different rotation about origin
    return Math.atan2(V.y, V.x) * 180 / Math.PI - 90;
  }

  addBallEventListeners = () => {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { running, allowDragging } = this.props
    let locations = this.ballLocs

    let arrowDetectSelect = (location, idx, e) => {
      // Takes in locations of the balls and changes the context to the appropriately translated / rotated one
      // before looking at collision detection
      let arrow = this.arrows[idx]
      let pos = location.pos
      let vel = location.vel
      // The arrows don't know their own canvas context (translate, rotate, etc)
      ctx.save()
      ctx.translate(pos.x, pos.y)
      ctx.rotate(this.angleBetweenPoints(vel) * Math.PI / 180)
      ctx.translate(-pos.x, -pos.y)
      if (ctx.isPointInPath(arrow, e.offsetX, e.offsetY)) {
        ctx.restore()
        return true
      }
      ctx.restore()
      return false
    }


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

      locations.forEach((location, idx) => {
        // Edit the context here and wrap the test in context switch - then return to normal after
        if (arrowDetectSelect(location, idx, e)) {
          this.setState({draggingVectorIdx: idx, isVectorDragging: true,})
        }
      })
    }

    let handleMouseUp = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setState({isDragging: false, whichBall: null, isVectorDragging: false, draggingVectorIdx: null})
    }

    let handleMouseMove = (e) => {
      if (!running && this.state.isDragging) {
        e.preventDefault();
        e.stopPropagation();
        let mouseInfo = this.getMousePos(e)
        this.props.handleDragDrop(mouseInfo, this.state.whichBall)
      } else if (!running && this.state.isVectorDragging) {
        let mouseInfo = this.getMousePos(e)
        this.props.handleVectorDrag(mouseInfo, this.state.draggingVectorIdx)
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
