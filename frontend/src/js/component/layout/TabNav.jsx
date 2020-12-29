import {Nav} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import React from "react";

function TabNav(props) {
  return (
    <Nav defaultActiveKey={props.default}>
      {props.links.map(({ uri, title }) => (
        <Nav.Item key={uri}>
          <Nav.Link as={NavLink} exact to={uri}>{title}</Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}

export default TabNav;
