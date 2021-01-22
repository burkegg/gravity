// eslint-disable-next-line no-restricted-globals
self.addEventListener("message", startCounter);

function startCounter(event) {
  // eslint-disable-next-line no-restricted-globals
  let startTime = performance.now();
  let start = 0
  let initial = event.data;
  let data = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  let init = 0
  while (start < 1000000) {
    start += 1
    initial += 1
  }
  let endTime = performance.now();
  var timeDiff = endTime - startTime;
  console.log(timeDiff + " ms");
  this.postMessage(timeDiff)
}
