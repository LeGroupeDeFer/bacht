import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector, connect } from 'react-redux';
import { api, STATUS } from '../lib';


const initialState = {
  status: STATUS.IDLE,
  error : null,
  map   : {},
  all   : [],
  self  : []
};

export const fetchAll = createAsyncThunk(
  'sharea/all',
  () => {
    return api.sharea.all();
  }
);

export const fetchSelf = createAsyncThunk(
  'sharea/self',
  () => {
    return api.sharea.self();
  }
);

export const create = createAsyncThunk(
  'sharea/create',
  (sharea) => {
    return api.sharea.create(sharea);
  }
);

export const update = createAsyncThunk(
  'sharea/update',
  (sharea) => {
    return api.sharea.update(sharea.id, sharea);
  }
);

export const slice = createSlice({
  name: 'sharea',
  initialState,
  reducers: {},
  extraReducers: {
    // ALL
    [fetchAll.pending]: (state, _) => {
      state.status = STATUS.LOADING;
      state.error = null;
    },
    [fetchAll.fulfilled]: (state, action) => {
      state.status = STATUS.IDLE;
      state.map = action.payload;
      state.all = Object.values(action.payload);
      state.error = null;
    },
    [fetchAll.rejected]: (state, action) => {
      state.status = STATUS.FAILED;
      state.error = action.error;
      state.map = {};
      state.all = [];
      state.self = [];
    },
    // SELF
    [fetchSelf.pending]: (state, _) => {
      state.status = STATUS.LOADING;
    },
    [fetchSelf.fulfilled]: (state, action) => {
      state.status = STATUS.IDLE;
      state.self = Object.keys(action.payload);
    },
    [fetchSelf.rejected]: (state, action) => {
      state.status = STATUS.FAILED;
      state.error = action.error;
      state.self = [];
    },
    // CREATE
    [create.pending]: (state, _) => {
      state.status = STATUS.LOADING;
    },
    [create.fulfilled]: (state, action) => {
      state.status = STATUS.IDLE;
      const s = action.payload;
      state.map[s.id] = s;
      state.all = Object.values(state.map);
    },
    [create.rejected]: (state, action) => {
      state.status = STATUS.FAILED;
      state.error = action.error;
      state.self = [];
    },
    // UPDATE
    [update.pending]: (state, _) => {
      state.status = STATUS.LOADING;
    },
    [update.fulfilled]: (state, action) => {
      state.status = STATUS.IDLE;
      const s = action.payload;
      state.map[s.id] = s;
      state.all = Object.values(state.map);
    },
    [update.rejected]: (state, action) => {
      state.status = STATUS.FAILED;
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
    fetchAll : () => dispatch(fetchAll()),
    fetchSelf : () => dispatch(fetchSelf()),
    create: shareaDefinition => dispatch(create(shareaDefinition)),
    byId: (id) => state.sharea[id]
  };
};

export const selectSharea = id =>
  useSelector(state => state.sharea.sharea[id]);


export const connectSharea = connect(
  state => state.sharea,
  { fetchAll, fetchSelf, create }
);


export default slice.reducer;
