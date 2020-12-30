import React from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';

import { useAuth } from 'sharea/store/app';
import Loader from 'sharea/component/Loader';
import Heading from 'sharea/component/Heading';
import Login from 'sharea/pages/Auth/Login';
import Logout from 'sharea/pages/Auth/Logout';
import Register from 'sharea/pages/Auth/Register';


// Auth :: None => Component
function Auth(_) {

  const { url } = useRouteMatch();
  const { status } = useAuth();

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


export default Auth;
