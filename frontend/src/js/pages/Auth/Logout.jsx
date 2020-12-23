import React, {useEffect} from 'react';

import { useHistory } from 'react-router-dom';

import { connectAuth } from 'sharea/store/auth';


function Logout({ logout, inSession, status }) {

  const history = useHistory();
  useEffect(
    () => inSession ? logout() : history.replace('/auth/login'),
    [status]
  );

  return <></>;

}


export default connectAuth(Logout);
