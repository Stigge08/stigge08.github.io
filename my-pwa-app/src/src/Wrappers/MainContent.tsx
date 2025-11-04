import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import ControlledCarousel from '../Components/Carousel';
import type { interFaceFundData, MainContentProps } from '../Components/Interfaces/interfaces';
import EditableFundTable from '../Components/EditableFundTable';
import { FundOverview } from '../Components/FundOverview';
import { FundData } from '../Components/Data/FundData';

const MainContent: React.FC<MainContentProps> = ({ activeComponent }) => {
  const [fundData, setFundData] = useState<interFaceFundData[]>(FundData);

  const sortedFundData = [...fundData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <Container style={{ paddingTop: '80px', overflowX: 'auto' }}>
      {activeComponent === 'Carousel' && <ControlledCarousel />}
      {activeComponent === 'EditableFundTable' && (
        <EditableFundTable fundData={sortedFundData} setfundData={setFundData} />
      )}
      {activeComponent === 'FundOverview' && <FundOverview fundData={sortedFundData} />}
    </Container>
  );
};

export default MainContent;
