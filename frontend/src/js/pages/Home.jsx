import React, {useEffect} from 'react';

import TabNav from 'sharea/component/layout/TabNav';
import Sharea from 'sharea/component/Sharea';
import { connectUser } from 'sharea/store/user';
import { capitalize } from 'sharea/lib';


const links = [
  {
    uri: '/dashboard',
    title: 'Recent',
  },
  {
    uri: '/dashboard/own',
    title: 'Your Shareas',
  },
  {
    uri: '/dashboard/friends',
    title: 'Friends Shareas',
  },
];

const shareas = [
  {
    name: "Cat Species",
    description: "Presentation of the different cat species that are visible in Belgium",
    creatorId: 1001,
    id: 9001,
  },
  {
    name: "INFOM451",
    description: "Sharea used by Prof. Jacquet to show useful resources and exchange information with students",
    creatorId: 1002,
    id: 9002,
  },
  {
    name: "Brainstorming",
    description: "Sharea for an enterprise that makes a brainstorming before developing a new software",
    creatorId: 1003,
    id: 9003,
  },
];

const users = [
  {
    id: 1001,
    username: "Fouiny",
    isLiked: "True",
    likedBy: 12,
  },
  {
    id: 1002,
    username: "Batman",
    isLiked: "False",
    likedBy: 1,
  },
  {
    id: 1003,
    username: "JCVD",
    isLiked: "True",
    likedBy: 153,
  }
]

// Home :: None => Component
function Home({ currentUser, status }) {

  if (status === 'loading')
    return <>Loading...</>;

  return (
    <main className="content">
      <div className="inner-content">
        <div className="heading">
          <h1>Hi, {capitalize(currentUser.username)}</h1>
          <TabNav links={links} default="/dashboard"/>
        </div>
        <Sharea.List shareas={shareas} />
      </div>
    </main>
  );

}


export default connectUser(Home);
