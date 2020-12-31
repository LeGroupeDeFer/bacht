import React, { useState } from 'react';

import { Button, Col, Container, Form, Row, Card } from 'react-bootstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faEdit, faInfoCircle } from '@fortawesome/free-solid-svg-icons'

import { prevent } from 'sharea/lib';


function EditionActions({ isEditing, onEdit, onCancel }) {

  if (isEditing)
    return (
      <>
        <Button
          variant="outline-primary"
          className="ml-auto"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          className="ml-3"
        >
          Submit
        </Button>
      </>
    );
  return (
    <Button onClick={onEdit} className="ml-auto">
      <Icon icon={faEdit} className="mr-2" />
      Update
    </Button>
  );

}

function ProfileInfo({ editable, onUpdate, ...user }) {

  const [state, setState] = useState(user);
  const [isEditing, setIsEditing] = useState(false);

  const reset     = () => setState(s => ({ ...s, ...user }));
  const onEdit    = _  => setIsEditing(true);
  const onCancel  = _  => reset() || setIsEditing(false);
  const onChange  = name => e => setState(
    s => ({ ...s, [name]: e.target.value })
  );
  const onSubmit = _ => {
    setIsEditing(false); // todo : check if rerender do not erase this
    onUpdate(state);
  };

  return (
    <Card className="profile-card"><Card.Body><Container fluid>
      <Row><Col>

        <Form
          method="PUT"
          action={`/api/user/${user.id}`}
          onSubmit={prevent(onSubmit)}
          className={`profile ${editable ? 'profile-edit' : ''}`}
        >

          <Row><Col>
            <h2 className="mb-3">
              <Icon icon={faInfoCircle} className="mr-3" />
              General information
            </h2>
            <hr />
          </Col></Row>

          <Form.Group as={Row} controlId="username">
            <Form.Label column sm={2}>Username</Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                value={state['username']}
                readOnly={!isEditing}
                plaintext={!isEditing}
                onChange={onChange('username')}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="firstName">
            <Form.Label column sm={2}>First name</Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                value={state['firstName']}
                readOnly={!isEditing}
                plaintext={!isEditing}
                onChange={onChange('firstName')}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="lastName">
            <Form.Label column sm={2}>Last name</Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                value={state['lastName']}
                readOnly={!isEditing}
                plaintext={!isEditing}
                onChange={onChange('lastName')}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="biopic">
            <Form.Label column sm={2}>{`About ${state['username']}`}</Form.Label>
            <Col sm={10}>
              <Form.Control
                as="textarea"
                rows={6}
                value={state['biopic']}
                readOnly={!isEditing}
                plaintext={!isEditing}
                onChange={onChange('biopic')}
              />
            </Col>
          </Form.Group>

          <Row><Col><hr /></Col></Row>

          <Form.Row>
            <Col className="d-flex flex-row">
              <EditionActions
                isEditing={isEditing}
                onEdit={onEdit}
                onCancel={onCancel}
              />
            </Col>
          </Form.Row>

        </Form>

      </Col></Row>
    </Container></Card.Body></Card>
  );

}


export default ProfileInfo;
