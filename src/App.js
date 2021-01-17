import Canvas from "./GravitySim";
function App() {



  return (
    <div className="App" style={{display: 'flex', flexDirection: 'row', height: '98vh'}}>
      <div id='canvasContainer' style={{ display: 'flex', flexDirection: 'row', width: '100%', marginTop: 10, marginLeft: 10, marginBottom: 10, minHeight: '100%'}}>
        <Canvas/>
      </div>
    </div>
  );
}

export default App;
