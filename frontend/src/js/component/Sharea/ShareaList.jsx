import React from "react";

import ShareaCard from './ShareaCard';


function ShareaList({ shareas, newSharea }) {

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
