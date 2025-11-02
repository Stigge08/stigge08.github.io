import React from 'react';
import { Table } from 'react-bootstrap';
import type { interFaceFundData } from './Interfaces/interfaces';

interface FundOverviewProps {
  fundData: interFaceFundData[];
}

interface FundTracking {
  quantity: number;
  totalCost: number; // total cost of remaining units
  realizedGain: number;
  currentMarketValue: number; // from holding type
}

export const FundOverview: React.FC<FundOverviewProps> = ({ fundData }) => {
  // Sort transactions by date
  const sortedData = [...fundData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const fundMap: Record<string, FundTracking> = {};

  sortedData.forEach((t) => {
    const name = t.fundName;
    if (!fundMap[name])
      fundMap[name] = { quantity: 0, totalCost: 0, realizedGain: 0, currentMarketValue: 0 };

    const fund = fundMap[name];

    if (t.type === 'buy') {
      fund.quantity += t.quantity;
      fund.totalCost += t.quantity * t.unitPrice;
    } else if (t.type === 'sell') {
      if (fund.quantity === 0) {
        console.warn(`Attempt to sell with zero holdings for ${name}`);
        return;
      }
      const avgCost = fund.totalCost / fund.quantity; // average cost per unit
      const costOfSoldUnits = avgCost * t.quantity;

      fund.realizedGain += t.quantity * t.unitPrice - costOfSoldUnits; // profit = sale price - cost
      fund.quantity -= t.quantity;
      fund.totalCost -= costOfSoldUnits;
    } else if (t.type === 'holding') {
      // Treat as snapshot for current market value only
      fund.currentMarketValue = t.quantity * t.unitPrice;
    }
  });

  const fundOverview = Object.entries(fundMap).map(([name, f]) => ({
    fundName: name,
    totalUnits: f.quantity,
    averageCost: f.quantity > 0 ? f.totalCost / f.quantity : 0,
    currentValue: f.currentMarketValue || f.quantity * (f.totalCost / (f.quantity || 1)),
    realizedGain: f.realizedGain,
  }));

  const totalValue = fundOverview.reduce((sum, f) => sum + f.currentValue, 0);

  return (
    <div style={{ margin: '2rem 0' }}>
      <h3>Fund Overview</h3>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Fund Name</th>
            <th>Total Units</th>
            <th>Current Value (€)</th>
            <th>Realized Gain (€)</th>
          </tr>
        </thead>
        <tbody>
          {fundOverview.map((f) => (
            <tr key={f.fundName}>
              <td>{f.fundName}</td>
              <td>{f.totalUnits.toFixed(2).toLocaleString()}</td>
              <td>
                {f.currentValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td>
                {f.realizedGain.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <strong>Total</strong>
            </td>
            <td></td>
            <td>
              <strong>
                {totalValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};
