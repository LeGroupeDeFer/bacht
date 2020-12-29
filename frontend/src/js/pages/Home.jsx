import React from 'react';

import Sidebar from 'sharea/component/layout/Sidebar';
import { connectAuth } from 'sharea/store/auth';
import { capitalize } from 'sharea/lib';
import TabNav from "sharea/component/layout/TabNav";


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
function Home({ token }) {

  return (
    <div className="section dashboard">
      <Sidebar />
      <main className="content">
        <div className="inner-content">
          <div className="heading">
            <h1>Hi, {capitalize(token.sub)}</h1>
            <TabNav links={links} default="/dashboard" />
          </div>
        </div>
      </main>
    </div>
  );

}


export default connectAuth(Home);
