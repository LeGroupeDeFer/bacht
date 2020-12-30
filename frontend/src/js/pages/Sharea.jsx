import React from "react";
import {Card, CardDeck} from "react-bootstrap";
import {Link} from "react-router-dom";

function ShareaCard(props) {
    return (
        <Card>
            <Link to={`/sharea/${props.id}`}>
                <Card.Body>
                    <Card.Title> {props.name}</Card.Title>
                    <Card.Text>
                        <div>{props.description}</div>
                        <div>{props.id}</div>
                    </Card.Text>
                </Card.Body>
            </Link>
            <Card.Footer>
                <small className="TODO"><Link to={`/user/${props.creatorId}`}>@{props.creatorId}</Link> Got % likes </small>
            </Card.Footer>
        </Card>
    )
}

function ShareasList(props) {
    return (
        <CardDeck>
            {
                props.shareas.map(
                    sh => (<ShareaCard
                        key={sh.id}
                        name={sh.name}
                        description={sh.description}
                        id={sh.id}
                        creatorId={sh.creatorId}
                    />)
                )
            }
        </CardDeck>
    )
}

export default ShareasList;
