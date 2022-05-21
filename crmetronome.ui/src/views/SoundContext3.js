
import React, { useEffect, useState } from 'react';
const metronomeWorker = new Worker('metronomeWorker.js');

const SoundContext3 = () => {
  // const [song, setSong] = useState({});
  const [audioContext, setAudioContext] = useState(null);
  const [gainNode, setGainNode] = useState(null);
  const [volume, setVolume] = useState(0.1); // stores the starting volume
  const [metronomeRunning, setMetronomeRunning] = useState(false);
  const [sequenceRunning, setSequenceRunning] = useState(false);
  const [tempo, setTempo] = useState(60);
  const setupContext = () => {
    const audioCtx = new AudioContext();
    const tmpGainNode = audioCtx.createGain();
    setAudioContext(audioCtx);
    setGainNode(tmpGainNode);
    metronomeWorker.postMessage({'interval' : 25});
  };

  useEffect(() => {
    const lookahead = .1 
    let nextNote = 0;
    metronomeWorker.onmessage = (e) => {
      if ( e.data === 'tick'){
        // console.warn('nextNote: ' + nextNote + 'currentTime: ' + audioContext.currentTime);
        if ( nextNote < audioContext.currentTime)
        {
        // console.warn('nextNote: ' + nextNote + 'currentTime: ' + audioContext.currentTime);
           nextNote = audioContext.currentTime + lookahead + .1;
        }
        if ( nextNote < audioContext.currentTime + lookahead){
          runOscillator(nextNote, false);
          nextNote += 60 / tempo;
          // console.warn(tempo);
        }
      // console.warn('in useEffect: e.data is ' + e.data);
      }
    }
  }, [metronomeWorker, audioContext, tempo]);

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
      // console.warn(gainNode);
      oscillator.connect(gainNode);
      // console.warn('time is : ' + time + ' currrentTime is: ' + audioContext.currentTime);
      oscillator.start(time);
      oscillator.stop(time + length);
    }
  };

  const schedule_measure = (pattern, tempo, start) => {
    const beats = pattern.reduce((a,b) => a + b, 0);
    let strong = false;
    for ( let i = 0, j = 0, k = 0; i < beats; i++) {
      if ( j === 0 ) strong = true; else strong = false;
      runOscillator(start, strong );
      start = start + 60/tempo;
      j++;
      if ( j === pattern[k]) {
        j = 0;
        k++;
      }
    }
    return start;
  };

  const schedule_measures = (unit) => {
    const lookahead = .1
    let start = audioContext.currentTime + lookahead;
   ]''[repsunit['reps'].
     ]''[unit[''].unit.
     
  };

  const schedule_sequence = () => {
    const sequence =  
      [
        {
          pattern: [3,2],
          reps: 2, 
          tempo: 120
        },
        {
          pattern: [2,3,2],
          reps: 3,
          tempo: 112
        },
      ];
    for ( let i = 0; i < sequence.length; i++) {
      schedule_measures(sequence[i]);
    }   
  }
 


  const handleStartSequence = () => {
    gainNode.gain.value = volume;
    if ( !sequenceRunning && !metronomeRunning ) {
      schedule_measures(pattern, tempo, reps);
      setSequenceRunning(true);
    } else {
      if ( audioContext.state === 'suspended') {
        audioContext.resume();
      } else {
       audioContext.suspend();
      }
    }
  };

  const handleStop = () => {
    audioContext.close();
    setupContext();
    setSequenceRunning(false);
  };
  
  const handleVolume = (e) => {
    setVolume(e.target.value/100);
    gainNode.gain.value=e.target.value/100;
    // gainNode.gain.value=volume;
  };

  
  const handleTempo = (e) => { 
    setTempo(e.target.value);
  }


  const handleStartMetronome = () => {
    gainNode.gain.value=volume;
    if ( !sequenceRunning && !metronomeRunning) {
    metronomeWorker.postMessage('start');
    setMetronomeRunning(true);
    } else if (!sequenceRunning  && metronomeRunning) {
      metronomeWorker.postMessage('stop');
      setMetronomeRunning(false);
    }
  }
  
  return (
  <>
  <div>Sounds Context3</div>
  <div>
    <button onClick={handleStartSequence} disabled={metronomeRunning}>Start / Restart / Pause Sequence</button>
    <button onClick={handleStop} disabled={metronomeRunning}>Reload Sequence</button>
    <button onClick={handleStartMetronome} disabled={sequenceRunning}>Start / Stop Metronome</button>
    <label htmlFor = 'tempo'>Tempo: </label>
    <input type='number' id='tempo' name='tempo' min = '40' max = '208' 
      pattern="^\d*(\.\d{0,2})?$"  value={tempo}
      onChange={handleTempo}/>
    <input id='vol-control' type='range' min='0' max='100' step='1' onChange={handleVolume}
    value={volume * 100}/> 

    <div></div>
  </div>
  </>
  );
};

export default SoundContext3;
