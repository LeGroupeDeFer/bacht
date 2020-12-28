import React, { lazy, Suspense, useEffect } from 'react';
import {
  Switch,
  Route,
  useHistory
} from 'react-router-dom';

import { connectAuth } from './store/auth';
import Loader from './component/Loader';


const Home = lazy(() => import('./pages/Home'));
const Auth = lazy(() => import('./pages/Auth'));
const Profile = lazy(() => import('./pages/Profile'));
const Discover = lazy(() => import('./pages/Discover'));


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
