import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector, connect } from 'react-redux';
import { now, api } from '../lib';


class AuthError extends Error {}

const initialState = {
  token : null,
  status: 'idle',
  error : null,
  inSession: api.auth.inSession()
};

export const login = createAsyncThunk(
  'auth/login',
  ({ username, password }) => api.auth.login(username, password)
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

export const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: {
    // LOGIN
    [login.pending]: (state, _) => {
      state.status = 'loading';
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
      state.status = 'loading';
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
    }
  },
});


export const useAuth = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.auth);
  return ({
    ...state,
    login: (username, password) => dispatch(login({ username, password })),
    logout: () => dispatch(logout()),
    refresh: () => dispatch(refresh())
  });
};


export const connectAuth = connect(
  state => state.auth,
  { login, logout, refresh }
);


export default slice.reducer;
