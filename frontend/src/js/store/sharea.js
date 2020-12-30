import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector, connect } from 'react-redux';
import { api, status } from '../lib';


const initialState = {
  status: status.IDLE,
  error: null,
  sharea: {},
  self: []
};

export const fetchShareas = createAsyncThunk(
  'sharea/all',
  () => {
    return api.sharea();
  }
);

export const fetchSelfShareas = createAsyncThunk(
  'sharea/self',
  () => {
    return api.sharea.self();
  }
);

export const slice = createSlice({
  name: 'sharea',
  initialState,
  reducers: {},
  extraReducers: {
    // ALL
    [fetchShareas.pending]: (state, _) => {
      state.status = status.LOADING;
    },
    [fetchShareas.fulfilled]: (state, action) => {
      state.status = status.SUCCEEDED;
      state.sharea = action.payload;
    },
    [fetchShareas.rejected]: (state, action) => {
      state.status = status.FAILED;
      state.error = action.error;
      state.sharea = {};
      state.self = [];
    },
    // SELF
    [fetchSelfShareas.pending]: (state, _) => {
      state.status = status.LOADING;
    },
    [fetchSelfShareas.fulfilled]: (state, action) => {
      state.status = status.SUCCEEDED;
      state.self = Object.keys(action.payload);
    },
    [fetchSelfShareas.rejected]: (state, action) => {
      state.status = status.FAILED;
      state.error = action.error;
      state.self = [];
    },
  }
});


export const useSharea = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.sharea);
  return {
    ...state,
    fetchShareas : () => dispatch(fetchShareas()),
    fetchSelfShareas : () => dispatch(fetchSelfShareas()),
  };
};


export const connectSharea = connect(
  state => state.sharea,
  { fetchShareas, fetchSelfShareas }
);


export default slice.reducer;