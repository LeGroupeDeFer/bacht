import React, { useEffect, useState } from 'react';

import { unwrapResult } from '@reduxjs/toolkit';
import { useHistory } from 'react-router-dom';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import Loader from 'sharea/component/Loader';
import { prevent } from 'sharea/lib';
import { useSharea } from 'sharea/store/sharea';
import Error from "sharea/component/Error";


function NewSharea() {

  const history = useHistory();
  const [state, setState] = useState({ name: '', description: '' });
  const [submission, setSubmission] = useState(null);
  const [error, setError] = useState(null);
  const { create } = useSharea();

  useEffect(() => {
    if (!submission)
      return;
    let isSubscribed = true;

    submission
      .then(unwrapResult)
      .then(({ id }) => isSubscribed && history.push(`/sharea/${id}`))
      .catch(error => isSubscribed && setError(error));

    return () => isSubscribed = false;
  }, [submission]);

  const onChange = name => e => setState(
    s => ({ ...s, [name]: e.target.value })
  );

  const onSubmit = _ => {
    setSubmission(create(state));
  };

  if (submission && !error)
    return <Loader.Centered width="100" />;

  return (
    <main className="content">
      <div className="inner-content">

        <Card className="sharea-creation-card"><Card.Body><Container fluid>
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

              <Row><Col className="text-center">
                <Error error={error} />
              </Col></Row>

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
      </div>
    </main>
  );

}

export default NewSharea;
