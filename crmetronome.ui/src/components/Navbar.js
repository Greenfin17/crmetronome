import React from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar,
  Nav,
  NavItem
} from 'reactstrap';

const NavBar = () => (
  <div>
    <Navbar>
      <Nav>
        <NavItem>
          <Link to='/'>
            Home
          </Link>
          <Link to='/sounds' className='menu-item'>
            Sounds
          </Link>
          <Link to='/soundContext' className='menu-item'>
            Sound Context1
          </Link>
          <Link to='/soundContext2' className='menu-item'>
            Sound Context2
          </Link>
        </NavItem>
      </Nav>
    </Navbar>
  </div>
);

export default NavBar;
