import React, { useRef, useEffect } from 'react'
import { Victor as Vector } from 'victor'

import {Balls} from './Balls'

const Canvas = props => {
  const canvasRef = useRef(null)
  const showBall = (ctx, frameCount, x, y) => {
    ctx.fillStyle = '#f53d3d'
    ctx.beginPath()
    ctx.rect(Math.round(x), Math.round(y), 1,1)
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


    let B = new Balls(125)
    B.addBall({x: 400, y: 300, Vx: 1, Vy: 5, mass: 150})
    B.addBall({x: 600, y: 300, Vx: -1, Vy: -4, mass: 150})
    B.addBall({x: 500, y: 350, Vx: 0, Vy: -2, mass: 50})
    // start the trajectory data
    B.manageBalls()


    const render = () => {
      // backGround(context)
      frameCount++

      let data = B.getDataToAnimate(timestep)
      // console.log('history', B.locHistory)
      // console.log('data', data[0].vel)
      timestep += 1000
      if (data != null) {
        for (let i = 0; i < data.length; i++) {
          showBall(context, frameCount, data[i].pos.x, data[i].pos.y)
        }
      }

      // let posHistory = B.getLocations()
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
