import React from 'react';
import { Card } from 'react-bootstrap';
import Loader from 'sharea/component/Loader'

function LoadingMedia({...props}) {
  return (
    <Card className="media-card media-card-loading">
      <Loader.Centered width="100"/>
    </Card>
  );
}

export default LoadingMedia;