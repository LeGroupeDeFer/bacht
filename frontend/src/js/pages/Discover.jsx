import React from 'react';
import ShareaList from 'sharea/component/Sharea/ShareaList';
import { useSharea } from 'sharea/store/sharea';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faBinoculars } from '@fortawesome/free-solid-svg-icons';


function Discover(_) {

  const { all: shareas } = useSharea();
  const sorted = [...shareas].sort((a, b) => (a.likes < b.likes) ? 1 : -1).slice(0, 50);
  return (
    <main className="content">
      <div className="heading">
        <h1>
          <Icon icon={faBinoculars} className="mr-3" />
          Discover
        </h1>
      </div>
      <ShareaList shareas={sorted} />
    </main>
  );

}


export default Discover;
