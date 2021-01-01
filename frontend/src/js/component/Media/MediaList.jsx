import React, {useEffect, useState} from 'react';

import { Button, Card, Modal, Form, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";

import LazyMedia from './LazyMedia';
import { useMedia } from 'sharea/store/media';
import {prevent, trace} from 'sharea/lib';


const emptyMedia = shareaId => ({
  shareaId,
  name: '',
  kind: 'text',
  content: '',
});


const readFile = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onError = error => reject(error)
});


function NewMedia({ shareaId }) {

  const { postMedia } = useMedia();
  const [promise, setPromise] = useState(null);
  const [show, setShow] = useState(false);
  const [state, setState] = useState(emptyMedia(shareaId));

  useEffect(() => {
    if (!promise)
      return;
    let isSubscribed = true;

    promise.then(_ => {
      if (isSubscribed) {
        setState(emptyMedia(shareaId));
        setPromise(null);
        setShow(false);
      }
    });

    return () => isSubscribed = false;
  }, [promise]);

  const onOpen = () => setShow(true);
  const onClose = () => setShow(false);
  const onChange = name => event =>
    setState(s => ({ ...s, [name]: event.target.value }));
  const onKindChange = event => setState(s => ({
    ...s,
    content: '',
    kind: event.target.value
  }));
  const onFileChange = e =>
    setState(s => ({ ...s, content: e.target.files[0] }))
  const onSubmit = _ => {
    if (state.kind === 'image')
      setPromise(readFile(state.content)
        .then(content => postMedia({ ...state, content }))
      );
    else
      setPromise(postMedia({ ...state, content: btoa(state.content) }));
  }

  return (
    <>
      <Modal show={show} onHide={onClose} centered>
        <Form
          action="/api/media"
          method="POST"
          onSubmit={prevent(onSubmit)}
        >
          <Modal.Header closeButton>
            <Modal.Title>New media</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group controlId="name" as={Row}>
              <Form.Label column>Name</Form.Label>
              <Col md={9}>
                <Form.Control
                  type="text"
                  value={state.name}
                  onChange={onChange('name')}
                />
              </Col>
            </Form.Group>
            <Form.Group controlId="name" as={Row}>
              <Form.Label column>Type</Form.Label>
              <Col md={9}>
                <Form.Control
                  as="select"
                  value={state.kind}
                  onChange={onKindChange}
                >
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                </Form.Control>
              </Col>
            </Form.Group>

            {state.kind === 'image' && (
              <Form.File
                id="content"
                label={state.content && "File selected!" || "Select a file"}
                onChange={onFileChange}
                custom
              />
            )}

            {state.kind === 'text' && (
              <Form.Control
                as="textarea"
                rows={6}
                value={state.content}
                onChange={onChange('content')}
              />
            )}

          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
              Discard
            </Button>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </Modal.Footer>
        </Form>
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


function MediaList({ medias, shareaId }) {

  return (
    <div className="media-list">
      <NewMedia shareaId={shareaId} />
      {medias.map(id => (
        <LazyMedia key={id} id={id} />
      ))}
      {Array(5).fill(0).map((_, index) => (
        <div key={index} className="media-card-phantom" />
      ))}
    </div>
  );

}


export default MediaList;
