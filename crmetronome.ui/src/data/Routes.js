import { Routes, Route } from 'react-router-dom';
import Sound from '../views/Sound';
import SoundContext2 from '../views/SoundContext2';
import SoundContext1 from '../views/SoundContext';


const RouterComponent = () => (
  <div>
    <Routes>
      <Route path='/sounds'
      element={ <Sound /> }
      />
      <Route path='/soundContext'
      element={ <SoundContext1 /> }
      />
      <Route path='/soundContext2'
      element={ <SoundContext2 /> }
      />
    </Routes>
  </div>
);

export default RouterComponent;
