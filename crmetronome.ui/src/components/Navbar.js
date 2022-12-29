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
          <Link to='/soundContext3' className='menu-item'>
            Metronome
          </Link>
        </NavItem>
      </Nav>
    </Navbar>
  </div>
);

export default NavBar;
