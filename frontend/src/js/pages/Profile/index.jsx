import React, {useEffect, useState} from 'react';

import { Route, Switch } from 'react-router-dom';

import TabNav from 'sharea/component/layout/TabNav';
import ProfileInfo from 'sharea/pages/Profile/ProfileInfo'
import ProfileName from 'sharea/pages/Profile/ProfileName';
import { useUser } from 'sharea/store/user';


const links = [
  {
    uri: '/profile/self',
    title: 'Info',
    Component: ProfileInfo
  },
  {
    uri: '/profile/shareas',
    title: 'Shareas',
    Component: (_) => <></>
  },
  {
    uri: '/profile/following',
    title: 'Following',
    Component: (_) => <></>
  },
  {
    uri: '/profile/like',
    title: 'Like',
    Component: (_) => <></>
  }
];


function Profile({ user }) {

  const { currentUser, update } = useUser();
  const isSelf = currentUser.id === user.id;

  return (
    <main className="content">
      <div className="inner-content">
        <div className="heading">
          <ProfileName isSelf={isSelf} {...user} />
          <TabNav links={links} default="/profile" />
        </div>

        <Switch>
          {links.map(({ uri, Component }) => (
            <Route
              exact
              key={uri}
              path={uri}
            >
              <Component
                {...user}
                editable={isSelf}
                onUpdate={update}
              />
            </Route>
          ))}
        </Switch>

      </div>
    </main>
  );

}

Profile.Info = ProfileInfo;
Profile.Name = ProfileName;


export default Profile;
