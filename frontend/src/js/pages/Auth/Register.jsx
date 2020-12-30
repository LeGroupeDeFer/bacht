import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Col, Form } from 'react-bootstrap';

import { useAuth } from 'sharea/store/app';
import { prevent } from 'sharea/lib';
import Error from 'sharea/component/Error';


function Register(_) {

  const { authenticated, failure, register } = useAuth();
  const history = useHistory();
  const [state, setState] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    biopic: ''
  });
  const [valid, setValid] = useState(false);

  useEffect(() => authenticated && history.replace('/dashboard'), []);
  useEffect(
    () => status === 'registered'
      ? history.push('/auth/login')
      : undefined,
    [status]
  );
  useEffect(() => setValid(
    state.username.length >= 3 && state.password.length >= 3
    && state.firstName.length >= 3 && state.lastName.length >= 3
  ), [state]);

  const onChange = name => e => setState(
    s => ({...s, [name]: e.target.value})
  );
  const onSubmit = _ => register(state);

  return (
    <div className="register-form">

      <Form
        method="POST"
        action="/api/auth/register"
        onSubmit={prevent(onSubmit)}
      >

        <Form.Row>
          <Form.Group controlId="username" as={Col} sm={6}>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your username"
              value={state.username}
              onChange={onChange('username')}
            />
          </Form.Group>
          <Form.Group controlId="password" as={Col} sm={6}>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Your password"
              value={state.password}
              onChange={onChange('password')}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group controlId="firstName" as={Col} sm={6}>
            <Form.Label>First name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your firstname"
              value={state.firstName}
              onChange={onChange('firstName')}
            />
          </Form.Group>
          <Form.Group controlId="lastName" as={Col} sm={6}>
            <Form.Label>Last name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your lastname"
              value={state.lastName}
              onChange={onChange('lastName')}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group controlId="biopic" as={Col}>
            <Form.Label>About you</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              placeholder="Who are you, what are your interests?"
              value={state.biopic}
              onChange={onChange('biopic')}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Col>
            <Button type="submit" disabled={!valid}>Register</Button>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col><Error error={failure} variant="light" /></Col>
        </Form.Row>

        <hr />
      </Form>

    </div>
  );

}


export default Register;
