import { configureStore } from '@reduxjs/toolkit';
import appReducer from './app';
import layoutReducer from './layout';
import shareaReducer from './sharea';
import mediaReducer from './media';

const store = configureStore({
  reducer: {
    app: appReducer,
    layout: layoutReducer,
    sharea: shareaReducer,
    media: mediaReducer
  },
});

export default store;
