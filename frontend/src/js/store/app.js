import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useSharea } from './sharea';
import { useUser } from './user';
import { api, now, STATUS } from 'sharea/lib';

/* --------------------------------- Utils --------------------------------- */

let timer;

const clear = x => {
  if (timer) clearTimeout(timer);
  api.auth.clear();
  return x;
};

const clearFailure = err => clear() || Promise.reject(err);

const plan = dispatch => token => {
  if (timer) clearTimeout(timer);
  const time = (token.exp - now()) * 1000;
  timer = setTimeout(() => dispatch(refresh()), time);
  return token;
};

/* ---------------------------- Initial State ------------------------------ */

const initialState = {
  status        : STATUS.INITIALIZING,
  failure       : null,

  authenticated : false,
  token: null,
};

/* -------------------------------- Thunks --------------------------------- */

export const login = createAsyncThunk(
  'app/login',
  ({ username, password }, thunkAPI) => {
    const { authenticated } = thunkAPI.getState();
    const dispatch = thunkAPI.dispatch;

    if (authenticated)
      return Promise.reject(new Error('Already connected'));
    return api.auth.login(username, password)
      .then(plan(dispatch))
      .catch(clearFailure);
  }
);

export const logout = createAsyncThunk(
  'app/logout',
  (_, thunkAPI) => {
    return api.auth.logout()
      .then(clear)
      .catch(clearFailure);
  }
);

export const refresh = createAsyncThunk(
  'app/refreshToken',
  (_, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;

    if (!api.auth.inSession())
      return clear() || Promise.reject(new Error('Out of session'));

    return api.auth.refresh()
      .then(plan(dispatch))
      .catch(clearFailure);
  }
);

export const register = createAsyncThunk(
  'app/register',
  ({ username, password, firstName, lastName, biopic }, thunkAPI) => {
    const { authenticated } = thunkAPI.getState();

    if (authenticated)
      return Promise.reject(new Error('Already connected'));
    return api.auth.register(username, password, firstName, lastName, biopic);
  }
);

/* --------------------------------- Slice --------------------------------- */

export const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    initialize: (state, _) => {
      state.status = STATUS.IDLE;
    }
  },
  extraReducers: {
    // LOGIN
    [login.pending]: (state, _) => {
      state.status = STATUS.LOADING;
      state.failure = null;
    },
    [login.fulfilled]: (state, action) => {
      state.status = STATUS.IDLE;
      state.authenticated = true;
      state.token = action.payload;
      state.failure = null;
    },
    [login.rejected]: (state, action) => {
      state.status = STATUS.FAILED;
      state.token = null;
      state.failure = action.error;
    },
    // LOGOUT
    [logout.pending]: (state, _) => {
      state.status = STATUS.LOADING;
      state.failure = null;
    },
    [logout.fulfilled]: (state, _) => {
      state.status = STATUS.IDLE;
      state.authenticated = false;
      state.token = null;
      state.failure = null;
    },
    [logout.rejected]: (state, action) => {
      state.status = STATUS.FAILED;
      state.authenticated = false;
      state.token = null;
      state.error = action.error;
    },
    // REFRESH
    [refresh.pending]: (state, _) => {
      state.status = STATUS.IDLE;
    },
    [refresh.fulfilled]: (state, action) => {
      state.status = STATUS.IDLE;
      state.authenticated = true;
      state.token = action.payload;
      state.failure = null;
    },
    [refresh.rejected]: (state, action) => {
      state.status = STATUS.FAILED;
      state.authenticated = false;
      state.token = null;
      state.failure = action.error;
    },
    // REGISTER
    [register.pending]: (state, _) => {
      state.status = STATUS.LOADING;
      state.failure = null;
    },
    [register.fulfilled]: (state, _) => {
      state.status = STATUS.IDLE;
    },
    [register.rejected]: (state, action) => {
      state.status = STATUS.FAILED;
      state.failure = action.error;
    }
  }
});

/* ---------------------------------- API ---------------------------------- */

export const { initialize } = slice.actions;


export const useInitialization = () => {

  const dispatch = useDispatch();

  const { authenticated, status, failure } = useSelector(state => state.app);
  const { all, fetchAll: fetchShareas, fetchSelf: fetchSelfShareas } = useSharea();
  const { fetchCurrentUser } = useUser();

  useEffect(() => api.auth.inSession()
    ? dispatch(refresh())
    : dispatch(initialize()),
  []);

  useEffect(() => {
    if (all.length === 0 && status === STATUS.IDLE && authenticated)
      fetchShareas() && fetchSelfShareas() && fetchCurrentUser();
  }, [status, authenticated]);

  return [status, authenticated, failure];

};

export const useAuth = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.app);
  return {
    ...state,
    login   : (username, password) => dispatch(login({ username, password })),
    logout  : () => dispatch(logout()),
    register: info => dispatch(register(info))
  };
};


export default slice.reducer;
