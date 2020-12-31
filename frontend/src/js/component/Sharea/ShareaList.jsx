import React from "react";

import ShareaCard from './ShareaCard';


function ShareaList({ shareas }) {

  return (
    <div className="sharea-list">
      {shareas.map(sharea => (
        <ShareaCard
          key={sharea.id}
          {...sharea}
        />
      ))}
      {Array(5).fill(0).map(_ => (
        <div className="sharea-card-phantom" />
      ))}
    </div>
  );

}


export default ShareaList;
