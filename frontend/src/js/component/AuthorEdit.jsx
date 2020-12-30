import {Button} from 'react-bootstrap';
import {FontAwesomeIcon as Icon} from '@fortawesome/react-fontawesome';
import {faEdit} from '@fortawesome/free-solid-svg-icons';
import {Link} from 'react-router-dom';
import React from 'react';


function AuthorEdit({currentUser, author, isEditing, cancelCallback, submitCallback, editCallback, ...props}) {
  return (
    <div>
      {
        currentUser.id === author.id
          ? (
            isEditing
              ? (<>
                <Button onClick={cancelCallback}>Cancel</Button>
                <Button type="submit" onClick={submitCallback}>Submit</Button>
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