import React, { useState } from 'react';
import { prevent } from 'sharea/lib';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';


function NewSharea() {
  const [state, setState] = useState({ name: '', description: '' });

  const onChange = name => e => setState(
    s => ({ ...s, [name]: e.target.value })
  );

  const onSubmit = _ => {
    console.log('submitted ! ');
    // todo : link this with backend
    // onUpdate(state);
  };

  return <Card className="profile-card"><Card.Body><Container fluid>
    <Row><Col>

      <Form
        method="POST"
        action="/api/sharea/"
        onSubmit={prevent(onSubmit)}
        className="sharea sharea-edit"
      >

        <Row><Col>
          <h2 className="mb-3">
            <Icon icon={faInfoCircle} className="mr-3" />
            New Sharea
          </h2>
          <hr />
        </Col></Row>

        <Form.Group as={Row} controlId="name">
          <Form.Label column sm={2}>Name</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              value={state['name']}
              onChange={onChange('name')}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="description">
          <Form.Label column sm={2}>Description</Form.Label>
          <Col sm={10}>
            <Form.Control
              as="textarea"
              rows={6}
              value={state['description']}
              onChange={onChange('description')}
            />
          </Col>
        </Form.Group>

        <Row><Col>
          <hr />
        </Col></Row>

        <Form.Row>
          <Col className="d-flex flex-row">
            <Button
              variant="primary"
              type="submit"
              className="ml-3"
            >
              Submit
            </Button>
          </Col>
        </Form.Row>

      </Form>

    </Col></Row>
  </Container></Card.Body></Card>
}

export default NewSharea;