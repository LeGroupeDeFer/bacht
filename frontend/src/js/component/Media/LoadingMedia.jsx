import React from 'react';
import { Card } from 'react-bootstrap';
import Loader from 'sharea/component/Loader'

function LoadingMedia({...props}) {
  return <Card>
    <div>
      <Loader.Centered width="100"/>
    </div>
  </Card>
}

export default LoadingMedia;