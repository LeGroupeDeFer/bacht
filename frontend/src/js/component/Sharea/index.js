import React, { useEffect, useState } from 'react';

import {
  Button, Col, Container, Form, ListGroup, ListGroupItem, OverlayTrigger,
  Popover, Row
} from 'react-bootstrap';

import { capitalize } from 'sharea/lib';
import LikeCounter from 'sharea/component/LikeCounter';
import AuthorEdit from 'sharea/component/AuthorEdit';
import Media from 'sharea/component/Media';

import ShareaCard from './ShareaCard';
import ShareaList from './ShareaList';
import NewSharea from './NewSharea';
import {useUser} from "sharea/store/user";


function ShareaTitle({ id, name, like, likes }) {

  return (
    <h1>
      {capitalize(name)}
      <LikeCounter
        size="2x"
        like={like}
        likes={likes}
        url={`/api/sharea/${id}/sharealike`}
      />
    </h1>
  );

}

function ShareaInfo({ isEditing, onChange, onSubmit, onCancel, ...sharea }) {
  
  if (isEditing)
    return (
      <Form
        autoComplete="off"
        action={`/sharea/${sharea.id}`}
        method="PUT"
        className="sharea-info-form"
      >
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={sharea.name}
            onChange={onChange('name')}
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            value={sharea.description}
            onChange={onChange('description')}
          />
        </Form.Group>
        <div className="action">
          <Button variant="dark" onClick={onCancel}>Cancel</Button>
          <Button variant="light" onSubmit={onSubmit}>Submit</Button>
        </div>
      </Form>
    );

  return (
    <>
      <h4 className="text-light">{sharea.name}</h4>
      <p className="text-light">{sharea.description}</p>
    </>
  );

}


function Sharea(props) {

  const { currentUser } = useUser();

  const [state, setState] = useState(props);
  const [isEditing, setIsEditing] = useState(currentUser.id === props.creator);

  const { id, name, description, medias, like, likes, creator } = state;
  const author = { id: creator, username: 'darwin' };

  const reset = () => setState(s => ({ ...s, ...props }));
  const onChange = name => e => setState(
    s => ({ ...s, [name]: e.target.value })
  );
  const onCancel = () => reset() || setIsEditing(false);
  const onLike = like => {
    console.log(like);
  };
  const onSubmission = () => {
    console.log('submitted');
    setIsEditing(false);
  };

  return (
    <main className="content sharea">
      <div className="inner-content">
        <div className="heading">
          <ShareaTitle
            id={id}
            name={name}
            author={author}
            like={like}
            likes={likes}
            onLike={onLike}
          />
        </div>

        <Container
          fluid
          className={`sharea-content${isEditing ? ' sharea-edit' : ''}`}
        >
          <Row>
            <Col lg={9} className="px-0">
              <Media.List medias={medias} />
            </Col>

            <Col lg={3} className="px-0">
              <aside className="sharea-sidebar">
                <ShareaInfo
                  {...state}
                  isEditing={isEditing}
                  onChange={onChange}
                  onSubmit={onsubmit}
                  onCancel={onCancel}
                />
              </aside>
            </Col>
          </Row>
        </Container>
      </div>
    </main>
  );

}

Sharea.Card = ShareaCard;
Sharea.List = ShareaList;
Sharea.Form = NewSharea;


export default Sharea;
