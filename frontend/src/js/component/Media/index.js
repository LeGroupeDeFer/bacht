import React from 'react';

import LazyMedia from './LazyMedia';
import LoadingMedia from './LoadingMedia';
import MediaCard from './MediaCard';
import MediaList from './MediaList';


function Media({}) {
  return <></>;
}


Media.Card = MediaCard;
Media.Lazy = LazyMedia;
Media.List = MediaList;
Media.Loading = LoadingMedia;


export default Media;
