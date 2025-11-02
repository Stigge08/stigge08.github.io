import React from 'react';
import { Container, Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import type { ComponentKey } from '../Wrappers/MainContent';

interface TopNavigationProps {
  onSelectComponent: (component: ComponentKey) => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ onSelectComponent }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="md" fixed="top">
      <Container>
        <Navbar.Brand href="#">Stigge08</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => onSelectComponent('Carousel')}>Pics</Nav.Link>
            <Nav.Link onClick={() => onSelectComponent('table')}>Table</Nav.Link>
            <Nav.Link disabled>Disabled</Nav.Link>
            <NavDropdown title="Dropdown" id="nav-dropdown">
              <NavDropdown.Item onClick={() => onSelectComponent('Carousel')}>
                Action
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => onSelectComponent('table')}>
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => onSelectComponent('Carousel')}>
                Something else
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form className="d-flex">
            <FormControl type="search" placeholder="Search" className="me-2" aria-label="Search" />
            <Button variant="secondary" type="submit">
              Search
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavigation;
