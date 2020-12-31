import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';


function ShareaCard({ id, name, description, creatorId }) {

  return (
    <Card className="sharea-card">
      <Card.Body>
        <Card.Title>
          <Link to={`/sharea/${id}`}>
            {name}
          </Link>
        </Card.Title>
        <Card.Text>
          <p>{description}</p>
          <p>{id}</p>
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <small className="TODO">
          <Link to={`/user/${creatorId}`}>@{creatorId}</Link> Got
          % likes
        </small>
      </Card.Footer>
    </Card>
  );

}

export default ShareaCard;
