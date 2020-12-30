import {connectAuth} from 'sharea/store/auth';
import React from 'react';
import {FontAwesomeIcon as Icon} from '@fortawesome/react-fontawesome';
import {faHeart as heartSolid} from '@fortawesome/free-solid-svg-icons'
import {faHeart as heartRegular} from '@fortawesome/free-regular-svg-icons'
import {Link} from 'react-router-dom';

function Like({doLike, linkToggle}) {
  return <Link to={linkToggle}>
    <Icon
      className="nav-link-icon ml-2"
      icon={doLike ? heartSolid : heartRegular}
    />
  </Link>
}

const ProfileName = connectAuth((props) => {

  let profileName = <>'My profile'</>
  if (props.user.userName !== undefined && props.user.userName !== props.token.sub) {
    // todo : link this with backend to know if the current user like the user's profile
    const like = true;

    profileName =
      <>{`${props.user.userName}'s profile`}<Like
        doLike={like}
        linkToggle={`/user/${props.user.id}/like`}
      /></>
  }

  return <h1>{profileName}</h1>
});

export default ProfileName;