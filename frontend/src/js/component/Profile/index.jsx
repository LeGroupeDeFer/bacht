import { useUser } from 'sharea/store/user';
import ProfileName from 'sharea/component/Profile/ProfileName';
import TabNav from 'sharea/component/layout/TabNav';
import { Route, Switch } from 'react-router-dom';
import React from 'react';
import ProfileInfo from 'sharea/component/Profile/ProfileInfo';


function Profile({ user, viaSelf}) {

  const { currentUser, update } = useUser();
  const isSelf = currentUser.id === user.id;
  const links = [
    {
      uri: isSelf && viaSelf ? '/profile/self' : `/profile/${user.id}`,
      title: 'Info',
      Component: ProfileInfo
    },
    {
      uri: isSelf && viaSelf ? '/profile/self/shareas' : `/profile/${user.id}/shareas`,
      title: 'Shareas',
      Component: (_) => <></>
    },
    {
      uri: isSelf && viaSelf ? '/profile/self/following' : `/profile/${user.id}/following`,
      title: 'Following',
      Component: (_) => <></>
    },
    {
      uri: isSelf && viaSelf ? '/profile/self/like' : `/profile/${user.id}/like`,
      title: 'Like',
      Component: (_) => <></>
    }
  ];

  return (
    <main className="content">
      <div className="inner-content">
        <div className="heading">
          <ProfileName isSelf={isSelf} {...user} />
          <TabNav links={links} default={links[0].uri} />
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
