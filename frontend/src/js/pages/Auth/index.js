import React, { useEffect } from 'react';
import { Link, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';

import { connectAuth } from 'sharea/store/auth';
import Loader from 'sharea/component/Loader';
import Heading from 'sharea/component/Heading';

import Login from 'sharea/Login';
import Logout from 'sharea/Logout';
import Register from 'sharea/Register';


// Auth :: None => Component
function Auth({ inSession, refresh, status }) {

  const { pathname } = useLocation();
  const { url } = useRouteMatch();

  useEffect(() =>
    inSession && !pathname.endsWith('logout') && refresh(),
    []
  );

  if (status === 'loading')
    return <Loader.Centered width="100" />;

  return (
    <div className="auth">

      <Heading />
      <hr />

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

      <footer>
        <div><Link to="/auth/login">Login</Link></div>
        <div>|</div>
        <div><Link to="/auth/register">Register</Link></div>
        <div>|</div>
        <div><Link to="/faq">FAQ</Link></div>
      </footer>
    </div>
  );

}


export default connectAuth(Auth);
