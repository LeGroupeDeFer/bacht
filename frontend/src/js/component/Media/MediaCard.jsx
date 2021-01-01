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
  isNew, id, name, kind, content, shareaId, author, likes, like
}) {

  if (isNew) return <MediaCardNew />;

  // `specificView` should be set to `true` if the media is the only thing displayed
  // `specificView` should be set to `false` if the media is displayed alongside with other media of the same Sharea
  const specificView = false; // todo : get the information of the view elsewhere

  let parsedContent;
  if (kind === 'text')
    parsedContent = atob(content);
  else
    parsedContent = <img src={content} />;

  return (
    <Card border="primary" className="media-card">
      <Card.Header className="d-flex">
        <h5>{name}</h5>
        {
          specificView ? (
            <div><Link to={`/sharea/${shareaId}`}>
              <Icon icon={faArrowUp} />
            </Link></div>
          ) : <></>
        }
      </Card.Header>

      <Card.Body>{parsedContent}</Card.Body>

      <Card.Footer className="flex-container">
        @<Link to={`/profile/${author}`}>Author</Link>
      </Card.Footer>
    </Card>
  );
}

MediaCard.Loading = LoadingMedia;
MediaCard.Lazy = LazyMedia;
MediaCard.List = MediaList;


export default connectMedia(MediaCard);
