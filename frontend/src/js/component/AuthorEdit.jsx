import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useUser } from 'sharea/store/user';
import { prevent } from 'sharea/lib';


function SubmitButton({ onSubmit }) {
  if (onSubmit !== null) {
    return <Button
      onClick={onSubmit}>
      Submit
    </Button>

  } else {
    return <Button
      type="submit"
    >Submit</Button>
  }
}

function AuthorEdit({ author, isEditing, onCancel, onSubmit, onEdit }) {

  const { currentUser } = useUser();

  if (currentUser.id !== author.id)
    return <Link to={`/profile/${author.id}`}>@{author.username}</Link>;

  if (isEditing)
    return (
      <>
        <Button
          onClick={onCancel}
          variant="outline-primary"
          className="mr-2"
        >Cancel</Button>
        <SubmitButton onSubmit={onSubmit} />
      </>
    );

  return <Button onClick={onEdit}><Icon icon={faEdit} /></Button>;
}

// todo : withUser, withAuthor
export default AuthorEdit;