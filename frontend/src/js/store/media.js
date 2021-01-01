import { createSlice, createAsyncThunk, unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector, connect } from 'react-redux';
import { api, STATUS } from '../lib';
import { addMedia } from './sharea';


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

export const postMedia = createAsyncThunk(
  'media/post',
  (data, thunkAPI) => {
    return api.media.create(data).then(response => {
      thunkAPI.dispatch(addMedia({
        shareaId: response.shareaId, mediaId: response.id
      }));
      return response;
    });
  }
);


export const slice = createSlice({
  name: 'media',
  initialState,
  reducers: {},
  extraReducers: {
    // SPECIFIC
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
    // POST
    [postMedia.pending]: (state, _) => {
      state.status = STATUS.LOADING;
    },
    [postMedia.fulfilled]: (state, action) => {
      state.status = STATUS.IDLE;
      const m = action.payload;
      state.medias[m.id] = m;
    },
    [postMedia.rejected]: (state, action) => {
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
    postMedia: data =>
      dispatch(postMedia(data)).then(unwrapResult)
  };
};

export const connectMedia = connect(
  state => state.media,
  { fetchMedia }
);

export default slice.reducer;
