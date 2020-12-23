import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector, connect } from 'react-redux';


const initialState = {
  sidebar: { isOpen: false }
};


export const slice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    toggleSidebar: (state, _) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },
    showSidebar: (state, _) => {
      state.sidebar.isOpen = true;
    },
    hideSidebar: (state, _) => {
      state.sidebar.isOpen = false;
    }
  }
});

const { toggleSidebar, showSidebar, hideSidebar } = slice.actions;

export const connectLayout = connect(
  state => state.layout,
  { toggleSidebar, showSidebar, hideSidebar }
);


export const useLayout = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.layout);
  return {
    ...state,
    toggleSidebar: dispatch(toggleSidebar()),
    showSidebar: dispatch(showSidebar()),
    hideSidebar: dispatch(hideSidebar())
  };
};


export default slice.reducer;
