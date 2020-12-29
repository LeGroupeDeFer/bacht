import React from 'react';

import Sidebar from 'sharea/component/layout/Sidebar';
import {connectAuth} from 'sharea/store/auth';
import TabNav from "sharea/component/layout/TabNav";

const links = [
  {
    uri: '/profile',
    title: 'Info',
  },
  {
    uri: '/profile/shareas',
    title: 'Shareas',
  },
  {
    uri: '/profile/following',
    title: 'Following',
  },
  {
    uri: '/profile/like',
    title: 'Like'
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

const ProfileName = connectAuth((props, {token}) =>  {
  const profileName = (props.username === undefined || props.username === token.sub)
    ? 'My'
    : `${props.username}'s`;

  return <h1>{profileName} profile</h1>
});


function Profile({ token }) {
  return (
    <div className="section profile">
      <Sidebar/>
      <main className="content">
        <div className="inner-content">
          <div className="heading">
            <ProfileName name={token.sub}/>
            <TabNav links={links} default="/profile" />
          </div>
        </div>
        {/*<UserMedias/>*/}
      </main>
    </div>
  );

}


export default connectAuth(Profile);
