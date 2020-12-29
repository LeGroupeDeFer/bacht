import React from 'react';
import { Nav, Container, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import Sidebar from 'sharea/component/layout/Sidebar';
import { connectAuth } from 'sharea/store/auth';
import { capitalize } from '../lib';


const links = [
  {
    uri: '/dashboard',
    title: 'Recent',
  },
  {
    uri: '/dashboard/own',
    title: 'Your Shareas',
  },
  {
    uri: '/dashboard/friends',
    title: 'Friends Shareas',
  },
];


function DashboardNav(_) {

  return (
    <Nav defaultActiveKey="/dashboard">
      {links.map(({ uri, title }) => (
        <Nav.Item key={uri}>
          <Nav.Link as={NavLink} exact to={uri}>{title}</Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );

}


// Home :: None => Component
function Home({ token }) {

  return (
    <div className="section dashboard">
      <Sidebar />
      <main className="content">
        <div className="inner-content">
          <div className="heading">
            <h1>Hi, {capitalize(token.sub)}</h1>
            <DashboardNav />
          </div>
        </div>
      </main>
    </div>
  );

}


export default connectAuth(Home);
