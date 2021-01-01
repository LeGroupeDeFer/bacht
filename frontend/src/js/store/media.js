import { createSlice, createAsyncThunk, unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector, connect } from 'react-redux';
import { api, STATUS } from '../lib';


const initialState = {
  status: STATUS.IDLE,
  error: null,
  medias: {}
};

export const fetchMedia = createAsyncThunk(
  'media/specific',
  ({id}) => {
    return api.media.byId(id);
  }
);

export const slice = createSlice({
  name: 'media',
  initialState,
  reducers: {},
  extraReducers: {
    // ALL
    [fetchMedia.pending]: (state, _) => {
      state.status = STATUS.LOADING;
    },
    [fetchMedia.fulfilled]: (state, action) => {
      state.status = STATUS.IDLE;
      const m = action.payload;
      state.medias[m.id] = m;
    },
    [fetchMedia.rejected]: (state, action) => {
      state.status = STATUS.FAILED;
      state.error = action.error;
    },
  }
});

export const useMedia = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.media);
  return {
    ...state,
    fetchMedia: id =>
      dispatch(fetchMedia({id})).then(unwrapResult),
  };
};

export const connectMedia = connect(
  state => state.media,
  { fetchMedia }
);

export default slice.reducer;
