import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

import { connectAuth } from 'sharea/store/auth';
import { prevent } from 'sharea/lib';
import Error from 'sharea/component/Error';


function Register({ error, inSession, register, request, status }) {

  const history = useHistory();
  const [state, setState] = useState({
    username: '',
    password: ''
  });

  useEffect(() => inSession && history.push('/'), []);
  useEffect(
    () => request === 'register' && status === 'succeeded'
      ? history.push('/auth/login')
      : undefined,
    [status]
  );

  const onChange = name => e => setState(
    s => ({ ...s, [name]: e.target.value })
  );
  const onSubmit = _ => register(state);

  return (
    <div className="register-form">

      <Form
        method="POST"
        action="/api/auth/register"
        onSubmit={prevent(onSubmit)}
      >

        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Aa"
            value={state.username}
            onChange={onChange('username')}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Bb"
            value={state.password}
            onChange={onChange('password')}
          />
        </Form.Group>

        <Button type="submit">Register</Button>
        <Error error={error} variant="light" />

        <hr />
      </Form>

    </div>
  );

}


export default connectAuth(Register);
