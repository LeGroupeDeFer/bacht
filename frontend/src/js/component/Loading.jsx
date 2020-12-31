import React from 'react';

import { STATUS } from 'sharea/lib';
import Loader from './Loader';


function Loading(Component, slice) {

  const sliceData = slice();

  function wrapper(props) {
    if (sliceData.status === STATUS.LOADING)
      return <Loader.Centered width="100" />;
    return <Component {...sliceData} {...props} />;
  }

  wrapper.name = Component.name;
  return wrapper;

}


export default Loading;
