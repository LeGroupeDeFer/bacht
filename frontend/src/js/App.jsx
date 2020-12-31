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
import NewSharea from 'sharea/component/Sharea/NewSharea';


const Home = lazy(() => import('sharea/pages/Home'));
const Auth = lazy(() => import('sharea/pages/Auth'));
const Profile = lazy(() => import('sharea/pages/Profile'));
const Discover = lazy(() => import('sharea/pages/Discover'));
const Sharea = lazy(() => import('sharea/component/Sharea'));


// App :: None => Component
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
            <Route exact path="/profile/self">
              <Profile user={currentUser} />
            </Route>
            <Route path="/profile/:id">
              {/*todo : load correct user*/}
              <Profile user={currentUser} />
            </Route>
            <Route path="/discover">
              <Discover />
            </Route>
            <Route exact path="/sharea/new">
              <NewSharea />
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
