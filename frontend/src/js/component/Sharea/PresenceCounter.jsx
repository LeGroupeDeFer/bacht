import React from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faUser as userFull, faUsers, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import {faUser as userEmpty} from '@fortawesome/free-regular-svg-icons';

function PresenceCounter({ count, ...props }) {

  const myIcon = (count) => {
    switch (count) {
      case 0:
        return userEmpty;
      case 1 :
        return userFull;
      case 2:
        return faUserFriends;
      default:
        return faUsers;
    }
  };

  return (<>
    <Icon className="mr-2" icon={myIcon(count)} />
    {count}
  </>)
}

export default PresenceCounter;