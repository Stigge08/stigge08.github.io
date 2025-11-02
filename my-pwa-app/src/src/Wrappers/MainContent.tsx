import React, { useState } from 'react';
import { Container } from 'react-bootstrap';

import ControlledCarousel from '../Components/Carousel';
import EditableTable from '../Components/EditableTable';
import type { RowData } from '../Components/Interfaces/interfaces';

export type ComponentKey = 'Carousel' | 'table';

interface MainContentProps {
  activeComponent: ComponentKey; // Controlled from parent
}

const MainContent: React.FC<MainContentProps> = ({ activeComponent }) => {
  const [rows, setRows] = useState<RowData[]>([
    { id: 1, firstName: 'Mark', lastName: 'Otto', username: '@mdo' },
    { id: 2, firstName: 'Jacob', lastName: 'Thornton', username: '@fat' },
    { id: 3, firstName: 'Larry', lastName: 'Bird', username: '@twitter' },
  ]);

  return (
    <Container style={{ paddingTop: '80px' }}>
      {activeComponent === 'Carousel' && <ControlledCarousel />}
      {activeComponent === 'table' && <EditableTable rows={rows} setRows={setRows} />}
    </Container>
  );
};

export default MainContent;
