var timerId = null; //metronome timer
var seqTimerId = null; //sequence generator timer
var interval = 100;

// code from https://github.com/cwilso/metronome

self.onmessage = (e) => {
  console.log('in metronomerWorker.js, e.data = ' + e.data);
  if (e.data === 'start') {
    timerId=setInterval( () => { postMessage('tick')}, interval);
    console.warn('timerId is: ' + timerId);
  } 
  else if (e.data === 'seqStart') {
    console.warn('sequence start');
    seqTimerId=setInterval( () => { postMessage('seqTick')}, interval);
    console.warn('seqTimerId is: ' + seqTimerId);
  }
  // update interval
  else if (e.data.interval) {
    interval = e.data.interval;
    // console.warn('interval= ' + e.data.interval);
    if (timerId) {
      clearInterval(timerId);
      timerId = setInterval( () => { postMessage('tick')}, interval);
      // console.warn('timerId is: ' + timerId);
    }
    else if (seqTimerId) {
      clearInterval(seqTimerId);
      seqTimerId = setInterval( () => { postMessage('seqTick')}, interval);
    }
  }
  else if (e.data === 'stop' && timerId) {
    clearInterval(timerId);
    console.warn('timerId is: ' + timerId);
    timerId = null;
  }
  else if (e.data === 'seqStop' && seqTimerId) {
    clearInterval(seqTimerId);
    seqTimerId = null
  }

}
