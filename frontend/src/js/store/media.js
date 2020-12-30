import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector, connect } from 'react-redux';
import { api, status } from '../lib';


const initialState = {
  status: status.IDLE,
  error: null,
  media: {},
  self: []
};

export const fetchMedias = createAsyncThunk(
  'media/all',
  () => {
    return api.media();
  }
);

export const slice = createSlice({
  name: 'media',
  initialState,
  reducers: {},
  extraReducers: {
    // ALL
    [fetchMedias.pending]: (state, _) => {
      state.status = status.LOADING;
    },
    [fetchMedias.fulfilled]: (state, action) => {
      state.status = status.SUCCEEDED;
      state.media = action.payload;
    },
    [fetchMedias.rejected]: (state, action) => {
      state.status = status.FAILED;
      state.error = action.error;
      state.media = {};
      state.self = [];
    },
  }
});

export const useMedia = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.media);
  return {
    ...state,
    fetchMedias : () => dispatch(fetchMedias()),
  };
};

export const connectMedia = connect(
  state => state.media,
  { fetchMedias }
);


export default slice.reducer;