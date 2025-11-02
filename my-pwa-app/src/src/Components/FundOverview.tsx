import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import type { interFaceFundData } from './Interfaces/interfaces';

interface FundOverviewProps {
  fundData: interFaceFundData[];
  taxRate?: number;
}

interface FundTracking {
  quantity: number; // remaining units
  totalCost: number; // total invested for remaining units
  realizedGain: number; // accumulated gain from sells
}

export const FundOverview: React.FC<FundOverviewProps> = ({ fundData, taxRate = 0.3 }) => {
  const [taxRateInput, setTaxRateInput] = useState(taxRate);

  // Sort transactions by date
  const sortedData = [...fundData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const fundMap: Record<string, FundTracking> = {};

  sortedData.forEach((t) => {
    const name = t.fundName;
    if (!fundMap[name]) fundMap[name] = { quantity: 0, totalCost: 0, realizedGain: 0 };

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

      fund.realizedGain += t.quantity * t.unitPrice - costOfSoldUnits; // realized gain
      fund.quantity -= t.quantity;
      fund.totalCost -= costOfSoldUnits;
    }
    // 'holding' transactions are ignored for tax purposes
  });

  const lastUnitPriceMap: Record<string, number> = {};
  sortedData.forEach((t) => {
    if (t.type === 'buy' || t.type === 'sell' || t.type === 'holding') {
      lastUnitPriceMap[t.fundName] = t.unitPrice;
    }
  });

  const fundOverview = Object.entries(fundMap).map(([name, f]) => {
    const currentHoldingValue = f.quantity * (lastUnitPriceMap[name] || 0);
    const unrealizedGain = currentHoldingValue - f.totalCost;
    return {
      fundName: name,
      remainingUnits: f.quantity,
      totalInvested: f.totalCost,
      realizedGain: f.realizedGain,
      taxes: f.realizedGain * taxRateInput,
      currentHoldingValue,
      unrealizedGain,
    };
  });

  const totalInvested = fundOverview.reduce((sum, f) => sum + f.totalInvested, 0);
  const totalRealized = fundOverview.reduce((sum, f) => sum + f.realizedGain, 0);
  const totalTaxes = fundOverview.reduce((sum, f) => sum + f.taxes, 0);
  const totalCurrentHoldingValue = fundOverview.reduce((sum, f) => sum + f.currentHoldingValue, 0);
  const totalUnrealizedGain = fundOverview.reduce((sum, f) => sum + f.unrealizedGain, 0);

  return (
    <div style={{ margin: '2rem 0' }}>
      <h3>Fund Overview (Tax Relevant)</h3>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="taxRateInput" style={{ marginRight: '0.5rem' }}>
          Tax Rate:
        </label>
        <input
          id="taxRateInput"
          type="number"
          step="0.01"
          min="0"
          max="1"
          value={taxRateInput}
          onChange={(e) => setTaxRateInput(parseFloat(e.target.value) || 0)}
        />
      </div>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Fund Name</th>
            <th>Remaining Units</th>
            <th>Total Invested (sek)</th>
            <th>Realized Gain (sek)</th>
            <th>Taxes (sek)</th>
            <th>Current Holding Value (sek)</th>
            <th>Unrealized Gain (sek)</th>
          </tr>
        </thead>
        <tbody>
          {fundOverview.map((f) => (
            <tr key={f.fundName}>
              <td>{f.fundName}</td>
              <td>
                {f.remainingUnits.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td>
                {f.totalInvested.toLocaleString(undefined, {
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
              <td>
                {f.taxes.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td>
                {f.currentHoldingValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td>
                {f.unrealizedGain.toLocaleString(undefined, {
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
                {totalInvested.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </td>
            <td>
              <strong>
                {totalRealized.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </td>
            <td>
              <strong>
                {totalTaxes.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </td>
            <td>
              <strong>
                {totalCurrentHoldingValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </td>
            <td>
              <strong>
                {totalUnrealizedGain.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};
