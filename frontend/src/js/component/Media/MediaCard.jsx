import React, { useEffect, useState } from 'react';

import { Card } from 'react-bootstrap';
import { connectMedia } from 'sharea/store/media';
import { Link } from 'react-router-dom';

import { STATUS } from 'sharea/lib';

import LoadingMedia from './LoadingMedia';
import LazyMedia from './LazyMedia';
import MediaList from './MediaList';
import { useUser } from 'sharea/store/user';
import Loader from 'sharea/component/Loader';

function MediaCard({ name, kind, content, author}) {

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
