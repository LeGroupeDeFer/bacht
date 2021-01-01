import React, { useEffect, useState } from 'react';

import { Button, Col, Container, Form, Row } from 'react-bootstrap';

import LikeCounter from 'sharea/component/LikeCounter';
import Media from 'sharea/component/Media';
import ShareaCard from './ShareaCard';
import ShareaList from './ShareaList';
import NewSharea from './NewSharea';
import { useUser } from 'sharea/store/user';
import PresenceCounter from 'sharea/component/Sharea/PresenceCounter';
import { capitalize, STATUS } from 'sharea/lib';
import {useSharea} from "sharea/store/sharea";


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
          <Button variant="light" onClick={onSubmit}>Submit</Button>
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

  /* User handling */

  const { currentUser, users, status, fetchSpecificUser } = useUser();
  const { update, like:likeSharea } = useSharea();
  const onLike = () => likeSharea(props.id);

  useEffect(() => {
    if (users[props.creator] === undefined) {
      fetchSpecificUser(creator);
    }
  }, []);

  if (users[props.creator] === undefined || status === STATUS.LOADING) {
    return <Loader.Centered width="100" />
  }

  /* State handling */

  const [state, setState] = useState(props);
  const isEditing = currentUser.id === props.creator;
  const { like, likes } = props;
  const { name, medias, creator } = state;

  /* Handlers */

  const onCancel = () => setState(s => ({ ...s, ...props }));
  const onChange = name => e => setState(
    s => ({ ...s, [name]: e.target.value })
  );
  const onSubmit = () => update(state);

  return (
    <main className="content sharea">
      <div className="inner-content">
        <div className="heading">
          <h1>
            {capitalize(name)}
            <LikeCounter
              size="2x"
              like={like}
              likes={likes}
              onLike={onLike}
            />
          </h1>
          <div className="sharea-page-title">
            <PresenceCounter count={2} />
          </div>
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
                  onSubmit={onSubmit}
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
Sharea.PresenceCounter = PresenceCounter;

export default Sharea;
