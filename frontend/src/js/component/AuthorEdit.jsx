import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useUser } from 'sharea/store/user';


function AuthorEdit({ author, isEditing, cancelCallback, submitCallback, editCallback, ...props }) {
  const { currentUser } = useUser();

  return (
    <div>
      {
        currentUser.id === author.id
          ? (
            isEditing
              ? (<>
                <Button onClick={cancelCallback}>Cancel</Button>
                <Button type="submit">Submit</Button>
              </>)
              : (<Button onClick={editCallback}><Icon icon={faEdit} /></Button>)
          )
          : <Link to={`/user/${author.id}`}>@{author.username}</Link>
      }
    </div>
  )
}

// todo : withUser, withAuthor
export default AuthorEdit;