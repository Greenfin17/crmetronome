import React from 'react';
import BassDrum2 from '../Assets/WavSamples/Bass-Drum-2.wav'

class SoundContext2 extends React.Component{
  constructor(props){
    super(props);
    const audioCtxt = new AudioContext();
    audioCtxt.suspend();
    const tmpGainNode = audioCtxt.createGain();
    tmpGainNode.connect(audioCtxt.destination);
    tmpGainNode.gain.value = 0.1;
    this.state = ({
      audioElement: null,
      audioContext: audioCtxt,
      gainNode: tmpGainNode,
      track: null});
  }
  componentDidMount(){
    const audioElementComponent = document.querySelector('audio');
    const trackObj = this.state.audioContext.createMediaElementSource(audioElementComponent);
    this.setState({
      audioElement: audioElementComponent,
      track: trackObj});
    // this.state.trackObj.connect(this.state.gainNode);
    // console.warn(this.state.gainNode);
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
      // console.warn('running oscillator');
      // console.warn(this.state.gainNode);
      const length=5;
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(440, this.state.audioContext.currentTime); // value in hertz
      oscillator.connect(this.state.gainNode);
      const time = this.state.audioContext.currentTime;
      // console.warn(time);
      oscillator.start(time + 1);
      oscillator.stop(time + 1 +  length);
    }
  }

  
  render(){
    const handleVolume = (e) => {
      const tmpGain = this.state.gainNode;
      // change volume directly and get around using setState
      tmpGain.gain.value = e.target.value / 100;

    };
    
    const handleStartStop = () => {
      if (this.state.audioContext.state === 'suspended') {
        this.state.audioContext.resume().then(() => this.runOscillator());
      } else if (this.state.audioContext.state === 'running') {
        this.state.audioContext.suspend();
        // console.warn('suspended');
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
      <input id="vol-control" type="range" min="0" max="100" step="1" onChange={handleVolume}
       defaultValue='30' />
      <div></div>
    </div>
    </>
    );
  }
}

export default SoundContext2;
