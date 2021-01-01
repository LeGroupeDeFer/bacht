import React from 'react';

import { Card } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'

import { useUser } from 'sharea/store/user';
import Loader from 'sharea/component/Loader'

import { STATUS, randomColor } from 'sharea/lib';
import LikeCounter from 'sharea/component/LikeCounter';


function ShareaCardNew(_) {

  const history = useHistory();
  const onClick = _ => history.push('/sharea/new');

  return (
    <Card className="sharea-card sharea-card-new" onClick={onClick}>
      <Card.Body>
        <Card.Title>
          New Sharea
        </Card.Title>
        <Icon
          icon={faPlusSquare}
          size="4x"
          className="d-block mx-auto mt-3"
        />
      </Card.Body>
      <Card.Footer>
        <small className="sharea-card-footer">
        </small>
      </Card.Footer>
    </Card>
  );

}

function ShareaCard({ isNew, id, name, description, creator, like, likes }) {
  if (isNew) return <ShareaCardNew />;

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
        <Card.Text className="sharea-card-description">{description}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <small className="sharea-card-footer d-flex justify-content-between">
          <Link to={`/profile/${creator}`}>@{users[creator].username}</Link>
          <LikeCounter like={like} likes={likes} url={`/api/sharea/${id}/sharealike`} />
        </small>
      </Card.Footer>
    </Card>
  );

}

export default ShareaCard;
