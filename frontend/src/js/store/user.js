import {createSlice, createAsyncThunk, unwrapResult} from '@reduxjs/toolkit';
import { useDispatch, useSelector, connect } from 'react-redux';

import { api, STATUS } from '../lib';


/* --------------------------------- Utils --------------------------------- */

class UserError extends Error {}

/* ---------------------------- Initial State ------------------------------ */

const initialState = {
  status: STATUS.IDLE,
  error: null,
  currentUser: null,
  users: {}
};

/* -------------------------------- Thunks --------------------------------- */

export const fetchCurrentUser = createAsyncThunk(
  'user/self',
  () => {
    return api.user.self();
  }
);

export const fetchSpecificUser = createAsyncThunk(
  'user/specific',
  ({id}) => {
    return api.user.byId(id);
  }
);

export const update = createAsyncThunk(
  'user/update',
  (data) => {
    return api.user.update(data);
  }
);

/* --------------------------------- Slice --------------------------------- */

export const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    // CURRENT
    [fetchCurrentUser.pending]: (state, _) => {
      state.status = STATUS.LOADING;
    },
    [fetchCurrentUser.fulfilled]: (state, action) => {
      state.status = STATUS.IDLE;
      state.currentUser = action.payload;
      state.users[state.currentUser.id] = state.currentUser;
    },
    [fetchCurrentUser.rejected]: (state, action) => {
      state.status = STATUS.FAILED;
      state.error = action.error;
      state.currentUser = null;
    },
    // SPECIFIC
    [fetchSpecificUser.pending]: (state, _) => {
      state.status = STATUS.LOADING;
    },
    [fetchSpecificUser.fulfilled]: (state, action) => {
      state.status = STATUS.IDLE;
      state.users[action.payload.id] = action.payload;
    },
    [fetchSpecificUser.rejected]: (state, action) => {
      state.status = STATUS.FAILED;
      state.error = action.error;
    },
    // UPDATE CURRENT
    [update.pending]: (state, _) => {
      state.status = STATUS.LOADING;
    },
    [update.fulfilled]: (state, action) => {
      state.status = STATUS.IDLE;
      state.currentUser = action.payload;
      state.users[action.payload.id] = action.payload;
    },
    [update.rejected]: (state, action) => {
      state.status = STATUS.FAILED;
      state.error = action.error;
    },
  }
});

/* ---------------------------------- API ---------------------------------- */

export const useUser = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.user);
  return {
    ...state,
    fetchCurrentUser: () =>
      dispatch(fetchCurrentUser()).then(unwrapResult),
    fetchSpecificUser: id =>
      dispatch(fetchSpecificUser({id})).then(unwrapResult),
    update: data =>
      dispatch(update(data)).then(unwrapResult)
  };
};

export const connectUser = connect(
  state => state.user,
  { fetchCurrentUser, fetchSpecificUser, update }
);


export default slice.reducer;
