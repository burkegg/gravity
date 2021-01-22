// eslint-disable-line no-restricted-globals
// import myWorker from "./src/test.worker";

module.exports = function override(config, env) {
  config.module.rules.push({
    test: /\.worker\.js$/,
    use: { loader: 'worker-loader' }
  });
  // eslint-disable-line no-restricted-globals
  config.output.globalObject = 'this';
  return config;
};

//
// const worker = new myWorker();
// worker.postMessage(this.state.counter);
// worker.addEventListener('message', event => this.setState({counter: event.data}));
