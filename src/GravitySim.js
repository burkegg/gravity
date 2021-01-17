import React, { useRef, useEffect, useState } from 'react'

import {Balls} from './Balls'
import RightSide from "./RightSide";

const GravitySim = props => {
  const canvasRef = useRef(null)
  const showBall = (ctx, x, y) => {
    ctx.fillStyle = '#f53d3d'
    ctx.beginPath()
    ctx.rect(Math.round(x), Math.round(y), 3,3)
    ctx.fill()
  }

  const backGround = ctx => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  let balls= useRef(new Balls(400)) // doesn't need to be in state I guess.  meh.
  const animateRef = useRef(false);

  const stopStart = (e) => {
    console.log('stopstart')
    animateRef.current = !animateRef.current
  }

  const selectNumberBalls = (e) => {
    let b = balls.current
    switch (e.target.value) {
      case '1':
        b.addBall({x: 500, y: 500, Vx: 0, Vy: 1, mass: 1000})
      case '2':
        b.addBall({x: 500, y: 500, Vx: 0, Vy: 1, mass: 1000})
        b.addBall({x: 870, y: 500, Vx: 0, Vy: -25, mass: 20})
      case '3':
        b.addBall({x: 500, y: 500, Vx: 0, Vy: 1, mass: 1000})
        b.addBall({x: 870, y: 500, Vx: 0, Vy: -25, mass: 20})
        b.addBall({x: 890, y: 500, Vx: 0, Vy: -10, mass: 1})
    }
  }


  useEffect(() => {
    let b = balls.current
    const canvas = canvasRef.current
    canvas.width = document.getElementById('canvasContainer').clientWidth * 0.8
    canvas.height = document.getElementById('canvasContainer').clientHeight
    const context = canvas.getContext('2d')
    let frameCount = 0
    let animationFrameId
    let timestep = 0

    const render = () => {
      console.log(
        'animate', animateRef.current
      )
        let ballData = b.moveBallSteps()
        if (animateRef.current) {
          animationFrameId = window.requestAnimationFrame(render)
        }
        ballData.forEach(ball => {
          showBall(context, ball.pos.x, ball.pos.y)
        })
      // backGround(context)
      frameCount++
    }

      render()
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [stopStart, animateRef.current, balls])


  return (
    <React.Fragment>
      <canvas ref={canvasRef} {...props} style={{border:1, borderStyle: "solid"}}/>
      <RightSide
        animationState={true}
        startHandler={stopStart}
        selectNumberBalls={selectNumberBalls}/>
    </React.Fragment>
  )
}

export default GravitySim
