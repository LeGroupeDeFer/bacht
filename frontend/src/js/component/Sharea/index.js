import React, { useState } from 'react';

import {
  Button, CardDeck, Col, Container, Form, ListGroup, ListGroupItem, OverlayTrigger, Popover,
  Row
} from 'react-bootstrap';

import { capitalize, prevent } from 'sharea/lib';
import LikeCounter from 'sharea/component/LikeCounter';
import AuthorEdit from 'sharea/component/AuthorEdit';
import Media from 'sharea/component/Media';

import ShareaCard from './ShareaCard';
import ShareaList from './ShareaList';
import NewSharea from './NewSharea';

const tmp_sharea = {
  name: 'Cat Species',
  description: 'Presentation of the different cat species that are visible in Belgium',
  creator: 2,
  id: 9001,
  medias: [
    10,
    11,
    12,
    13
  ],
  like: false,
  likes: 12
};

const tmp_medias = {
  10: {
    'id': 10,
    'name': 'test',
    'kind': 'text',
    'content': '[B@281adda8',
    'author': 1,
    'shareaId': 8,
    'like': false,
    'likes': 0
  },
  11: {
    'id': 11,
    'name': 'test2',
    'kind': 'text',
    'content': '[B@281adda8',
    'author': 1,
    'shareaId': 8,
    'like': false,
    'likes': 0
  },
  12: {
    'id': 12,
    'name': 'test3',
    'kind': 'text',
    'content': '[B@281adda8',
    'author': 1,
    'shareaId': 8,
    'like': false,
    'likes': 0
  },
  13: {
    'id': 13,
    'name': 'test4',
    'kind': 'text',
    'content': '[B@281adda8',
    'author': 1,
    'shareaId': 8,
    'like': false,
    'likes': 0
  }
}


function ShareaTitle({ id, name, like, likes }) {

  return (
    <h1>
      {capitalize(name)}
      <LikeCounter
        size="2x"
        like={like}
        likes={likes}
        url={`/api/sharea/${id}/sharealike`}
      />
    </h1>
  );

}


function Sharea(props) {

  const [state, setState] = useState(props);
  const [isEditing, setIsEditing] = useState(false);

  const { id, name, description, medias, like, likes, creator } = state;
  const author = { id: creator, username: 'darwin' };

  const reset = () => setState(s => ({ ...s, ...props }));
  const onChange = name => e => setState(
    s => ({ ...s, [name]: e.target.value })
  );
  const onCancel = () => {
    reset();
    setIsEditing(false);
  };
  const onLike = like => {
    console.log(like);
  };
  const onSubmission = () => {
    // todo : contact backend to create/update sharea
    console.log('submitted');
    setIsEditing(false);
  };

  return (
    <main className="content sharea">
      <div className="inner-content">
        <div className="heading">
          <ShareaTitle
            id={id}
            name={name}
            isEditing={isEditing}
            onChange={onChange('name')}
            like={like}
            likes={likes}
            onLike={onLike}
          />
          <div className="edition-action">
            <AuthorEdit
              author={author}
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onCancel={onCancel}
              onSubmit={onSubmission}
            />
          </div>
        </div>

        <Container
          fluid
          className={`sharea${isEditing ? ' sharea-edit' : ''}`}
        >
          <Row>
            <Col sm={10}>
              <CardDeck>
                {tmp_sharea.medias.map(mediaId => (
                  <Media
                    key={mediaId}
                    {...tmp_medias[mediaId]}
                     author={author}
                  />
                ))}
              </CardDeck>

              <OverlayTrigger
                trigger="click"
                placement="top"
                overlay={
                  <Popover id={`popover-positioned-top`}>
                    <Popover.Title as="h3">New media's type</Popover.Title>
                    <Popover.Content>
                      <ListGroup>
                        {/* todo : button idea is to create a new media in this sharea*/}
                        {['text', 'image'].map(kind => (
                          <ListGroupItem key={kind}><Button>{kind}</Button></ListGroupItem>
                        ))}
                      </ListGroup>
                    </Popover.Content>
                  </Popover>
                }
              >
                <Button>New media</Button>
              </OverlayTrigger>
            </Col>
            <Col sm={2}>
              <div>
                {
                  isEditing
                    ? (<Form.Control
                      type="textarea"
                      value={state['description']}
                      onChange={onChange('description')}
                    />)
                    : description
                }
              </div>
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


export default Sharea;
