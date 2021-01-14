import React, { useRef, useEffect } from 'react'
import { Victor as Vector } from 'victor'

import {Balls} from './Balls'

const Canvas = props => {
  const canvasRef = useRef(null)
  const drawBulge = (ctx, frameCount) => {
    console.log('ctx?', ctx, frameCount)
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#f53d3d'
    ctx.beginPath()
    ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
    ctx.fill()
  }

  const showBall = (ctx, frameCount, x, y) => {
    ctx.fillStyle = '#f53d3d'
    ctx.beginPath()
    ctx.arc(Math.round(x), Math.round(y), 2, 0, 2*Math.PI)
    ctx.fill()
  }

  const backGround = ctx => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  useEffect(() => {
    let B = new Balls(500)
    //  {x: initX, y: initY, Vx: initVx, Vy: initVy, mass: m}
    B.addBall({x: 400, y: 300, Vx: 0, Vy: 1, mass: 150})
    B.addBall({x: 800, y: 300, Vx: 0, Vy: -1, mass: 150})
    // B.addBall({x: 1000, y: 300, Vx: 0, Vy: 0, mass: 50})

    let loc = B.getLocations(1)
    const canvas = canvasRef.current
    canvas.width = 1300
    canvas.height = 1000
    const context = canvas.getContext('2d')
    let frameCount = 0
    let animationFrameId
    //Our draw came here
    var lastRender = Date.now();
    B.manageBalls()
    
    const render = () => {
      let a = Date.now()
      var delta = a - lastRender;
      lastRender = a
      // backGround(context)
      frameCount++
      let locs = B.getLocations(1)
      // ballsList.forEach((ball, idx) => {
      //   if (!locs[idx]) return
      //   showBall(context, frameCount, B.getLocations()[idx][0].x, B.getLocations(1)[idx][0].y)
      // })
      let posHistory = B.getLocations()


      animationFrameId = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])


  console.log('canvasRef:', canvasRef)
  return <canvas ref={canvasRef} {...props} style={{border:1, borderStyle: "solid"}}/>
}

export default Canvas
