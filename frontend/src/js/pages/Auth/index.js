import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import Login from './Login';
import Logout from './Logout';
import Register from './Register';


// Auth :: None => Component
function Auth(_) {

  let { url } = useRouteMatch();

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


export default Auth;
