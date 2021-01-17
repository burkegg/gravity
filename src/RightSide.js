import React, { useRef, useEffect } from 'react'
const RightSide = props => {
return (
  <div id='rightSide' style={{ display: 'flex', flexDirection: 'column'}}>
    <h2 id='rightSideHeader'>
      Right Side Header
    </h2>
    <div id='addRemoveButtons' style={{ display: 'flex', flexDirection: 'column' }}>
      <label htmlFor="numBallSelect">Select number of objects:</label>

      <select
        name="Number"
        id="numBallSelect"
        onChange={props.selectNumberBalls}
        disabled={props.simulationRunning}
      >
        <option value='select...'>Select...</option>
        <option value='1'>One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
        <option value="4">Four</option>
      </select>
      <button
        className='ballsButton'
        onClick={props.startHandler}
      >
        {`${props.animationState}`}
      </button>
      <button className='ballsButton'>
        Reset
      </button>
    </div>


  </div>

  )
}

export default RightSide
