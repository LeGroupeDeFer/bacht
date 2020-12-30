import React, {useState} from 'react';

import {connectMedia} from '../store/media';
import {Button, Card, Form} from 'react-bootstrap';
import {FontAwesomeIcon as Icon} from '@fortawesome/react-fontawesome'
import {faArrowUp, faEdit} from '@fortawesome/free-solid-svg-icons';
import {Link} from 'react-router-dom';
import {prevent} from 'sharea/lib';
import LikeCounter from 'sharea/component/LikeCounter';
import AuthorEdit from 'sharea/component/AuthorEdit';


function Media({id, name, content, parentId, author, likes, like, ...props}) {
  const [isEditing, setIsEditing] = useState(false);
  const authorName = 'john'; // todo : fetch the author name
  // `specificView` should be set to `true` if the media is the only thing displayed
  // `specificView` should be set to `false` if the media is displayed alongside with other media of the same Sharea
  const specificView = true; // todo : get the information of the view elsewhere

  const [state, setState] = useState({
    name: name,
    content: content
  });

  setState(s => ({
    ...s,
    ['name']: name,
    ['content']: content
  }));
  const reset = () => {
  }

  const manageCancel = () => {
    reset();
    setIsEditing(false);
  }

  const onChange = name => e => setState(
    s => ({...s, [name]: e.target.value})
  );

  const onSubmit = () => {
    props.updateMedia(state);
    setIsEditing(false);
  }

  return (
    <Card border="primary" style={{width: '18rem'}}>
      <Form
        method="PUT"
        action={`/api/media/${id}`}
        onSubmit={prevent(onSubmit)}
      >
        <Card.Header className="flex-container">
          <div>
            <Form.Group controlId="name">
              <Form.Control
                plaintext={!isEditing}
                readOnly={!isEditing}
                type="text"
                value={state['name']}
                onChange={onChange('name')}
              />
            </Form.Group>
          </div>
          {specificView ? (<div><Link to={`/sharea/${parentId}`}><Icon icon={faArrowUp} /></Link></div>) : (<></>)}
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <Form.Group controlId="content">
              <Form.Control
                plaintext={!isEditing}
                readOnly={!isEditing}
                type="textarea"
                value={state['content']}
                onChange={onChange('content')}
              />
            </Form.Group>
          </Card.Text>
        </Card.Body>
        <Card.Footer className="flex-container">
          <AuthorEdit
            author
            isEditing={isEditing}
            editCallback={() => setIsEditing(true)}
            cancelCallback={manageCancel}
            submitCallback={prevent(onSubmit)}
          />
          <LikeCounter like={like} likes={likes} url={`/api/media/${id}/medialike`} />
        </Card.Footer>
      </Form>
    </Card>
  );
}


export default connectMedia(Media);