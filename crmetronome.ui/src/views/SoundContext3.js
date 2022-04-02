
import React, { useEffect, useState } from 'react';
const metronomeWorker = new Worker('metronomeWorker.js');

const SoundContext3 = () => {
  // const [song, setSong] = useState({});
  const [audioContext, setAudioContext] = useState(null);
  const [gainNode, setGainNode] = useState(null);
  const [volume, setVolume] = useState(0.1); // stores the starting volume

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      // const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const audioCtx = new AudioContext();
      const tmpGainNode = audioCtx.createGain();
      setAudioContext(audioCtx);
      setGainNode(tmpGainNode);
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

  useEffect (() => {
    let mounted = true;
    if (mounted && audioContext && gainNode) {
      gainNode.connect(audioContext.destination);
      setVolume(0.1);
    }
  }, [audioContext, gainNode]);

  const runOscillator = () => {
    if(audioContext && gainNode) {
      const oscillator = new OscillatorNode(audioContext);
      const length=5;
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // value in hertz
      oscillator.connect(gainNode);
      const time = audioContext.currentTime;
      oscillator.start(time);
      oscillator.stop(time + length);
    }

  }


    const handleStart = () => {
      console.warn(audioContext.state);
      if (audioContext.state==='suspended') {
        gainNode.gain.value=volume;
        audioContext.resume().then(() => runOscillator());
      }
  };
    const handleStop = () => {
    audioContext.suspend();
  };

    const handleVolume = (e) => {
      setVolume(e.target.value/100);
      gainNode.gain.value=e.target.value/100;
      // gainNode.gain.value=volume;

  };
  
  return (
  <>
  <div>Sounds Context3</div>
  <div>
    <button onClick={handleStart}>Start</button>
    <button onClick={handleStop}>Stop</button>
    <input id="vol-control" type="range" min="0" max="100" step="1" onChange={handleVolume}></input>

    <div></div>
  </div>
  </>
  );
};

export default SoundContext3;
