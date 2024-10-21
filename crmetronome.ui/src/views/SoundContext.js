import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
const metronomeWorker = new Worker('metronomeWorker.js');
// import ProgressBar from 'react-bootstrap/ProgressBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faRefresh} from '@fortawesome/free-solid-svg-icons';
import getProgress from '../helpers/calculators';
import SequenceSelector from '../components/SequenceSelector';

const SoundContext = () => {
  // const [song, setSong] = useState({});
  const [audioContext, setAudioContext] = useState(null);
  const [gainNode, setGainNode] = useState(null);
  const [volume, setVolume] = useState(0.1); // stores the starting volume
  const [metronomeRunning, setMetronomeRunning] = useState(false); // tells us if the metronome is running
  const [sequenceRunning, setSequenceRunning] = useState(false); // tells us if a sequence is running
  const [tempo, setTempo] = useState(60);
  const [weakBeats, setWeakBeats] = useState(false);
  const [startButtonIcon, setStartButtonIcon] = useState(faPlay);
  const [sequence, setSequence] = useState(
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
  const requestAnimProgressRef = useRef(); // stores requestAnimationFrame
                                           // for progress bar
  // const timeRef = useRef(); // stores time of last beat
  const blinkerRef = useRef(); // DOM element for blinker
  const progressRef = useRef();
  const timeStamp = useRef();
  // const progressID = useRef(); // ID for setTimeout for progress %
  const elapsedTime = useRef(); // track sequence progress
  const progressPercentage = useRef();
  const progressTotal = useRef();
  const visualCtxRef  = useRef(); // visual Context
  const visualCtxProgressRef  = useRef(); // visual Context for progress bar
  const nextNote = useRef(); // tracks next metronome beat
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
    // runProgress('stop');
    nextInSequence.current = -1; // signals black blinker
    // reset sequence to beginning.
    initializeIterator();
    // initialize other counters
    elapsedTime.current = 0;
    // timeStamp.current = 0;
    progressPercentage.current = 0;
    progressTotal.current = 0;
    requestAnimationFrame(drawBlankProgress);
    cancelAnimationFrame(requestAnimProgressRef.current);
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
    let lookahead = .16;
    if (nextNote.current === -1 && !sequenceRunning || nextInSequence.current === -1 && !metronomeRunning) {
      color = 'black';
    } else if ( Math.abs(audioContext.currentTime - nextNote.current) < lookahead ) {
      color = 'red';
    } else if ( Math.abs(audioContext.currentTime - nextInSequence.current) < lookahead) {
      color = 'red';
    }

    drawBlinker(color);
    if (sequenceRunning || metronomeRunning) {
      // save the animationFrame ID for cancellation.
      requestAnimRef.current = requestAnimationFrame(drawCanvas);
    }
    
  };

  const drawProgress = (time) => {
    const color = 'blue';

    if (visualCtxProgressRef.current != null && audioContext != null) {
      if (elapsedTime.current === undefined){
        elapsedTime.current = 0;
      }
      if (timeStamp.current === undefined){
        timeStamp.current = 0;
      }

      const canvasElement = progressRef.current;
      visualCtxProgressRef.current.clearRect(0,0, canvasElement.width, canvasElement.height );
      visualCtxProgressRef.current.fillStyle = color; 
      // var x = Math.floor(canvasElement.width / 6);
      if (timeStamp.current === 0){
        elapsedTime.current = 0;
      } else {
        elapsedTime.current += time - timeStamp.current;
      }
      timeStamp.current = time;
      progressPercentage.current = getProgress(sequence, elapsedTime.current / 1000)
      var x = (progressPercentage.current / 100) * canvasElement.width;
      var y = canvasElement.height;
      // console.warn('percentage.current is ' + progressPercentage.current);
      visualCtxProgressRef.current.fillRect(0, 0, x, y);
      requestAnimProgressRef.current = requestAnimationFrame(drawProgress);
    }
  }

  const drawBlankProgress = () => {
      const canvasElement = progressRef.current;
      visualCtxProgressRef.current.clearRect(0,0, canvasElement.width, canvasElement.height );
  };
  
  
  // metronome triggered by metronomeWorker  
  useEffect(() => {
    if(audioContext) {
      const lookahead = .1
      initializeIterator();
      progressTotal.current = 0;
      // nextNote.current = audioContext.currentTime + lookahead;
      // nextInSequence.current = audioContext.currentTime + lookahead;
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
            runOscillator(nextNote.current, false, true);
            nextNote.current += 60 / tempo;
          }
        }
        // for loop without the for statement. messages keep loop going until sequence is completed.
        else if (e.data === 'seqTick' && iterator.current.i < sequence.length) {
          const beats = sequence[iterator.current.i].pattern.reduce((a,b) => a + b, 0);
          let strong;
          // console.warn('next in sequence: ' + nextInSequence.current);
          // console.warn('current time: ' + audioContext.currentTime);
          if ( nextInSequence.current < audioContext.currentTime + lookahead){
            if ( iterator.current.k === 0 ) strong = true; else strong = false;
            // run beep on strong beats and weak beats if enabled
            if(strong || weakBeats) {
              runOscillator(nextInSequence.current, strong);
            }
            /*
            console.warn('i: ' + iterator.current.i);
            console.warn('j: ' + iterator.current.j);
            console.warn('k: ' + iterator.current.k);
            console.warn('l: ' + iterator.current.l);
            */
            nextInSequence.current = nextInSequence.current + 60/sequence[iterator.current.i].tempo;
            progressTotal.current += 60/sequence[iterator.current.i].tempo;
            iterator.current.k++; iterator.current.l++;
            // progressPercentage.current = getProgress(sequence, iterator, progressTotal.current);
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
          cancelAnimationFrame(requestAnimProgressRef.current);
          metronomeWorker.postMessage('seqStop');
          resetSequencer();
          // runProgress('stop');
        }
      }
    }
  }, [metronomeWorker, audioContext, tempo, weakBeats]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
    metronomeWorker.postMessage('seqStop');
    setAudioContext(null);
    setGainNode(null)
    setupContext();
    resetSequencer();
    }
  }, [sequence]);

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
    const progressCanvas = progressRef.current;
    visualCtxRef.current = canvasElement.getContext('2d');
    visualCtxRef.current.width = window.innerWidth;
    visualCtxRef.current.height = window.innerHeight;
    visualCtxRef.current.strokeStyle = '#ffffff';
    visualCtxRef.current.lineWidth = 2;

    visualCtxProgressRef.current = progressCanvas.getContext('2d');
    visualCtxProgressRef.current.width = window.innerWidth;
    visualCtxProgressRef.current.height = window.innerHeight;
    // progressPercentage.current = 0;
    requestAnimProgressRef.current = null;
    requestAnimRef.current = null;
  }, []);

  useLayoutEffect(() => {
    if (metronomeRunning && requestAnimRef.current === null) {
      // if ( nextNote.current < audioContext.currentTime + .1)
      requestAnimRef.current = requestAnimationFrame(drawCanvas);
    }
    else if (sequenceRunning) {
      if (requestAnimProgressRef.current === null) {
        requestAnimProgressRef.current = requestAnimationFrame(drawProgress);
      }
      if(requestAnimRef.current === null){
        requestAnimRef.current = requestAnimationFrame(drawCanvas);
      }
    }
    if (!metronomeRunning && !sequenceRunning && requestAnimRef.current != null){
      cancelAnimationFrame(requestAnimRef.current);
      requestAnimRef.current = null;
    }
    if (!sequenceRunning && requestAnimProgressRef.current != null) {
      cancelAnimationFrame(requestAnimProgressRef.current);
      requestAnimProgressRef.current = null;
    }
    
    return () => {
      // debugger;
      cancelAnimationFrame(requestAnimRef.current);
      cancelAnimationFrame(requestAnimProgressRef.current);
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
  const runProgress = (command) => {
    let totalTime = 0;
    let interval = 100;
    progressPercentage.current = 0;
    if (command === 'start' && audioContext != null) {
      if (elapsedTime.current === undefined){
        elapsedTime.current = 0;
      }
      for ( let i = 0; i < sequence.length; i++) {
          let beats = sequence[i].pattern.reduce((a,b) => a + b, 0);
          //console.warn(beats);
          //console.warn(sequence[i].tempo);
          totalTime += beats * (60/sequence[i].tempo) * sequence[i].reps;
      }
      progressID.current = setInterval(() => {
        elapsedTime.current += interval/1000;
        progressPercentage.current = (elapsedTime.current / totalTime) * 100;
        console.warn(elapsedTime.current);
      }, interval);
    } else if (command === 'pause'){
        clearInterval(progressID.current);
    } else if (command === 'stop'){
      clearInterval(progressID.current);
      elapsedTime.current = 0;
      progressPercentage.current = 0;
    }
  }
  */

  const handleStartSequence = () => {
    console.warn('handleStartSequence');
    if (gainNode && audioContext) {
      gainNode.gain.value = volume;
      if ( !sequenceRunning && !metronomeRunning ) {
        metronomeWorker.postMessage('seqStart');
        // a little extra time for first start
        nextInSequence.current = audioContext.currentTime + .05;
        setSequenceRunning(true);
        timeStamp.current = performance.now();
        // runProgress('start');
        setStartButtonIcon(faPause);
      } else if (sequenceRunning) {
        metronomeWorker.postMessage('seqStop');
        setSequenceRunning(false);
        // runProgress('pause');
        nextInSequence.current = -1; // signals black blinker
        setStartButtonIcon(faPlay);
      }
    }
  };

  const handleResetSequencer= () => {
    metronomeWorker.postMessage('seqStop');
    // runProgress('stop');
    // cancelAnimationFrame(requestAnimProgressRef.current);
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

  const handleWeakBeats  = () => {
    // toggle weak beats
    setWeakBeats(!weakBeats);
  }
  
  return (
  <>
  <div>Metronome</div>
  <div className = 'sound-div'>
    <SequenceSelector setSequence={setSequence}/>
    <div className='control-div'>
      <button onClick={handleStartSequence} disabled={metronomeRunning}>
        <FontAwesomeIcon  icon={startButtonIcon}/><label className='sequence-label'> Start / Pause Sequence</label></button>
      <button onClick={handleResetSequencer} disabled={metronomeRunning}><FontAwesomeIcon icon={faRefresh}/></button>
      <button onClick={handleStartMetronome} disabled={sequenceRunning}>Start / Stop Metronome</button>
      <div className='tempo-control'>
        <label htmlFor = 'tempo' className='tempo-label'>Tempo: </label>
        <input type='number' id='tempo' name='tempo' min = '40' max = '208' 
          pattern="^\d*(\.\d{0,2})?$"  value={tempo}
          onChange={handleTempo}/>
      </div>
      <input id='vol-control' type='range' min='0' max='100' step='1' onChange={handleVolume}
      value={volume * 100}/>
      <label htmlFor='weak-beats' className='weak-beats-label'>Weak Beats</label> 
      <input type='checkbox' id='weak-beats' value={weakBeats} onClick={handleWeakBeats}/>

      <canvas ref={progressRef} className='anim-progress'></canvas>

      <canvas ref={blinkerRef} className='blinker'></canvas>
    </div>
  </div>
  </>
  );
};

export default SoundContext;
