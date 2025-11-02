import React, { useState } from 'react';
import { Container } from 'react-bootstrap';

import ControlledCarousel from '../Components/Carousel';
import EditableTable from '../Components/EditableTable';
import type { interFaceFundData, RowData } from '../Components/Interfaces/interfaces';
import EditableFundTable from '../Components/EditableFundTable';
import { FundOverview } from '../Components/FundOverview';
import { FundData } from '../Components/Data/FundData';

export type ComponentKey = 'Carousel' | 'table' | 'EditableFundTable';

interface MainContentProps {
  activeComponent: ComponentKey; // Controlled from parent
}

const MainContent: React.FC<MainContentProps> = ({ activeComponent }) => {
  const [rows, setRows] = useState<RowData[]>([
    { id: 1, firstName: 'Mark', lastName: 'Otto', username: '@mdo' },
    { id: 2, firstName: 'Jacob', lastName: 'Thornton', username: '@fat' },
    { id: 3, firstName: 'Larry', lastName: 'Bird', username: '@twitter' },
  ]);

  const [fundData, setFundData] = useState<interFaceFundData[]>(FundData);

  const sortedFundData = [...fundData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <Container style={{ paddingTop: '80px' }}>
      {activeComponent === 'Carousel' && <ControlledCarousel />}
      {activeComponent === 'table' && <EditableTable rows={rows} setRows={setRows} />}
      {activeComponent === 'EditableFundTable' && (
        <>
          <EditableFundTable fundData={sortedFundData} setfundData={setFundData} />
          <FundOverview fundData={sortedFundData} />
        </>
      )}
    </Container>
  );
};

export default MainContent;
