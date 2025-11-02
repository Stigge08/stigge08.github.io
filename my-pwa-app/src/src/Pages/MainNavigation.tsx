import React from 'react';
import { Container, Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';

const MainNavigation: React.FC = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="md" fixed="top">
        <Container>
          <Navbar.Brand href="#">Stigge08</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#">Home</Nav.Link>
              <Nav.Link href="#">Link</Nav.Link>
              <Nav.Link disabled>Disabled</Nav.Link>
              <NavDropdown title="Dropdown" id="nav-dropdown">
                <NavDropdown.Item href="#">Action</NavDropdown.Item>
                <NavDropdown.Item href="#">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#">Something else here</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="secondary" type="submit">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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

export default MainNavigation;