import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../views/Home.js';
import SoundContext from '../views/SoundContext';
import Composers from '../views/Composers.js';


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
    </Routes>
  </div>
);

export default RouterComponent;
