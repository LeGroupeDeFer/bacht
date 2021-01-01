import React from "react";

import { Link } from 'react-router-dom';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faBinoculars } from '@fortawesome/free-solid-svg-icons';

import ShareaCard from './ShareaCard';

function ShareaList({ shareas, newSharea }) {

  if (shareas.length === 0 && !newSharea)
    return (
      <div className="d-relative">
        <div className="abs-center text-center">
          <div>
            <Icon icon={faBinoculars} size="8x" />
          </div>
          <h3 className="text-muted">Nothing to see here.</h3>
          <p>Head to the <Link to={'/discover'}>discovery page</Link> to find new exciting shareas!</p>
        </div>
      </div>
    );

  return (
    <div className="sharea-list">
      {newSharea && <ShareaCard isNew />}
      {shareas.map(sharea => (
        <ShareaCard
          key={sharea.id}
          {...sharea}
        />
      ))}
      {Array(5).fill(0).map((_, index) => (
        <div key={index} className="sharea-card-phantom" />
      ))}
    </div>
  );

}


export default ShareaList;
