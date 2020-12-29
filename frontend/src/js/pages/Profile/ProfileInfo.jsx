import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import React, {useState} from 'react';
import {FontAwesomeIcon as Icon} from '@fortawesome/react-fontawesome';
import {faEdit} from '@fortawesome/free-solid-svg-icons'
import {prevent} from 'sharea/lib';

function ProfileInfo(props) {
  const [isEditing, setIsEditing] = useState(false);

  const [state, setState] = useState({
    userName: props.user.userName,
    firstName: props.user.firstName,
    lastName: props.user.lastName,
    biopic: props.user.biopic
  });

  const reset = () => {
    setState(s => ({ ...s,
      ['userName']: props.user.userName,
      ['firstName']: props.user.firstName,
      ['lastName']: props.user.lastName,
      ['biopic']: props.user.biopic
    }));
  }

  const onChange = name => e => setState(
    s => ({...s, [name]: e.target.value})
  );

  const onSubmit = _ => {
    props.updateProfile(state);
    setIsEditing(false);
  }

  return <Container> <Form
    method="POST"
    action="/api/auth/register"
    onSubmit={prevent(onSubmit)}
  >

    <Form.Group as={Row} controlId="userName">
      <Form.Label column sm={2}>Username</Form.Label>
      <Col sm={10}>
        <Form.Control
          type="text"
          value={state['userName']}
          readOnly={!isEditing}
          plaintext={!isEditing}
          onChange={onChange('userName')}
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
      <Form.Label column sm={2}>{`About ${state['userName']}`}</Form.Label>
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

    <Form.Row>
      <Col>
        {!isEditing
          ? <Button onClick={() => setIsEditing(true)}>Update <Icon icon={faEdit} /></Button>
          : <><Button onClick={() => {reset(); setIsEditing(false);}}>Cancel</Button><Button type="submit">Submit</Button></>
        }

      </Col>
    </Form.Row>
  </Form></Container>
}

export default ProfileInfo;