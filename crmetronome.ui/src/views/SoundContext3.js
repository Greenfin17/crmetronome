import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
const metronomeWorker = new Worker('metronomeWorker.js');
import ProgressBar from 'react-bootstrap/ProgressBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faRefresh} from '@fortawesome/free-solid-svg-icons';
import getProgress from '../data/helpers/calculators';


const SoundContext3 = () => {
  // const [song, setSong] = useState({});
  const [audioContext, setAudioContext] = useState(null);
  const [gainNode, setGainNode] = useState(null);
  const [volume, setVolume] = useState(0.1); // stores the starting volume
  const [metronomeRunning, setMetronomeRunning] = useState(false); // tells us if the metronome is running
  const [sequenceRunning, setSequenceRunning] = useState(false); // tells us if a sequence is running
  const [tempo, setTempo] = useState(60);
  const [startButtonIcon, setStartButtonIcon] = useState(faPlay);
  const [sequence] = useState(
      [
        {
          pattern: [3,2],
          reps: 2, 
          tempo: 120
        },
        {
          pattern: [2,3,2],
          reps: 3,
          tempo: 160
        },
      ]);
  const requestAnimRef = useRef(); // stores requestAnimationFrame
  // const timeRef = useRef(); // stores time of last beat
  const blinkerRef = useRef(); // DOM element for blinker
  const progressRef = useRef();
  const [progressPercentage, setProgressPercentage] = useState(0);
  const progressTotal = useRef();
  const visualCtxRef  = useRef(); // visual Context
  const nextNote = useRef(); // tracks next metronome beat
  const firstInSequence = useRef(); // tracks beginning of sequence for progress bar
  const nextInSequence = useRef(); // tracks next sequence beat
  const iterator = useRef();

  const initializeIterator = () => {
    iterator.current = {
      i : 0,  // pattern iterator
      j : 0,  // iterator within pattern;
      k : 0,  // tracks strong beats;
      l : 0, // tracks number of beats in measure, needed to signal next pattern
      reps : 0 // repetitions of each pattern
    };
  }
   
  const resetSequencer = () => {
    setSequenceRunning(false);
    nextInSequence.current = -1; // signals black blinker
    // reset sequence to beginning.
    initializeIterator();
    progressTotal.current = 0; // reset progress bar
    setProgressPercentage(0);
    setStartButtonIcon(faPlay);
  };
    
  const setupContext = () => {
    const audioCtx = new AudioContext();
    const tmpGainNode = audioCtx.createGain();
    setAudioContext(audioCtx);
    setGainNode(tmpGainNode);
    metronomeWorker.postMessage({'interval' : 25});
  };
  
  const drawBlinker = (color) => {
    if(visualCtxRef.current != null && audioContext != null ){
      const  canvasElement = blinkerRef.current;
      visualCtxRef.current.clearRect(0,0, canvasElement.width, canvasElement.height );
      visualCtxRef.current.fillStyle = color; 
      var x = Math.floor(canvasElement.width / 6);
      visualCtxRef.current.fillRect(x * 1, x, x/2, x/2);
    }
  };

  // blinker using animationFrame
  // blinker turns red when beat is immminent.
  // blinker turns black when no metronome or sequence is running
  const drawCanvas = () => {
    let color = 'blue';
    // let progress = 0;
    if (nextNote.current === -1 && !sequenceRunning || nextInSequence.current === -1 && !metronomeRunning) {
      color = 'black';
    } else if ( Math.abs(audioContext.currentTime - nextNote.current) < .16 ) {
      color = 'red';
    } else if ( Math.abs(audioContext.currentTime - nextInSequence.current) < .16) {
      color = 'red';
    }

    drawBlinker(color);
    requestAnimationFrame(drawCanvas);
  };
  
  // metronome triggered by metronomeWorker  
  useEffect(() => {
    if(audioContext) {
      const lookahead = .1 
      initializeIterator();
      progressTotal.current = 0;
      nextNote.current = audioContext.currentTime + lookahead;
      nextInSequence.current = audioContext.currentTime + lookahead;
      firstInSequence.current = nextInSequence.current;
      metronomeWorker.onmessage = (e) => {
        if ( e.data === 'tick'){
          if (nextNote.current === -1) nextNote.current = audioContext.currentTime + lookahead;
          /*
          console.warn('nextNote: ' + nextNote + 'currentTime: ' + audioContext.currentTime);
          if ( nextNote < audioContext.currentTime)
          {
          console.warn('nextNote: ' + nextNote + 'currentTime: ' + audioContext.currentTime);
            nextNote = audioContext.currentTime + lookahead + .1;
          }
          */
          if ( nextNote.current < audioContext.currentTime + lookahead){
            runOscillator(nextNote.current, false);
            nextNote.current += 60 / tempo;
          }
        }
        // for loop without the for statement. messages keep loop going until sequence is completed.
        else if (e.data === 'seqTick' && iterator.current.i < sequence.length) {
          const beats = sequence[iterator.current.i].pattern.reduce((a,b) => a + b, 0);
          let strong;
          if ( nextInSequence.current < audioContext.currentTime + lookahead){
            if ( iterator.current.k === 0 ) strong = true; else strong = false;
            runOscillator(nextInSequence.current, strong );
            /*
            console.warn('i: ' + iterator.current.i);
            console.warn('j: ' + iterator.current.j);
            console.warn('k: ' + iterator.current.k);
            console.warn('l: ' + iterator.current.l);
            */
            nextInSequence.current = nextInSequence.current + 60/sequence[iterator.current.i].tempo;
            progressTotal.current += 60/sequence[iterator.current.i].tempo;
            iterator.current.k++; iterator.current.l++;
            setProgressPercentage(getProgress(sequence, iterator, progressTotal.current));
            if ( iterator.current.k === sequence[iterator.current.i].pattern[iterator.current.j]) {
              // Next group in pattern within measure signals strong beat with k == 0
              iterator.current.k = 0; iterator.current.j++
              }
            if ( iterator.current.l === beats) {
              iterator.current.reps++;
              iterator.current.j = 0; iterator.current.k = 0; iterator.current.l = 0;
              if (iterator.current.reps === sequence[iterator.current.i].reps) {
                iterator.current.i++; // next pattern
                iterator.current.reps = 0;
              } 
            }
          }
          // automatically stop worker messages when sequence is completed.
        } else { 
          metronomeWorker.postMessage('seqStop');
          resetSequencer();
        }
      }
    }
  }, [metronomeWorker, audioContext, tempo]);

  // launch audioContext
  useEffect(() => {
    nextNote.current = -1;
    let mounted = true;
    if (mounted) {
      // const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      setupContext();
    }
    return () => {
      mounted = false;
    }
  }, []);


  // setup Volume control
  useEffect (() => {
    let mounted = true;
    if (mounted && audioContext && gainNode) {
      gainNode.connect(audioContext.destination);
    }
  }, [audioContext, gainNode]);

  useEffect (() => {
    const  canvasElement = blinkerRef.current;
    visualCtxRef.current = canvasElement.getContext('2d');
    visualCtxRef.current.width = window.innerWidth;
    visualCtxRef.current.height = window.innerHeight;
    visualCtxRef.current.strokeStyle = '#ffffff';
    visualCtxRef.current.lineWidth = 2;
    // progressPercentage.current = 0;
  }, []);

  useLayoutEffect(() => {
    if (metronomeRunning) {
      if ( nextNote.current < audioContext.currentTime + .1)
        requestAnimRef.current = requestAnimationFrame(drawCanvas);
    }
    else if (sequenceRunning) {
      if( nextInSequence.current < audioContext.currentTime + .1) { 
        requestAnimRef.current = requestAnimationFrame(drawCanvas);
      }
      else cancelAnimationFrame(requestAnimRef.current);
    }
    return () => {
      cancelAnimationFrame(requestAnimRef.current);
    }
  }, [metronomeRunning, sequenceRunning]);
 


  const runOscillator = (time, strong) => {
    if(audioContext && gainNode && time > 0) {
      let frequency = 440;
      if (strong) {
        frequency =  880;
      }
      const oscillator = new OscillatorNode(audioContext);
      const length = 1/40;
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime); // value in hertz
      oscillator.connect(gainNode);
      oscillator.start(time);
      oscillator.stop(time + length);
    }
  };

  /*
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

  const schedule_measures = (unit, start) => {
    for ( let i = 0; i < unit.reps; i++) {
      start = schedule_measure(unit.pattern, unit.tempo, start);
    }
    return start;
  };

   
  const schedule_sequence = () => {
    const lookahead = .2
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
          tempo: 160
        },
      ];
    let start = audioContext.currentTime + lookahead;
    for ( let i = 0; i < sequence.length; i++) {
      start = schedule_measures(sequence[i], start);
    }   
  }
  */
 


  const handleStartSequence = () => {
    gainNode.gain.value = volume;
    if ( !sequenceRunning && !metronomeRunning ) {
      nextInSequence.current = audioContext.currentTime + .1;
      metronomeWorker.postMessage('seqStart');
      setSequenceRunning(true);
      setStartButtonIcon(faPause);
    } else if (sequenceRunning) {
      metronomeWorker.postMessage('seqStop');
      setSequenceRunning(false);
      nextInSequence.current = -1; // signals black blinker
      setStartButtonIcon(faPlay);
    }
  };

  const handleResetSequencer= () => {
    metronomeWorker.postMessage('seqStop');
    resetSequencer();
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
    if ( !sequenceRunning && !metronomeRunning && audioContext) {
      metronomeWorker.postMessage('start');
      nextNote.current = audioContext.currentTime + .05;
      setMetronomeRunning(true);
    } else if (!sequenceRunning  && metronomeRunning) {
      metronomeWorker.postMessage('stop');
      nextNote.current = -1;
      setMetronomeRunning(false);
    }
  }
  
  return (
  <>
  <div>Sounds Context3</div>
  <div>
    <button onClick={handleStartSequence} disabled={metronomeRunning}>
      <FontAwesomeIcon  icon={startButtonIcon}/></button>
    <button onClick={handleResetSequencer} disabled={metronomeRunning || nextInSequence.current === -1}><FontAwesomeIcon icon={faRefresh}/></button>
    <button onClick={handleStartMetronome} disabled={sequenceRunning}>Start / Stop Metronome</button>
    <label htmlFor = 'tempo'>Tempo: </label>
    <input type='number' id='tempo' name='tempo' min = '40' max = '208' 
      pattern="^\d*(\.\d{0,2})?$"  value={tempo}
      onChange={handleTempo}/>
    <input id='vol-control' type='range' min='0' max='100' step='1' onChange={handleVolume}
    value={volume * 100}/>
    <ProgressBar ref={progressRef} now={progressPercentage}
        variant='info'/>

    <canvas ref={blinkerRef} className='blinker'></canvas>
  </div>
  </>
  );
};

export default SoundContext3;
