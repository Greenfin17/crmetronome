var timerId = null;
var interval = 100;

// code from https://github.com/cwilso/metronome

self.onmessage = (e) => {
  console.log('self.onmessage: e.data =' + e.data);
  if (e.data === 'start') {
    timerId=setInterval( () => { postMessage('ticker')}, interval);
    console.warn('timerId is: ' + timerId);
  }

  else if (e.data.interval) {
    interval = e.data.interval;
    console.warn('interval= ' + interval);
    if (timerId) {
      clearInterval(timerId);
      timerId = setInterval( () => { postMessage('tick')}, interval);
      console.warn('timerId is: ' + timerId);
    }
  }

  else if (e.data === 'stop') {
    clearInterval(timerId);
    timerId = null;
  }
}
