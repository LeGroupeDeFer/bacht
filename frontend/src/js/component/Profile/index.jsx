import { useUser } from 'sharea/store/user';
import ProfileName from 'sharea/component/Profile/ProfileName';
import TabNav from 'sharea/component/layout/TabNav';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import React, { useEffect } from 'react';
import { STATUS } from 'sharea/lib';
import { Card } from 'react-bootstrap';
import Error from 'sharea/component/Error';
import Loader from 'sharea/component/Loader';
import ProfileInfo from 'sharea/component/Profile/ProfileInfo';

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
