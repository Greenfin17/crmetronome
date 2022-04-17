import React from 'react';
import BassDrum2 from '../Assets/WavSamples/Bass-Drum-2.wav'

class SoundContext2 extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      song: null,
      audioElement: null,
      audioContext: null,
      gainNode: null,
      track: null
    }
  }
  componentDidMount(){
    const audioCtxt = new AudioContext();
    audioCtxt.suspend();
    const audioElementComponent = document.querySelector('audio');
    const trackObj = audioCtxt.createMediaElementSource(audioElementComponent);
    const tmpGainNode = audioCtxt.createGain();
    tmpGainNode.gain.value = 0.3;
    this.setState({
      audioElement: audioElementComponent,
      audioContext: audioCtxt,
      gainNode: tmpGainNode,
      track: trackObj});
    trackObj.connect(audioCtxt.destination);
  }

  componentWillUnmount(){
    this.setState({audioElement: null});
    this.setState({audioContext: null})
    this.setState({gainNode: null});
    this.setState({track: null});
  }
  
  runOscillator() {
    if(this.state.audioContext && this.state.gainNode) {
      const oscillator = new OscillatorNode(this.state.audioContext);
      const length=5;
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(440, this.state.audioContext.currentTime); // value in hertz
      oscillator.connect(this.state.gainNode);
      const time = this.state.audioContext.currentTime;
      oscillator.start(time);
      oscillator.stop(time + length);
    }
  }

  
  render(){
    const handleVolume = (e) => {
      const gainState = this.state.gainNode;
      gainState.gain.value=e.target.value/100;
      this.setState({gainNode: gainState});
    };
    const handleStartStop = () => {
      if (this.state.audioContext.state === 'suspended') {
        console.warn('suspended');
        this.state.audioContext.resume().then(() => this.runOscillator());
      } else if (this.state.audioContext.state === 'running') {
        console.warn('running');
        this.state.audioContext.suspend();
      }
    };
    return (
    <>
    <div>Sound Context2</div>
    <div>
      <audio controls>
        <source src={BassDrum2} />
      </audio>
      <button onClick={handleStartStop}>Start / Stop</button>
      <input id="vol-control" type="range" min="0" max="100" step="1" onChange={handleVolume}></input>
      <div></div>
    </div>
    </>
    );
  }
}

export default SoundContext2;
