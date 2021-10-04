import Canvas from "./GravitySim";
function App() {



  return (
      <div id='canvasContainer' style={{ display: 'flex', flexDirection: 'row', width: '100%', marginTop: 10, marginLeft: 10, marginBottom: 10, minHeight: '100%'}}>
        <Canvas/>
      </div>
  );
}

export default App;
