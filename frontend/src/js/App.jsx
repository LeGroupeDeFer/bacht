import React, { lazy, Suspense, useEffect } from 'react';
import {
  Switch,
  Route,
  useHistory
} from 'react-router-dom';

import Loader from 'sharea/component/Loader';
import Sidebar from 'sharea/component/layout/Sidebar';
import { useInitialization } from 'sharea/store/app';
import { useUser } from 'sharea/store/user';


const Home = lazy(() => import('sharea/pages/Home'));
const Auth = lazy(() => import('sharea/pages/Auth'));
const Profile = lazy(() => import('sharea/pages/Profile'));
const Discover = lazy(() => import('sharea/pages/Discover'));
const Sharea = lazy(() => import('sharea/pages/Sharea'));


function App(_) {

  const history = useHistory();
  const [status, authenticated] = useInitialization();
  const { currentUser } = useUser();

  useEffect(() => {
    if (status === 'idle' && !authenticated)
      history.push('/auth/login');
    if (status === 'idle' && authenticated)
      history.push('/dashboard');
  }, [status, authenticated]);

  if (status === 'loading')
    return <Loader.Centered width="100" />;

  return (
      <div className="section">
        <Sidebar />
        <Suspense fallback={<Loader width="50" />}>
          <Switch>
            <Route path="/auth">
              <Auth />
            </Route>
            <Route path="/profile/:id">
              <Profile />
            </Route>
            <Route path="/discover">
              <Discover />
            </Route>
            <Route path="/sharea/:id">
              <Sharea />
            </Route>
            <Route path={['/', '/dashboard/:others']}>
              <Home />
            </Route>
          </Switch>
        </Suspense>
      </div>
  );

}


export default App;
