import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
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
    <Container style={{ paddingTop: '80px', overflowX: 'auto' }}>
      {activeComponent === 'Carousel' && <ControlledCarousel />}
      {activeComponent === 'EditableFundTable' && (
        <Row>
          <Col xs={12} md={12} style={{ overflowX: 'auto' }}>
            <EditableFundTable fundData={sortedFundData} setfundData={setFundData} />
          </Col>
          <Col xs={12} md={12} style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <FundOverview fundData={sortedFundData} />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default MainContent;
