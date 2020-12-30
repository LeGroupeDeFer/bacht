import React, { useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import { useAuth } from 'sharea/store/app';


function Logout(_) {

  const { authenticated, status, logout } = useAuth();
  const history = useHistory();

  useEffect(
    () => {
      if (authenticated)
        logout();
      history.replace('/auth/login')
    },
    []
  );

  return <></>;

}


export default Logout;
