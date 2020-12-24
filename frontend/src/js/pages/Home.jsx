import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import Sidebar from 'sharea/component/layout/Sidebar';


// Home :: None => Component
function Home(_) {

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <Container fluid>
          <Row>
            <Col>
              <h1>Hello!</h1>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );

}


export default Home;
