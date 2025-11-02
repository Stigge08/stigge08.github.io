import React from 'react';
import { Table } from 'react-bootstrap';
import type { interFaceFundData } from './Interfaces/interfaces';

export type FundOverviewItem = {
  fundName: string;
  totalQuantity: number;
  currentValue: number;
};

interface FundOverviewProps {
  fundData: interFaceFundData[];
}

export const FundOverview: React.FC<FundOverviewProps> = ({ fundData }) => {
  // calculate overview
  const overviewMap: Record<string, { quantity: number; totalCost: number; value: number }> = {};

  fundData.forEach((t) => {
    const name = t.fundName;
    if (!overviewMap[name]) overviewMap[name] = { quantity: 0, totalCost: 0, value: 0 };

    if (t.type === 'holding' || t.type === 'buy') {
      overviewMap[name].quantity += t.quantity;
      overviewMap[name].totalCost += t.quantity * t.unitPrice;
      overviewMap[name].value += t.quantity * t.unitPrice;
    } else if (t.type === 'sell') {
      // Calculate average unit price before sell
      const avgUnitPrice =
        overviewMap[name].quantity > 0 ? overviewMap[name].value / overviewMap[name].quantity : 0;
      // Subtract quantity sold
      overviewMap[name].quantity -= t.quantity;
      if (overviewMap[name].quantity < 0) overviewMap[name].quantity = 0;
      // Subtract value based on average unit price * quantity sold
      overviewMap[name].value -= t.quantity * avgUnitPrice;
      if (overviewMap[name].value < 0) overviewMap[name].value = 0;
    }
  });

  const fundOverview: FundOverviewItem[] = Object.entries(overviewMap).map(
    ([fundName, { quantity, value }]) => ({
      fundName,
      totalQuantity: quantity,
      currentValue: value,
    }),
  );

  const totalValue = fundOverview.reduce((sum, fund) => sum + fund.currentValue, 0);

  return (
    <div style={{ margin: '2rem 0' }}>
      <h3>Fund Overview</h3>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Fund Name</th>
            <th>Total Units</th>
            <th>Current Value (€)</th>
          </tr>
        </thead>
        <tbody>
          {fundOverview.map((fund) => (
            <tr key={fund.fundName}>
              <td>{fund.fundName}</td>
              <td>{fund.totalQuantity.toFixed(2)}</td>
              <td>{fund.currentValue.toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td>
              <strong>Total</strong>
            </td>
            <td></td>
            <td>
              <strong>{totalValue.toFixed(2)}</strong>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};
