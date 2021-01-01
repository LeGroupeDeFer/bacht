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

function Sharea({ id, name, description, medias, like, likes, ...props }) {
  const author = { id: tmp_sharea.creator, username: 'darwin' };
  const defaultValues = { name: tmp_sharea.name, description: tmp_sharea.description };

  const [isEditing, setIsEditing] = useState(false);
  const [state, setState] = useState(defaultValues);

  const reset = () => setState(s => ({ ...s, ...defaultValues }));
  const onChange = name => e => setState(
    s => ({ ...s, [name]: e.target.value })
  );

  const manageCancel = () => {
    reset();
    setIsEditing(false);
  }

  const onSubmission = () => {
    // todo : contact backend to create/update sharea
    console.log('submitted');
    setIsEditing(false);
  }


  return (
    <div className="heading">
      <Container
        fluid
        className={`sharea ${isEditing ? 'sharea-edit' : ''}`}
        >
        <Row>
          <Col>
            <h1>
              Sharea {
              isEditing
                ? (<Form.Control
                  type="text"
                  value={state['name']}
                  onChange={onChange('name')}
                />)
                : capitalize(tmp_sharea.name)
            }
            </h1>
            <LikeCounter like={tmp_sharea.like} likes={tmp_sharea.likes}
                         url={`/api/sharea/${tmp_sharea.id}/sharealike`} />
            <AuthorEdit
              author={author}
              isEditing={isEditing}
              editCallback={() => setIsEditing(true)}
              cancelCallback={manageCancel}
              submitCallback={onSubmission}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={10}>
            <CardDeck>
              {tmp_sharea.medias.map(mediaId => (<Media
                key={mediaId}
                {...tmp_medias[mediaId]}
                 author={author}
              />))
              }
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
  );

}

Sharea.Card = ShareaCard;
Sharea.List = ShareaList;


export default Sharea;
