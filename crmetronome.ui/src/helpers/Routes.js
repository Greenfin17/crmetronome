import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../views/Home.js';
import SoundContext from '../views/SoundContext';


const RouterComponent = () => (
  <div>
    <Routes>
      <Route path='/'
        element={ <Home /> }
      />
      <Route path='/soundContext'
        element={ <SoundContext /> }
      />
    </Routes>
  </div>
);

export default RouterComponent;
