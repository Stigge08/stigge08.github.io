import React from 'react';
import { Container } from 'react-bootstrap';
import EditableTable from '../Components/EditableTable';
import ControlledCarousel from '../Components/Carousel';

export type ComponentKey = 'Carousel' | 'table';

interface MainContentProps {
  activeComponent: ComponentKey; // Controlled from parent
}

const MainContent: React.FC<MainContentProps> = ({ activeComponent }) => {
  return (
    <Container style={{ paddingTop: '80px' }}>
      {activeComponent === 'Carousel' && <ControlledCarousel />}
      {activeComponent === 'table' && <EditableTable />}
    </Container>
  );
};

export default MainContent;
