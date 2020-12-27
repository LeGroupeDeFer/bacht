import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector, connect } from 'react-redux';
import { now, api } from '../lib';


class AuthError extends Error {}

const initialState = {
  token     : null,
  request   : null,
  status    : 'idle',
  error     : null,
  inSession : api.auth.inSession()
};

export const login = createAsyncThunk(
  'auth/login',
  ({ username, password }) => {
    if (api.auth.inSession())
      return Promise.reject(new AuthError('Already connected'));
    return api.auth.login(username, password)
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  () => {
    if (!api.auth.inSession())
      return Promise.reject(new AuthError('Out of session'));
    return api.auth.logout();
  }
);

export const refresh = createAsyncThunk(
  'auth/refresh',
  () => {
    if (!api.auth.inSession())
      return Promise.reject(new AuthError('Out of session'));
    return api.auth.refresh();
  }
);

export const register = createAsyncThunk(
  'auth/register',
  ({ username, password, firstName, lastName, biopic }) => {
    if (api.auth.inSession())
      return Promise.reject(new AuthError('Already connected'));
    return api.auth.register(username, password, firstName, lastName, biopic);
  }
)

export const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: {
    // LOGIN
    [login.pending]: (state, _) => {
      state.status = 'loading';
      state.request = 'login';
      state.error = null;
    },
    [login.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.token = action.payload;
      state.error = null;

      state.timer = setTimeout(refresh, state.token.exp - now());
      state.inSession = true;
    },
    [login.rejected]: (state, action) => {
      state.status = 'failed';
      state.token = null;
      state.error = action.error;
    },
    // LOGOUT
    [logout.pending]: (state, _) => {
      state.status = 'loading'
      state.request = 'logout';
      state.error = null;
    },
    [logout.fulfilled]: (state, _) => {
      state.status = 'succeeded';
      state.token = null;
      state.error = null;
      state.inSession = false;

      clearTimeout(state.timer);
      state.timer = null;
    },
    [logout.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error;
    },
    // REFRESH
    [refresh.pending]: (state, _) => {
      state.status = 'loading';
      state.request = 'refresh';
    },
    [refresh.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.token = action.payload;
      state.inSession = true;

      clearTimeout(state.timer);
      state.timer = setTimeout(refresh, state.token.exp - now());
    },
    [refresh.rejected]: (state, action) => {
      state.status = 'failed';
      state.token = null;
      state.error = action.error;
      state.inSession = false;
    },
    // REGISTER
    [register.pending]: (state, _) => {
      state.status = 'loading';
      state.request = 'register';
      state.error = null;
    },
    [register.fulfilled]: (state, _) => {
      state.status = 'succeeded';
    },
    [register.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error;
    }
  },
});


export const useAuth = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.auth);
  return {
    ...state,
    login   : (username, password) => dispatch(login({ username, password })),
    logout  : () => dispatch(logout()),
    refresh : () => dispatch(refresh()),
    register: (username, password) => dispatch(register({ username, password }))
  };
};


export const connectAuth = connect(
  state => state.auth,
  { login, logout, refresh, register }
);


export default slice.reducer;
