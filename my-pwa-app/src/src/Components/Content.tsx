import React from 'react';
import { Container } from 'react-bootstrap';

const MainContent: React.FC = () => {
  return (
    <>
      {/* Main content */}
      <Container style={{ paddingTop: '80px' }}>
        <div className="starter-template text-center mt-5">
          <h1>PlaceHolder</h1>
          <p className="lead">
            Use this component as a way to quickly start any new React project.
            <br />
            All you get is this text and a responsive navbar.
          </p>
        </div>
      </Container>
    </>
  );
};

export default MainContent;
