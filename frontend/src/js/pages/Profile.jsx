import React from 'react';

import { useAuth } from 'sharea/store/app';
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


function UserMedias(_) {

  const { token } = useAuth();
  const username = token.sub;

  return (
    <div className="medias">
      Hello, {username}!
      { /* Met les medias ici pour le moment Alex! */}
    </div>
  );

}

function ProfileName(props) {
  const { token } = useAuth();
  const profileName = (props.username === undefined || props.username === token.sub)
    ? 'My'
    : `${props.username}'s`;

  return <h1>{profileName} profile</h1>
}


function Profile(_) {
  const { token } = useAuth();

  return (
    <main className="content">
      <div className="inner-content">
        <div className="heading">
          <ProfileName name={token.sub}/>
          <TabNav links={links} default="/profile" />
        </div>
      </div>
    </main>
  );

}


export default Profile;
