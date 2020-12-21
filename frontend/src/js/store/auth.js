import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { now, api, defined } from '../lib';


const initialState = {
  token : null,
  status: 'idle',
  error : null,
  timer : null
};

export const login = createAsyncThunk(
  'auth/login',
  ({ username, password }) => api.auth.login(username, password)
);

export const logout = createAsyncThunk(
  'auth/logout',
  () => {
    if (!api.auth.inSession())
      return Promise.reject(new Error('Out of session'));
    return api.auth.logout();
  }
);

export const refresh = createAsyncThunk(
  'auth/refresh',
  () => {
    if (!api.auth.inSession())
      return Promise.reject(new Error('Out of session'));
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

      clearTimeout(state.timer);
      state.timer = setTimeout(refresh, state.token.exp - now());
    },
    [refresh.rejected]: (state, action) => {
      state.status = 'failed';
      state.token = null;
      state.error = action.error;
    }
  },
});

export const selectConnected = state => defined(state.token);

export const selectSubject = state => state.token.sub;

export const selectToken = state => state.token;


export default slice.reducer;
