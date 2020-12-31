import React, { useState } from 'react';

import {
  Button, CardDeck, Col, Form, ListGroup, ListGroupItem, OverlayTrigger, Popover,
  Row
} from 'react-bootstrap';

import { capitalize, prevent } from 'sharea/lib';
import LikeCounter from 'sharea/component/LikeCounter';
import AuthorEdit from 'sharea/component/AuthorEdit';
import Media from 'sharea/component/Media';

import ShareaCard from './ShareaCard';
import ShareaList from './ShareaList';


function Sharea({ id, name, description, medias, ...props }) {

  const isNew = id === 'new';
  // todo : if is new, redirect elsewhere !!!

  const defaultValues = { name, description };


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
      <Form
        method="PUT"
        action={`/api/sharea/${id}`}
        className={`sharea ${isEditing ? 'sharea-edit' : ''}`}
        onSubmit={prevent(onSubmission)}>
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
                : capitalize(name)
            }
            </h1>
            <LikeCounter like={props.like} likes={props.likes} url={`/api/sharea/${id}/sharealike`} />
            <AuthorEdit
              author={{ id: 12, username: 'darwin' }}
              isEditing
              editCallback={() => setIsEditing(true)}
              cancelCallback={manageCancel}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={10}>
            <CardDeck>
              {/* todo : get real author*/}
              {medias.map(m =>
                <Media
                  key={m.id}
                  id={m.id}
                  author={m.author}
                  name={m.name}
                  kind={m.kind}
                  content={m.content}
                  like={m.like}
                  likes={m.likes}
                  parentId={id}
                />)}
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
              isEditing
              ? (<Form.Control
              type="textarea"
              value={state['description']}
              onChange={onChange('description')}
            />)
              : description
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );

}

Sharea.Card = ShareaCard;
Sharea.List = ShareaList;


export default Sharea;
