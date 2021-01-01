import React from 'react';

import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faUserCog, faUser } from '@fortawesome/free-solid-svg-icons'

import LikeCounter from 'sharea/component/LikeCounter';


function ProfileName({ isSelf, id, username, like, likes }) {

  if (isSelf)
    return (
      <h1>
        <Icon icon={faUserCog} className="mr-3" />
        Your profile
      </h1>
    );

  return (
    <h1>
      <Icon icon={faUser} className="mr-3" />
      {username}'s profile
      <LikeCounter
        like={like}
        likes={likes}
        url={`/user/${id}/like`}
      />
    </h1>
  );

}


export default ProfileName;