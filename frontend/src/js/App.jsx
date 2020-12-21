import React, { lazy, Suspense, useEffect } from 'react';
import {
  Switch,
  Route,
  useHistory
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { refresh, selectConnected } from './store/auth';
import api from './lib/api';


const Home = lazy(() => import('./pages/Home'));
const Auth = lazy(() => import('./pages/Auth'));


// App :: None => Component
function App(_) {

  const dispatch  = useDispatch();
  const history   = useHistory();
  const connected = useSelector(selectConnected);

  useEffect(() => {
    if (!connected)
      if (api.auth.inSession())
        dispatch(refresh());
      else
        history.push('/auth/login');
  }, []);

  return (
    <Suspense fallback="Loading...">
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
      </Switch>
    </Suspense>
  );

}


export default App;
