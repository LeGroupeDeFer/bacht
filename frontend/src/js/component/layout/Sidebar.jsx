import React from 'react';
import { Turn as Hamburger } from 'hamburger-react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faHome, faDoorOpen, faUser, faMountain } from '@fortawesome/free-solid-svg-icons'

import AuthGuard from 'sharea/component/AuthGuard';
import { connectLayout } from 'sharea/store/layout';


const links = [
  {
    uri: '/dashboard',
    title: 'Dashboard',
    icon: faHome,
  },
  {
    uri: '/profile/self',
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
    <AuthGuard>
      <div className={`sidebar-container ${isOpen ? 'sidebar-container-active' : ''}`}>

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
      </div>
    </AuthGuard>
  );

}


export default connectLayout(Sidebar);
