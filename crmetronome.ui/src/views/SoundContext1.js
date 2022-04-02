import React from 'react';
import BassDrum2 from '../Assets/WavSamples/Bass-Drum-2.wav'

const SoundContext1 = () => {
  // const [song, setSong] = useState({});

/*  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setSong('../Assets/WavSamples/Bass-Drum-2.wav');
    }
    return () => {
      mounted = false;
    }
  }, []);
  */
    // create web audio api context
    const audioCtx = new window.AudioContext();

    // create Oscillator node
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.1;
  gainNode.connect(audioCtx.destination);
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // value in hertz
  oscillator.connect(gainNode);
  audioCtx.suspend();
  oscillator.start();
    const handleStartStop = () => {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      } else if (audioCtx.state === 'running') {
        audioCtx.suspend();
      }
    };
  
  return (
  <>
  <div>SoundContext1</div>
  <div>
    <audio controls>
      <source src={BassDrum2} />
    </audio>
    <button onClick={handleStartStop}>Start / Stop</button>
    <div></div>
  </div>
  </>
  );
};

export default SoundContext1;
