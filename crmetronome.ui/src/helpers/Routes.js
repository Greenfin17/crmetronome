import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../views/Home.js';
import SoundContext from '../views/SoundContext';
import Composers from '../views/Composers.js';
import Compositions from '../views/Compositions.js';


const RouterComponent = () => (
  <div>
    <Routes>
      <Route path='/'
        element={ <Home /> }
      />
      <Route path='/soundContext'
        element={ <SoundContext /> }
      />
      <Route path='/composers'
        element={ <Composers /> }
      />
      <Route path='/compositions'
        element={ <Compositions />}
      />
    </Routes>
  </div>
);

export default RouterComponent;
