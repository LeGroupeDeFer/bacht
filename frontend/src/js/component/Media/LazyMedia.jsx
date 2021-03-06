import React, { useEffect } from 'react';

import { Card } from 'react-bootstrap';

import Media from './index';
import Error from 'sharea/component/Error';
import { useMedia } from 'sharea/store/media';
import { STATUS } from 'sharea/lib';


function LazyMedia({id}) {
  const { state, medias, error, fetchMedia } = useMedia();

  useEffect(() => {
    if (medias[id] === undefined) {
      fetchMedia(id);
    }
  }, []);

  if(state === STATUS.FAILED) {
    return <Error error={error}/>
  }

  if (medias[id] === undefined) {
    return <Media.Loading />
  }

  return <Media.Card {...medias[id]} />
}


export default LazyMedia;
