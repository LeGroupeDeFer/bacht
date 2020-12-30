import React from "react";
import {Link} from "react-router-dom";
import {Table} from "react-bootstrap";

function UserRow(props) {
    return (
        <tr>
            <td>{props.id}</td>
            <Link to={`/user/${props.id}`}><td>{props.username}</td></Link>
            <td>{props.isLiked}</td>
            <td>{props.likedBy}</td>
        </tr>
    )
}

function UsersList (props) {
    return(
        <Table striped bordered hover size="sm" variant="dark">
            <thead>
            <tr>
                <th>UserId</th>
                <th>Username</th>
                <th></th>
                <th>Number of followers</th>
            </tr>
            </thead>
            <tbody>
            {
                props.users.map(
                    u => (<UserRow
                        key = {u.id}
                        id = {u.id}
                        username = {u.username}
                        isLiked = {u.isLiked}
                        likedBy = {u.likedBy}
                    />)
                )
            }
            </tbody>
        </Table>
    )
}

export default UsersList;
