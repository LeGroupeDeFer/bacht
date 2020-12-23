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


// App :: None => Component
function App({ inSession }) {

  const history = useHistory();

  useEffect(() => inSession || history.push('/auth/login'), []);

  return (
    <Suspense fallback={<Loader width="50" />}>
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


export default connectAuth(App);
