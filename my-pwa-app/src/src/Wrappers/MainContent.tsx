import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import ControlledCarousel from '../Components/Carousel';
import type { interFaceFundData } from '../Components/Interfaces/interfaces';
import EditableFundTable from '../Components/EditableFundTable';
import { FundOverview } from '../Components/FundOverview';
import { FundData } from '../Components/Data/FundData';

export type ComponentKey = 'Carousel' | 'EditableFundTable';

interface MainContentProps {
  activeComponent: ComponentKey; // Controlled from parent
}

const MainContent: React.FC<MainContentProps> = ({ activeComponent }) => {
  const [fundData, setFundData] = useState<interFaceFundData[]>(FundData);

  const sortedFundData = [...fundData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <Container style={{ paddingTop: '80px' }}>
      {activeComponent === 'Carousel' && <ControlledCarousel />}
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
