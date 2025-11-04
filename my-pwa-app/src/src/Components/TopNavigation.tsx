import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import type { TopNavigationProps } from './Interfaces/interfaces';

const TopNavigation: React.FC<TopNavigationProps> = ({ onSelectComponent }) => {
  return (
    <Navbar bg="dark" variant="dark" fixed="top">
      <Container>
        <Navbar.Brand href="#">Stigge08</Navbar.Brand>

        <Nav className="me-auto">
          <Nav.Link onClick={() => onSelectComponent('EditableFundTable')}>EditFunds</Nav.Link>
          <Nav.Link onClick={() => onSelectComponent('FundOverview')}>FundOverview</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default TopNavigation;
