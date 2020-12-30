import React from 'react';
import {Button} from 'react-bootstrap';
import {FontAwesomeIcon as Icon} from '@fortawesome/react-fontawesome';
import {faHeart as heartSolid} from '@fortawesome/free-solid-svg-icons';
import {faHeart as heartRegular} from '@fortawesome/free-regular-svg-icons';



function LikeCounter({likes, like, url}) {
  const toggleLike = () => {
    console.log("gneeee");
    // contact given url
  }

  return <div>
    (<Button onClick={toggleLike}><Icon icon={like ? heartSolid : heartRegular} /></Button>)
    {likes}
  </div>
}

export default LikeCounter;