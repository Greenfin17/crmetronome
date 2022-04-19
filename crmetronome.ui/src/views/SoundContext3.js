
import React, { useEffect, useState } from 'react';
const metronomeWorker = new Worker('metronomeWorker.js');

const SoundContext3 = () => {
  // const [song, setSong] = useState({});
  const [audioContext, setAudioContext] = useState(null);
  const [gainNode, setGainNode] = useState(null);
  const [volume, setVolume] = useState(0.1); // stores the starting volume
  const [running, setRunning] = useState(false);
  const setupContext = () => {
    const audioCtx = new AudioContext();
    const tmpGainNode = audioCtx.createGain();
    setAudioContext(audioCtx);
    setGainNode(tmpGainNode);
    metronomeWorker.postMessage({'interval' : 25});
  };

  useEffect(() => {
    metronomeWorker.onmessage = (e) => {
      console.warn('in useEffect: e.data is ' + e.data);
    }
  }, [metronomeWorker]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      // const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      setupContext();
    }
    return () => {
      mounted = false;
    }
  }, []);


  useEffect (() => {
    let mounted = true;
    if (mounted && audioContext && gainNode) {
      gainNode.connect(audioContext.destination);
      setVolume(0.1);
    }
  }, [audioContext, gainNode]);

  const runOscillator = (time, strong) => {
    if(audioContext && gainNode) {
      let frequency = 440;
      if (strong) {
        frequency =  880;
      }
      const oscillator = new OscillatorNode(audioContext);
      const length = 1/40;
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime); // value in hertz
      oscillator.connect(gainNode);
      console.warn('time: ' + time + ' currentTime: ' + audioContext.currentTime);
      oscillator.start(time);
      oscillator.stop(time + length);
    }
  };

  const schedule_measure = (pattern, start) => {
    const beats = pattern.reduce((a,b) => a + b, 0);
    const tempo = 30;
    let strong = false;
    for ( let i = 0, j = 0, k = 0; i < beats; i++) {
      if ( j === 0 ) strong = true; else strong = false;
      runOscillator(start, strong );
      start = start + tempo/60;
      j++;
      if ( j === pattern[k]) {
        j = 0;
        k++;
      }
    }
    return start;
  };

  const schedule_measures = (pattern, reps, lookahead) => {
    let start = audioContext.currentTime + lookahead;
    for ( let i = 0; i < reps; i++) {
      start = schedule_measure(pattern, start);
    }
  };
 


  const handleStart = () => {
    console.warn(audioContext.state);
    gainNode.gain.value=volume;
    const pattern = [1,1];
    const lookahead = 0;
    if ( !running ) {
      metronomeWorker.postMessage('start');
      schedule_measures(pattern, 5, lookahead);
      setRunning(true);
    } else {
      if ( audioContext.state === 'suspended') {
        metronomeWorker.postMessage('start');
        audioContext.resume();
      } else {
       audioContext.suspend();
       metronomeWorker.postMessage('stop');
      }
    }
  };

  const handleStop = () => {
    metronomeWorker.postMessage('stop');
    audioContext.close();
    setupContext();
    setRunning(false);
  };

  const handleVolume = (e) => {
    setVolume(e.target.value/100);
    gainNode.gain.value=e.target.value/100;
    // gainNode.gain.value=volume;
  };

  const handlePause = () => {
    audioContext.suspend();
    metronomeWorker.postMessage('stop');
  };
  
  return (
  <>
  <div>Sounds Context3</div>
  <div>
    <button onClick={handleStart}>Start / Restart / Pause Sequence</button>
    <button onClick={handlePause}>Pause Sequence</button>
    <button onClick={handleStop}>Stop Sequence</button>
    <input id="vol-control" type="range" min="0" max="100" step="1" onChange={handleVolume}></input>

    <div></div>
  </div>
  </>
  );
};

export default SoundContext3;
