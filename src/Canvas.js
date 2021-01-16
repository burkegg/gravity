import React, { useRef, useEffect } from 'react'
import { Victor as Vector } from 'victor'

import {Balls} from './Balls'

const Canvas = props => {
  const canvasRef = useRef(null)
  const showBall = (ctx, x, y) => {
    ctx.fillStyle = '#f53d3d'
    ctx.beginPath()
    ctx.rect(Math.round(x), Math.round(y), 15,15)
    ctx.fill()
  }

  const backGround = ctx => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  useEffect(() => {


    const canvas = canvasRef.current
    canvas.width = 1300
    canvas.height = 1000
    const context = canvas.getContext('2d')
    let frameCount = 0
    let animationFrameId
    let timestep = 0


    let B = new Balls(400)
    B.addBall({x: 500, y: 500, Vx: 0, Vy: 0, mass: 1000})
    B.addBall({x: 870, y: 500, Vx: 0, Vy: -25, mass: 20})
    B.addBall({x: 890, y: 500, Vx: 0, Vy: -10, mass: 1})
    // for (let i = 0; i < 5; i++) {
    //   let x = Math.random() * 1000
    //   let y = Math.random() * 1000
    //   let Vx = Math.random() * 3
    //   let Vy = Math.random() * 2
    //   let mass = Math.random() * 200
    //   B.addBall({x: x, y: y, Vx: Vx, Vy: Vy, mass: mass})
    // }
    // start the trajectory data

    const render = () => {
      backGround(context)
      frameCount++
      let ballData = B.moveBallSteps()
      ballData.forEach(ball => {
        showBall(context, ball.pos.x, ball.pos.y)
      })

      animationFrameId = window.requestAnimationFrame(render)
    }

    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])


  return <canvas ref={canvasRef} {...props} style={{border:1, borderStyle: "solid"}}/>
}

export default Canvas
