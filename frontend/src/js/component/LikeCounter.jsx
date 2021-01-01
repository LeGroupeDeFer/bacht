import React from 'react';
import {Button} from 'react-bootstrap';
import {FontAwesomeIcon as Icon} from '@fortawesome/react-fontawesome';
import {faHeart as heartSolid} from '@fortawesome/free-solid-svg-icons';
import {faHeart as heartRegular} from '@fortawesome/free-regular-svg-icons';



function LikeCounter({ likes, like, onLike, size }) {

  return (
    <div className="like-counter">
      <Button onClick={onLike}>
        <Icon icon={like ? heartSolid : heartRegular} size={size} />
      </Button>
      <small className="text-muted">{likes}</small>
    </div>
  );

}

export default LikeCounter;
