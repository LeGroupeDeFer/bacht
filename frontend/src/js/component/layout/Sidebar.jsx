import React from 'react';
import { Turn as Hamburger } from 'hamburger-react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { connectLayout } from 'sharea/store/layout';


function Sidebar({ sidebar: { isOpen }, toggleSidebar }) {

  return (
    <div className={`sidebar ${isOpen ? 'sidebar-active' : ''}`}>
      <div className="sidebar-toggle">
        <Hamburger toggled={isOpen} toggle={toggleSidebar} />
      </div>
      <Nav defaultActiveKey="/" className="flex-column">
        <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
        <Nav.Link as={Link} to="/auth/login">Login</Nav.Link>
      </Nav>
    </div>
  );

}


export default connectLayout(Sidebar);
