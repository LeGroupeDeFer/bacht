import React from 'react';
import { Turn as Hamburger } from 'hamburger-react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faHome, faDoorOpen, faUser, faMountain } from '@fortawesome/free-solid-svg-icons'

import { connectLayout } from 'sharea/store/layout';


const links = [
  {
    uri: '/dashboard',
    title: 'Dashboard',
    icon: faHome,
  },
  {
    uri: '/profile',
    title: 'Profile',
    icon: faUser
  },
  {
    uri: '/discover',
    title: 'Discover',
    icon: faMountain
  },
  {
    uri: '/auth/logout',
    title: 'Logout',
    icon: faDoorOpen
  }
];


function Sidebar({ sidebar: { isOpen }, toggleSidebar }) {

  return (
    <div className={`sidebar ${isOpen ? 'sidebar-active' : ''}`}>

      <div className="sidebar-toggle">
        <Hamburger toggled={isOpen} toggle={toggleSidebar} />
      </div>

      <Nav defaultActiveKey="/" className="flex-column">
        {links.map(({ uri, title, icon }) => (
          <Nav.Link
            key={uri}
            as={NavLink}
            to={uri}
          >
            <span className="nav-link-text">{title}</span>
            <Icon
              icon={icon}
              className="nav-link-icon"
            />
          </Nav.Link>
        ))}
      </Nav>

    </div>
  );

}


export default connectLayout(Sidebar);
