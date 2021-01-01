import React from 'react';

import LikeCounter from 'sharea/component/LikeCounter';
import { useSharea } from 'sharea/store/sharea';


function ShareaLikeCounter({ id, size }) {

  const { map, like:likeSharea } = useSharea();
  const { like, likes } = map[id];
  const onLike = () => likeSharea(id);

  return (
    <LikeCounter
      size={size}
      like={like}
      likes={likes}
      onLike={onLike}
    />
  );

}


export default ShareaLikeCounter;
