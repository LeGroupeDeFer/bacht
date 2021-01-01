import React, { useState } from 'react';

import { Button, Card, Modal } from 'react-bootstrap';
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";

import LazyMedia from './LazyMedia';


function NewMedia({}) {

  const [show, setShow] = useState(false);
  const onOpen = () => setShow(true);
  const onClose = () => setShow(false);

  return (
    <>
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New media</Modal.Title>
        </Modal.Header>

        <Modal.Body>Woohoo, you're creating a new media!</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Discard
          </Button>
          <Button variant="primary" onClick={onClose}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Card className="sharea-card sharea-card-new" onClick={onOpen}>
        <Card.Body>
          <Card.Title>
            New Media
          </Card.Title>
          <Icon
            icon={faPlusSquare}
            size="4x"
            className="d-block mx-auto mt-3"
          />
        </Card.Body>
      </Card>

    </>
  );

}


function MediaList({ medias }) {

  return (
    <div className="media-list">
      <NewMedia />
      {medias.map(id => (
        <LazyMedia key={id} id={id} />
      ))}
    </div>
  );

}


export default MediaList;
