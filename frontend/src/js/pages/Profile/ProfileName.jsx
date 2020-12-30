import React from 'react';
import LikeCounter from 'sharea/component/LikeCounter';

function ProfileName({username, isSelf, id, like, likes}) {

  let profileName = <>'My profile'</>
  if (!isSelf) {
    profileName =
      <>
        <div>{`${username}'s profile`}</div>
        <LikeCounter
          like={like}
          likes={likes}
          url={`/user/${id}/like`}
        />
      </>
  }

  return <h1>{profileName}</h1>
}

export default ProfileName;