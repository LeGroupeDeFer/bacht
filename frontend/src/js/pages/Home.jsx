import React from 'react';

import { NavLink } from 'react-router-dom'

import { useAuth } from 'sharea/store/app';
import { useSharea } from 'sharea/store/sharea';
import { capitalize } from 'sharea/lib';
import TabNav from 'sharea/component/layout/TabNav';
import Sidebar from 'sharea/component/layout/Sidebar';
import {connectAuth} from 'sharea/store/auth';
import {capitalize} from 'sharea/lib';
import TabNav from "sharea/component/layout/TabNav";
import ShareasList from "sharea/pages/Sharea";
import UsersList from "sharea/pages/UsersListing";


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
        id : 1001,
        username : "Fouiny",
        isLiked : "True",
        likedBy : 12,
    },
    {
        id : 1002,
        username : "Batman",
        isLiked : "False",
        likedBy : 1,
    },
    {
        id : 1003,
        username : "JCVD",
        isLiked : "True",
        likedBy : 153,
    }
]

// Home :: None => Component

function Home({token}) {

    return (
        <div className="section dashboard">
            <Sidebar/>
            <main className="content">
                <div className="inner-content">
                    <div className="heading">
                        <h1>Hi, {capitalize(token.sub)}</h1>
                        <TabNav links={links} default="/dashboard"/>
                    </div>
                    <ShareasList shareas={shareas}/>
                    <UsersList users={users}/>
                </div>
            </main>
        </div>
    );

}


export default Home;
