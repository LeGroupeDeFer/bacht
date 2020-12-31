import React, {useEffect} from 'react';

import TabNav from 'sharea/component/layout/TabNav';
import Sharea from 'sharea/component/Sharea';
import {connectUser} from 'sharea/store/user';
import {capitalize} from 'sharea/lib';
import Switch from 'react-bootstrap/Switch';
import {Link, Route} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import {useSharea} from "sharea/store/sharea";


const links = [
  {
    uri: '/dashboard',
    title: 'Your Shareas',
  },
  {
    uri: '/dashboard/liked',
    title: 'Liked Shareas',
  },
];


// Home :: None => Component
function Home({ currentUser, status }) {

  const { all:shareas } = useSharea();

  if (status === 'loading')
    return <>Loading...</>;

  return (
    <main className="content">
      <div className="inner-content">
        <div className="heading">
          <h1>Hi, {capitalize(currentUser.username)}</h1>
          <TabNav links={links} default="/dashboard" />
        </div>
        <Switch>
          <Route exact path="/dashboard">
            <Sharea.List shareas={shareas} />
            <Link to="/sharea/new">
              <Button>Create new Sharea</Button>
            </Link>
          </Route>
          <Route exact path="/dashboard/liked">
            <Sharea.List shareas={shareas} />
          </Route>
        </Switch>
      </div>
    </main>
  );

}


export default connectUser(Home);
