import React from 'react';

import { useAuth } from '../store/app';


function AuthGuard({ reverse, children }) {
  const { authenticated } = useAuth();

  if (authenticated && !reverse || !authenticated && reverse)
    return children;
  return <></>;
}


export default AuthGuard;
