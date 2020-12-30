import { configureStore } from '@reduxjs/toolkit';
import appReducer from './app';
import layoutReducer from './layout';
import shareaReducer from './sharea';
import mediaReducer from './media';
import userReducer from './user';

const store = configureStore({
  reducer: {
    app: appReducer,
    layout: layoutReducer,
    sharea: shareaReducer,
    media: mediaReducer,
    user: userReducer
  },
});

export default store;
