import React, {useEffect} from 'react';

import Sidebar from 'sharea/component/layout/Sidebar';
import TabNav from 'sharea/component/layout/TabNav';
import ProfileInfo from 'sharea/pages/Profile/ProfileInfo'
import ProfileName from 'sharea/pages/Profile/ProfileName';
import {Route, Switch} from 'react-router-dom';
import {connectUser} from 'sharea/store/user';
import {STATUS} from 'sharea/lib';
import Loader from 'sharea/component/Loader';

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

function Profile(
  {
    currentUser,
    users,
    status,
    fetchSpecificUser,
    fetchCurrentUser,
    id
  }) {

  useEffect(() => {
    if (id === 'self') {
      fetchCurrentUser()

    } else {
      fetchSpecificUser({id})
    }
  }, [id]);

  if (status === STATUS.LOADING || currentUser === null) {
    return <Loader.Centered width="100" />
  }

  const handlerUpdateProfile = (data) => {
    // todo : dispatch l'update du user

  }

  const u = id === 'self' ? currentUser : users[id];

  return (
    <main className="content">
      <div className="inner-content">
        <div className="heading">
          <ProfileName isSelf />
          <TabNav links={links} default="/profile" />
        </div>

        <Switch>
          {links.map(l => (
            <Route exact key={l.uri} path={l.uri}>
              <l.Component user={u} onUpdateProfile={() => console.log('ntm')} />
            </Route>
          ))}
        </Switch>

      </div>
    </main>
  );

}


export default connectUser(Profile);
