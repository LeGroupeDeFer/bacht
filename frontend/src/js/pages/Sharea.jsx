import React, {useEffect} from 'react';

import { useRouteMatch } from 'react-router-dom';

import Sharea from 'sharea/component/Sharea';
import { useSharea } from 'sharea/store/sharea';


function ShareaPage() {

  const match = useRouteMatch();
  const seeked = match.params.id;
  const { map } = useSharea();

  if (seeked === 'new')
    return <Sharea.Form />;

  const id = parseInt(seeked);
  if (map[id] === undefined)
    throw new Error('Unknown Sharea');

  return <Sharea {...map[id]} />;

}


export default ShareaPage;
