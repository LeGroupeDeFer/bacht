import React from 'react';

import { connectAuth } from '../store/auth';


function AuthGuard({ inSession, reverse, children }) {
  if (inSession && !reverse || !inSession && reverse)
    return children;
  return <></>;
}


export default connectAuth(AuthGuard);
