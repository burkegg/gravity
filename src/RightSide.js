import React from 'react'
const RightSide = props => {
  const { animationInfo } = props
  let massEntry = () => {
    // if (!animationInfo || !animationInfo.length) {
    //   return null
    // }


    return (
      <div>heyheyhey</div>
    )
  }


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
          disabled={props.running}
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
          disabled={!props.animationInfo.length}
        >
          {props.running ? "Stop" : "Start"}
        </button>
        <button
          className='ballsButton'
          onClick={props.reset}
          disabled={props.running}>
          Reset
        </button>
        <div>
        <input type='checkbox' id='traceBox' name='traceBox' value='traces' onChange={props.toggleTraces} style={{width: 20, height: 20}}/>
          <label htmlFor='traceBox'>Show Traces</label>
        </div>
        <div id='mass-section'>
          {props.animationInfo.map((ballInfo, idx) => {
            return(
              <div key={`$mass${idx}key`}>
                <div style={{marginTop: 20}}>
                  <label htmlFor={`mass${idx}`} >Mass for object {idx + 1}</label>
                </div>
                <div style={{marginBottom: 20}}>
                  <input onChange={props.handleChangeMass} type="number" id={`massEntry${idx}`} name={`${idx}`}
                         min="1" max="1000" placeholder={`${ballInfo.mass}`} style={{width: 100, height: 30}}/>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>

  )
}

export default RightSide
