import React from 'react';

import Sidebar from 'sharea/component/layout/Sidebar';
import { connectAuth } from 'sharea/store/auth';


const UserMedias = connectAuth(({ token }) => {

  // TODO - User medias List
  const username = token.sub;

  return (
    <div className="medias">
      Hello, {username}!
      { /* Met les medias ici pour le moment Alex! */ }
    </div>
  );

});


function Profile(_) {

  return (
    <div className="section profile">
      <Sidebar />
      <main className="content">
        <div className="heading">
          <h1>Profile</h1>
        </div>
        <UserMedias />
      </main>
    </div>
  );

}


export default Profile;
