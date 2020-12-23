import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import layoutReducer from './layout';

export default configureStore({
  reducer: {
    auth: authReducer,
    layout: layoutReducer
  },
});

