import {capitalize} from 'sharea/lib';
import TabNav from 'sharea/component/layout/TabNav';
import React, {useState} from 'react';
import LikeCounter from 'sharea/component/LikeCounter';
import AuthorEdit from 'sharea/component/AuthorEdit';
import {Button, CardDeck, Col, ListGroup, ListGroupItem, OverlayTrigger, Popover, Row} from 'react-bootstrap';
import Media from 'sharea/component/Media';


function ShareaWall({id, name, description, medias, ...props}) {

  const [isEditing, setIsEditing] = useState(false)

  const manageCancel = () => {
    console.log('canceled');
    setIsEditing(false);
  }

  const manageSubmit = () => {
    console.log('submitted');
    setIsEditing(false);
  }

  return (
    <div className="heading">
      <Row>
        <Col>
          <h1>Sharea {capitalize(name)}</h1>
          <LikeCounter like={props.like} likes={props.likes} url={`/api/sharea/${id}/sharealike`} />
          <AuthorEdit
            author={{id: 12, username: 'darwin'}}
            isEditing
            editCallback={() => setIsEditing(true)}
            cancelCallback={manageCancel}
            submitCallback={manageSubmit}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={10}>
          <CardDeck>
            {medias.map(m =>
              <Media
                key={m.id}
                id={m.id}
                {/* todo : get real author*/}
                author={m.author}
                name={m.name}
                kind={m.kind}
                content={m.content}
                like={m.like}
                likes={m.likes}
                parentId={m.shareaId}
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
                    {['text', 'image'].map(kind => <ListGroupItem key={kind}><Button >{kind}</></ListGroupItem>)}
                  </ListGroup>
                </Popover.Content>
              </Popover>
            }
          >
            <Button>New media</Button>
          </OverlayTrigger>
        </Col>
        <Col sm={2}>
          <div>{description}</div>
        </Col>
      </Row>

    </div>
  )
}