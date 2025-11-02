import React, { useState } from 'react';
import { Container } from 'react-bootstrap';

import ControlledCarousel from '../Components/Carousel';
import EditableTable from '../Components/EditableTable';
import type { FundData, RowData } from '../Components/Interfaces/interfaces';
import EditableFundTable from '../Components/EditableFundTable';
import { FundOverview } from '../Components/FundOverview';

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

  const [fundData, setFundData] = useState<FundData[]>([
    {
      date: '2023-03-22',
      type: 'buy',
      amount: 2800000,
      quantity: 2375.56,
      unitPrice: 1178.56,
      fundName: 'Nordea Optima',
    },
    {
      date: '2023-01-01',
      type: 'buy',
      amount: 700000,
      quantity: 426.22,
      unitPrice: 1642.36,
      fundName: 'Nordea Global Enhanced Small Cap Fund BP',
    },
    {
      date: '2025-08-22',
      type: 'sell',
      amount: 500000,
      quantity: 330.16,
      unitPrice: 1514.4,
      fundName: 'Nordea Optima',
    },
    {
      date: '2025-08-22',
      type: 'buy',
      amount: 500000,
      quantity: 52956.57,
      unitPrice: 9.4,
      fundName: 'Nordea Global',
    },

    {
      date: '2025-10-31',
      type: 'sell',
      amount: 600000,
      quantity: 381.18,
      unitPrice: 1574.05,
      fundName: 'Nordea Optima',
    },
    {
      date: '2025-10-30',
      type: 'sell',
      amount: 931780.8,
      quantity: 426.22,
      unitPrice: 2186.17,
      fundName: 'Nordea Global Enhanced Small Cap Fund BP',
    },
  ]);
  const sortedFundData = [...fundData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  // Calculate currentHoldingBefore for each transaction
  const fundDataWithHoldings = sortedFundData.map((transaction, index, arr) => {
    let currentHoldingBefore = 0;
    for (let i = 0; i < index; i++) {
      const prevTransaction = arr[i];
      if (prevTransaction.fundName === transaction.fundName) {
        if (prevTransaction.type === 'buy' || prevTransaction.type === 'holding') {
          currentHoldingBefore += prevTransaction.quantity;
        } else if (prevTransaction.type === 'sell') {
          currentHoldingBefore -= prevTransaction.quantity;
        }
      }
    }
    return { ...transaction, currentHoldingBefore };
  });

  return (
    <Container style={{ paddingTop: '80px' }}>
      {activeComponent === 'Carousel' && <ControlledCarousel />}
      {activeComponent === 'table' && <EditableTable rows={rows} setRows={setRows} />}
      {activeComponent === 'EditableFundTable' && (
        <>
          <EditableFundTable fundData={fundDataWithHoldings} setfundData={setFundData} />
          <FundOverview fundData={fundDataWithHoldings} />
        </>
      )}
    </Container>
  );
};

export default MainContent;
