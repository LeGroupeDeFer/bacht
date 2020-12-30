import React from 'react';

import { NavLink } from 'react-router-dom'

import { useAuth } from 'sharea/store/app';
import { useSharea } from 'sharea/store/sharea';
import { capitalize } from 'sharea/lib';
import TabNav from 'sharea/component/layout/TabNav';


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

// Home :: None => Component
function Home(_) {

  const { token } = useAuth();
  const { all:shareas } = useSharea();

  return (
    <main className="content">
      <div className="inner-content">
        <div className="heading">
          <h1>Hi, {capitalize(token.sub)}</h1>
          <TabNav links={links} default="/dashboard" />
        </div>
      </div>
      <div className="tmp">
        {shareas.map(({ id, name }) => (
          <NavLink key={id} to={`/sharea/${id}`}>{name}</NavLink>
        ))}
      </div>
    </main>
  );

}


export default Home;
