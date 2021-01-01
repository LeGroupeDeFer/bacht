import React, { useEffect, useState } from 'react';

import { Card, Form } from 'react-bootstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'

import { connectMedia } from 'sharea/store/media';
import {faArrowUp, faPlusSquare} from '@fortawesome/free-solid-svg-icons';
import { Link, useHistory } from 'react-router-dom';

import { STATUS } from 'sharea/lib';

import LoadingMedia from './LoadingMedia';
import LazyMedia from './LazyMedia';
import MediaList from './MediaList';
import { useUser } from 'sharea/store/user';
import Loader from 'sharea/component/Loader';


function MediaCardNew(_) {

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

function MediaCard({ isNew, name, kind, content, shareaId, author}) {

  if (isNew) return <MediaCardNew />;

  const { users, status, fetchSpecificUser } = useUser();

  useEffect(() => {
    if (users[author] === undefined) {
      fetchSpecificUser(author);
    }
  }, []);

  if (users[author] === undefined || status === STATUS.LOADING) {
    return <Loader.Centered width="100" />
  }

  let parsedContent;
  if (kind === 'text')
    parsedContent = atob(content);
  else
    parsedContent = <img src={content} />;

  return (
    <Card border="primary" className="media-card">
      <Card.Header className="d-flex">
        <h5>{name}</h5>
      </Card.Header>

      <Card.Body>{parsedContent}</Card.Body>

      <Card.Footer className="flex-container">
        @<Link to={`/profile/${author}`}>{users[author].username}</Link>
      </Card.Footer>
    </Card>
  );
}

MediaCard.Loading = LoadingMedia;
MediaCard.Lazy = LazyMedia;
MediaCard.List = MediaList;


export default connectMedia(MediaCard);
