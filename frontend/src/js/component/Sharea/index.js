import React, { useEffect, useState } from 'react';

import {
  Button, Card, CardDeck, Col, Container, Form, ListGroup, ListGroupItem, OverlayTrigger, Popover,
  Row
} from 'react-bootstrap';

import { capitalize, prevent, STATUS } from 'sharea/lib';
import LikeCounter from 'sharea/component/LikeCounter';
import AuthorEdit from 'sharea/component/AuthorEdit';
import Media from 'sharea/component/Media';

import ShareaCard from './ShareaCard';
import ShareaList from './ShareaList';
import NewSharea from './NewSharea';
import { useMedia } from 'sharea/store/media';
import Error from 'sharea/component/Error';


function LazyMedia({id}) {
  const { state, medias, error, fetchMedia } = useMedia();

  useEffect(() => {
    if (medias[id] === undefined) {
      fetchMedia(id);
    }
  }, []);

  if(state === STATUS.FAILED) {
    return <Card><Error error={error}/></Card>
  }

  if (medias[id] === undefined) {
    return <Card><Media.Loading /></Card>
  }

  return <Media {...medias[id]} />
}

function MediaList({ medias, ...props }) {
  return <CardDeck>
    {medias.map(mediaId => <LazyMedia id={mediaId} key={mediaId} />)}
  </CardDeck>
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
              <MediaList medias={medias}/>

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
