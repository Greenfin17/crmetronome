import React from 'react';
import BassDrum2 from '../Assets/WavSamples/Bass-Drum-2.wav'

class SoundContext extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      song: BassDrum2,
      audioElement: null,
      audioContext: null,
      track: null
    }
  }
  componentDidMount(){
    const AudioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioElementComponent = document.querySelector('audio');
    const trackObj = AudioContext.createMediaElementSource(audioElementComponent);
    this.setState({
      audioContext: AudioContext,
      audioElement: audioElementComponent,
      track: trackObj});
    trackObj.connect(AudioContext.destination);
  }

  componentWillUnmount(){
    this.setState({audioContext: null})
    this.setState({audioElement: null});
    this.setState({track: null});
  }
  
  render(){
    const audioContext = this.state.audioContext;
    const handleStartStop = () => {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      } else if (audioContext.state === 'running') {
        audioContext.suspend();
      }
    };
    return (
    <>
    <div>Sound Context</div>
    <div>
      <audio src={BassDrum2} />
      <button onClick={handleStartStop}>Start / Stop</button>
      <div></div>
    </div>
    </>
    );
  };
}

export default SoundContext;
