import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

import { connectAuth } from 'sharea/store/auth';
import { prevent } from 'sharea/lib';
import Error from 'sharea/component/Error';




function Login({ error, inSession, login }) {

  const history = useHistory();
  const [state, setState] = useState({
    username: '',
    password: ''
  });
  const [valid, setValid] = useState(false);

  useEffect(() => inSession && history.push('/dashboard'), []);
  useEffect(() => setValid(
    state.username.length > 3 && state.password.length > 4
  ), [state]);

  const onChange = name => e => setState(
    s => ({ ...s, [name]: e.target.value })
  );
  const onSubmit = _ => login(state);

  return (
    <div className="login-form">

      <Form
        method="POST"
        action="/api/auth/login"
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

        <Button type="submit" disabled={!valid}>Login</Button>
        <Error error={error} variant="light" />

        <hr />

      </Form>

    </div>
  );

}


export default connectAuth(Login);
