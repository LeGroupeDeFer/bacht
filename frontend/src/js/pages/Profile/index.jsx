import React from 'react';

import Sidebar from 'sharea/component/layout/Sidebar';
import {connectAuth} from 'sharea/store/auth';
import TabNav from 'sharea/component/layout/TabNav';
import ProfileInfo from 'sharea/pages/Profile/ProfileInfo'
import ProfileName from 'sharea/pages/Profile/ProfileName';
import {Route, Switch} from 'react-router-dom';

const links = [
  {
    uri: '/profile',
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


const UserMedias = connectAuth(({token}) => {

  // TODO - User medias List
  const username = token.sub;

  return (
    <div className="medias">
      Hello, {username}!
      { /* Met les medias ici pour le moment Alex! */}
    </div>
  );

});


function Profile({user, token}) {
  const u = user === undefined ? {
    userName: 'Tazoeur',
    firstName: 'Guillaume',
    lastName: 'Latour',
    biopic: 'Born and raised in the Austrian Empire, Tesla studied engineering and physics in the 1870s without receiving a degree, gaining practical experience in the early 1880s working in telephony and at Continental Edison in the new electric power industry. In 1884 he emigrated to the United States, where he became a naturalized citizen. He worked for a short time at the Edison Machine Works in New York City before he struck out on his own. With the help of partners to finance and market his ideas, Tesla set up laboratories and companies in New York to develop a range of electrical and mechanical devices. His alternating current (AC) induction motor and related polyphase AC patents, licensed by Westinghouse Electric in 1888, earned him a considerable amount of money and became the cornerstone of the polyphase system which that company eventually marketed.'
  } : user;

  return (
    <div className="section profile">
      <Sidebar />
      <main className="content">
        <div className="inner-content">
          <div className="heading">
            <ProfileName user={u} />
            <TabNav links={links} default="/profile" />
          </div>

          <Switch>
            {links.map(l => (
              <Route exact key={l.uri} path={l.uri}>
                <l.Component user={u} />
              </Route>
            ))}
          </Switch>

        </div>
      </main>
    </div>
  );

}


export default connectAuth(Profile);
