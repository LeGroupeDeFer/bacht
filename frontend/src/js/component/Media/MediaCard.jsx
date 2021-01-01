import React, { useState } from 'react';

import { Card, Form } from 'react-bootstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'

import { connectMedia } from 'sharea/store/media';
import {faArrowUp, faPlusSquare} from '@fortawesome/free-solid-svg-icons';
import { Link, useHistory } from 'react-router-dom';

import { prevent } from 'sharea/lib';
import LikeCounter from 'sharea/component/LikeCounter';
import AuthorEdit from 'sharea/component/AuthorEdit';
import LoadingMedia from './LoadingMedia';
import LazyMedia from './LazyMedia';
import MediaList from './MediaList';


function MediaCardNew(_) {

  const [show, setShow] = useState(false);

  const history = useHistory();
  const onClick = _ => history.push('/sharea/new');

  return (
    <Card className="sharea-card sharea-card-new" onClick={onClick}>
      <Card.Body>
        <Card.Title>
          New Sharea
        </Card.Title>
        <Icon
          icon={faPlusSquare}
          size="4x"
          className="d-block mx-auto mt-3"
        />
      </Card.Body>
    </Card>
  );

}

function MediaCard({
  isNew, id, name, content, shareaId, author, likes, like
}) {

  if (isNew) return <MediaCardNew />;

  const [isEditing, setIsEditing] = useState(false);

  // `specificView` should be set to `true` if the media is the only thing displayed
  // `specificView` should be set to `false` if the media is displayed alongside with other media of the same Sharea
  const specificView = false; // todo : get the information of the view elsewhere

  const [state, setState] = useState({
    name: name,
    content: content
  });

  const reset = () => {
    setState(s => ({
      ...s,
      ['name']: name,
      ['content']: content
    }));
  }

  const manageCancel = () => {
    reset();
    setIsEditing(false);
  }

  const onChange = name => e => setState(
    s => ({...s, [name]: e.target.value})
  );

  const onSubmit = () => {
    // props.updateMedia(state);
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
          {specificView ? (<div><Link to={`/sharea/${shareaId}`}><Icon icon={faArrowUp} /></Link></div>) : (<></>)}
        </Card.Header>
        <Card.Body>
            <Form.Group controlId="content">
              <Form.Control
                plaintext={!isEditing}
                readOnly={!isEditing}
                type="textarea"
                value={state['content']}
                onChange={onChange('content')}
              />
            </Form.Group>
        </Card.Body>
        <Card.Footer className="flex-container">
          <AuthorEdit
            author={author}
            isEditing={isEditing}
            editCallback={() => setIsEditing(true)}
            cancelCallback={manageCancel}
          />
          <LikeCounter like={like} likes={likes} url={`/api/media/${id}/medialike`} />
        </Card.Footer>
      </Form>
    </Card>
  );
}

MediaCard.Loading = LoadingMedia;
MediaCard.Lazy = LazyMedia;
MediaCard.List = MediaList;


export default connectMedia(MediaCard);
