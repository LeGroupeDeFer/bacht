import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {useDispatch, useSelector, connect} from 'react-redux';
import {now, api, STATUS} from '../lib';


class UserError extends Error {
}

const initialState = {
  status: STATUS.IDLE,
  error: null,
  currentUser: null,
  users: {}
};

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

export const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
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
    [fetchSpecificUser.pending]: (state, _) => {
      state.status = STATUS.LOADING;
    },
    [fetchSpecificUser.fulfilled]: (state, action) => {
      state.status = STATUS.IDLE;
      const u = action.payload;
      state.users[u.id] = u;
    },
    [fetchSpecificUser.rejected]: (state, action) => {
      state.status = STATUS.FAILED;
      state.error = action.error;
    },
  }
});

export const useUser = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.user);
  return {
    ...state,
    fetchCurrentUser: () => dispatch(fetchCurrentUser()),
    fetchSpecificUser: id => dispatch(fetchSpecificUser({id}))
  };
};

export const connectUser = connect(
  state => state.user,
  {fetchCurrentUser, fetchSpecificUser}
);

export default slice.reducer;
