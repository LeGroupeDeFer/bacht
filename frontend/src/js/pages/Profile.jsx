import React, { useEffect, useState } from 'react';

import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { useUser } from 'sharea/store/user';
import { STATUS } from 'sharea/lib';
import { Card } from 'react-bootstrap';
import Error from 'sharea/component/Error';
import Loader from 'sharea/component/Loader';
import Profile from 'sharea/component/Profile';


function ProfilePage() {

  const match = useRouteMatch();
  const seeked = match.params.id;
  const { error, status, users, currentUser, fetchSpecificUser } = useUser();

  if(seeked === 'self') {
    return <Profile user={currentUser}/>
  }

  useEffect(() => {
    console.log("inside useEffect");
    if (users[seeked] === undefined) {
      fetchSpecificUser(seeked);
    }
  }, []);


  if(status === STATUS.FAILED) {
    return <Card><Error error={error}/></Card>
  }

  if (users[seeked] === undefined) {
    return <Loader.Centered width="100" />
  }

  return <Profile user={users[seeked]} />
}

export default ProfilePage;