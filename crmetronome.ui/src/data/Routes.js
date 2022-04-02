import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../views/Home.js';
import SoundContext1 from '../views/SoundContext1';
import SoundContext2 from '../views/SoundContext2';
import SoundContext3 from '../views/SoundContext3';


const RouterComponent = () => (
  <div>
    <Routes>
      <Route path='/'
        element={ <Home /> }
      />
      <Route path='/soundContext1'
        element={ <SoundContext1 /> }
      />
      <Route path='/soundContext2'
        element={ <SoundContext2 /> }
      />
      <Route path='/soundContext3'
        element={ <SoundContext3 /> }
      />
    </Routes>
  </div>
);

export default RouterComponent;
