import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector, connect } from 'react-redux';
import { api, STATUS } from '../lib';


const initialState = {
  status: status.IDLE,
  error: null,
  media: {}
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
      state.status = STATUS.LOADING;
    },
    [fetchMedias.fulfilled]: (state, action) => {
      state.status = status.IDLE;
      state.media = action.payload;
    },
    [fetchMedias.rejected]: (state, action) => {
      state.status = STATUS.FAILED;
      state.error = action.error;
      state.media = {};
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
