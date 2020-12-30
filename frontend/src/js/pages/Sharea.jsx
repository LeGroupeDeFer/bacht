import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { selectSharea } from 'sharea/store/sharea';


function Sharea({ get }) {
  const { params: { id } } = useRouteMatch();
  const sharea = selectSharea(id);
  return <>{sharea.name}</>;
}


export default Sharea;
