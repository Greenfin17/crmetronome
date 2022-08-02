import React from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar,
  Nav,
  NavItem
} from 'react-bootstrap';

const NavBar = () => (
  <div>
    <Navbar>
      <Nav>
        <NavItem>
          <Link to='/'>
            Home
          </Link>
          <Link to='/soundContext1' className='menu-item'>
            SoundContext1
          </Link>
          <Link to='/soundContext2' className='menu-item'>
            Sound Context2
          </Link>
          <Link to='/soundContext3' className='menu-item'>
            Sound Context3
          </Link>
        </NavItem>
      </Nav>
    </Navbar>
  </div>
);

export default NavBar;
