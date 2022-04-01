
import React, { useEffect, useState, useMemo } from 'react';
const metronomeWorker = new Worker('metronomeWorker.js');

const Sound = () => {
  // const [song, setSong] = useState({});
  const [audioContext, setAudioContext] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      // const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const audioCtx = new AudioContext();
      setAudioContext(audioCtx);
      metronomeWorker.onmessage = (e) => {
        console.warn('e.data is ' + e.data);
        if (e.data === 'ticker') {
          console.warn('ticker');
        }
        else console.warn('message: ' + e.data);
      }
      metronomeWorker.postMessage({'interval' : 25});
    }
    return () => {
      mounted = false;
    }
  }, []);

  const runOscillator = () => {
      const oscillator = new OscillatorNode(audioContext);
      // const gainNode = audioContext.createGain();
      const length=2;
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // value in hertz
      // oscillator.connect(gainNode);
      oscillator.connect(audioContext.destination);
      console.warn(oscillator);
      const time = audioContext.currentTime;
      oscillator.start(time);
      console.warn('oscillator running at ' + time);
      oscillator.stop(time + length);

  }


    const handleStart = () => {
      console.warn(audioContext.state);
      if (audioContext.state==='suspended') {
        audioContext.resume().then(() => runOscillator());
      }
  };
    const handleStop = () => {
    audioContext.suspend();
  };
  
  return (
  <>
  <div>Sounds Context2</div>
  <div>
    <button onClick={handleStart}>Start</button>
    <button onClick={handleStop}>Stop</button>
    <div></div>
  </div>
  </>
  );
};

export default Sound;
