import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useUser } from 'sharea/store/user';
import Loader from 'sharea/component/Loader'
import { STATUS } from 'sharea/lib';
import LikeCounter from 'sharea/component/LikeCounter';


function ShareaCard({ id, name, description, creator, like, likes}) {

  const { fetchSpecificUser, status, users } = useUser();

  if (users[creator] === undefined || status === STATUS.LOADING) {
    fetchSpecificUser(creator);
    return <Loader.Centered width="100" />
  }

  return (
    <Card className="sharea-card">
      <Card.Body>
        <Card.Title>
          <Link to={`/sharea/${id}`}>
            {name}
          </Link>
        </Card.Title>
        <Card.Text>{description}</Card.Text>
        <Card.Text>{id}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <small className="TODO">
          <Link to={`/profile/${creator}`}>@{users[creator].username}</Link>
          <LikeCounter like={like} likes={likes} url={`/api/sharea/${id}/sharealike`}/>
        </small>
      </Card.Footer>
    </Card>
  );

}

export default ShareaCard;
