import React from 'react'
const RightSide = props => {
  const { animationInfo } = props
  let buttonStyle = {height: 30, fontSize: 20, borderStyle: 'solid', borderColor: 'black', marginBottom: 15}
  return (
    <div id='rightSide' style={{ display: 'flex', flexDirection: 'column', marginLeft: 15}}>
      <h2 id='rightSideHeader'>
        Set up Sim
      </h2>
      <div id='addRemoveButtons' style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="numBallSelect" style={{marginBottom: 5}}>Select number of objects:</label>

        <select
          name="Number"
          id="numBallSelect"
          onChange={props.selectNumberBalls}
          disabled={props.running}
          style={{marginBottom: 15, height: 30, fontSize: 20}}
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
          style={buttonStyle}
        >
          {props.running ? "Stop" : "Start"}
        </button>
        <button
          className='ballsButton'
          onClick={props.reset}
          disabled={props.running}
          style={buttonStyle}>
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
                <div style={{marginTop: 20, fontSize: 16, marginBottom: 5}}>
                  <label htmlFor={`mass${idx}`} >Mass for object {idx + 1}</label>
                </div>
                <div style={{marginBottom: 20}}>
                  <input onChange={props.handleChangeMass} type="number" id={`massEntry${idx}`} name={`${idx}`}
                         min="1" max="1000" placeholder={`${ballInfo.mass}`} style={{width: 100, height: 30, fontSize: 17, textAlign: 'center'}}/>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 100, width: 200}}>
        Drag masses and vectors to edit starting conditions.
      </div>
    </div>

  )
}

export default RightSide
