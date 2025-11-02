import React from 'react';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
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
            <Nav.Link onClick={() => onSelectComponent('EditableFundTable')}>FundTable</Nav.Link>
            <Nav.Link
              href="https://onlinejsonformatter.com/json-beautifier"
              target="_blank"
              rel="noopener noreferrer"
            >
              JSON Formatter
            </Nav.Link>
            <NavDropdown title="Dropdown" id="nav-dropdown">
              <NavDropdown.Item onClick={() => onSelectComponent('Carousel')}>
                Carousel
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => onSelectComponent('EditableFundTable')}>
                FundTable
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavigation;
