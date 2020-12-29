import React, { lazy, Suspense, useEffect } from 'react';
import {
  Switch,
  Route,
  useHistory
} from 'react-router-dom';

import { connectAuth } from 'sharea/store/auth';
import Loader from 'sharea/component/Loader';


const Home = lazy(() => import('sharea/pages/Home'));
const Auth = lazy(() => import('sharea/pages/Auth'));
const Profile = lazy(() => import('sharea/pages/Profile/index'));
const Discover = lazy(() => import('sharea/pages/Discover'));


// App :: None => Component
function App({ inSession, refresh, status }) {

  const history = useHistory();

  useEffect(() => inSession
    ? refresh() && history.push('/dashboard')
    : history.push('/auth/login'
  ), []);

  if (status === 'loading')
    return <Loader.Centered width="100" />;

  return (
    <Suspense fallback={<Loader width="50" />}>
      <Switch>
        <Route path="/auth">
          <Auth />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/discover">
          <Discover />
        </Route>
        <Route path={['/', '/dashboard/:others']}>
          <Home />
        </Route>
      </Switch>
    </Suspense>
  );

}


export default connectAuth(App);
