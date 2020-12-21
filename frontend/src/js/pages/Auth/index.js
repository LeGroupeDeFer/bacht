import React, { useEffect } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import { connectAuth } from 'sharea/store/auth';
import Loader from 'sharea/component/Loader';

import Login from './Login';
import Logout from './Logout';
import Register from './Register';


// Auth :: None => Component
function Auth({ inSession, refresh, status }) {

  let { url } = useRouteMatch();

  useEffect(() => inSession && refresh(), []);
  if (status === 'loading')
    return <Loader.Centered width="50" />;

  return (
    <Switch>
      <Route path={`${url}/login`}>
        <Login />
      </Route>
      <Route path={`${url}/logout`}>
        <Logout />
      </Route>
      <Route path={`${url}/register`}>
        <Register />
      </Route>
    </Switch>
  );

}


export default connectAuth(Auth);
