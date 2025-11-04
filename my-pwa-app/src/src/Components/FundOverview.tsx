import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import type { FundOverviewProps, FundTracking } from './Interfaces/interfaces';

export const FundOverview: React.FC<FundOverviewProps> = ({ fundData, taxRate = 0.3 }) => {
  const [taxRateInput, setTaxRateInput] = useState(taxRate);
  const [sourceCurrency, setSourceCurrency] = useState('SEK');
  const [targetCurrency, setTargetCurrency] = useState('SEK');
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        if (sourceCurrency === targetCurrency) {
          setExchangeRate(1);
          console.log(
            `[Currency] Source and target currency are the same (${sourceCurrency}). Exchange rate set to 1.`,
          );
          return;
        }
        const url = `https://api.frankfurter.app/latest?from=${sourceCurrency}&to=${targetCurrency}`;
        console.log(`[Currency] Fetching exchange rate from: ${url}`);
        const response = await fetch(url);
        const data = await response.json();
        console.log('[Currency] Fetched data:', data);

        if (data && data.rates && typeof data.rates[targetCurrency] === 'number') {
          setExchangeRate(data.rates[targetCurrency]);
          console.log(
            `[Currency] Exchange rate ${sourceCurrency} -> ${targetCurrency}:`,
            data.rates[targetCurrency],
          );
        } else {
          setExchangeRate(1);
          console.warn(
            `[Currency] Could not parse exchange rate for ${sourceCurrency} -> ${targetCurrency}. Fallback to 1.`,
          );
        }
      } catch (error) {
        setExchangeRate(1);
        console.error('[Currency] Failed to fetch exchange rate. Fallback to 1.', error);
      }
    };
    fetchExchangeRate();
  }, [sourceCurrency, targetCurrency]);

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
      if (!fund.firstBuyDate) {
        fund.firstBuyDate = t.date;
      }
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
    let holdingPeriod = '';
    if (f.firstBuyDate) {
      const now = new Date();
      const firstBuy = new Date(f.firstBuyDate);
      const diffInMonths =
        (now.getFullYear() - firstBuy.getFullYear()) * 12 + (now.getMonth() - firstBuy.getMonth());
      const years = Math.floor(diffInMonths / 12);
      const months = diffInMonths % 12;
      holdingPeriod = `${years}y ${months}m`;
    }
    return {
      fundName: name,
      remainingUnits: f.quantity,
      totalInvested: f.totalCost,
      realizedGain: f.realizedGain,
      taxes: f.realizedGain * taxRateInput,
      currentHoldingValue,
      unrealizedGain,
      totalGain: f.realizedGain + unrealizedGain,
      holdingPeriod,
    };
  });

  const totalInvested = fundOverview.reduce((sum, f) => sum + f.totalInvested, 0);
  const totalRealized = fundOverview.reduce((sum, f) => sum + f.realizedGain, 0);
  const totalTaxes = fundOverview.reduce((sum, f) => sum + f.taxes, 0);
  const totalCurrentHoldingValue = fundOverview.reduce((sum, f) => sum + f.currentHoldingValue, 0);
  const totalUnrealizedGain = fundOverview.reduce((sum, f) => sum + f.unrealizedGain, 0);
  const totalGain = totalRealized + totalUnrealizedGain;

  const formatValue = (value: number) =>
    (value * exchangeRate).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const columns = [
    { key: 'fundName', label: 'Fund Name', isNumeric: false },
    { key: 'remainingUnits', label: 'Remaining Units', isNumeric: true },
    { key: 'totalInvested', label: `Total Invested (${targetCurrency})`, isNumeric: true },
    { key: 'realizedGain', label: `Realized Gain (${targetCurrency})`, isNumeric: true },
    { key: 'taxes', label: `Taxes (${targetCurrency})`, isNumeric: true },
    {
      key: 'currentHoldingValue',
      label: `Current Holding Value (${targetCurrency})`,
      isNumeric: true,
    },
    { key: 'unrealizedGain', label: `Unrealized Gain (${targetCurrency})`, isNumeric: true },
    { key: 'holdingPeriod', label: 'Holding Period', isNumeric: false },
    { key: 'totalGain', label: `Total Gain (${targetCurrency})`, isNumeric: true },
  ];

  // Sorting state for table columns
  type SortDirection = 'asc' | 'desc';
  type SortConfig = { key: string; direction: SortDirection } | null;
  // Set initial sort to 'unrealizedGain' descending
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'unrealizedGain',
    direction: 'desc',
  });

  // Sorting handler
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        // Toggle direction
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        // Default to ascending
        return { key, direction: 'asc' };
      }
    });
  };

  // Sorted fund overview (excluding the total row)
  const sortedFundOverview = React.useMemo(() => {
    if (!sortConfig) return [...fundOverview];
    const { key, direction } = sortConfig;
    return [...fundOverview].sort((a, b) => {
      const col = columns.find((c) => c.key === key);
      if (!col) return 0;
      let aValue = a[key as keyof typeof a];
      let bValue = b[key as keyof typeof b];
      // For fundName (string), else numbers
      if (col.isNumeric) {
        aValue = Number(aValue);
        bValue = Number(bValue);
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      } else {
        // String comparison
        return direction === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      }
    });
  }, [fundOverview, sortConfig, columns]);

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
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="sourceCurrencySelect" style={{ marginRight: '0.5rem' }}>
          Source Currency:
        </label>
        <select
          id="sourceCurrencySelect"
          value={sourceCurrency}
          onChange={(e) => setSourceCurrency(e.target.value)}
          style={{ marginRight: '1rem' }}
        >
          <option value="SEK">SEK</option>
          <option value="EUR">EUR</option>
        </select>

        <label htmlFor="targetCurrencySelect" style={{ marginRight: '0.5rem' }}>
          Target Currency:
        </label>
        <select
          id="targetCurrencySelect"
          value={targetCurrency}
          onChange={(e) => setTargetCurrency(e.target.value)}
          style={{ marginRight: '1rem' }}
        >
          <option value="SEK">SEK</option>
          <option value="EUR">EUR</option>
        </select>

        <span style={{ fontWeight: 'bold', color: exchangeRate === 1 ? 'gray' : 'black' }}>
          {sourceCurrency} → {targetCurrency}: {exchangeRate.toFixed(4)}
        </span>
      </div>
      <Table striped bordered>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort(col.key)}
              >
                {col.label}
                {sortConfig && sortConfig.key === col.key && (
                  <span style={{ marginLeft: 4 }}>
                    {sortConfig.direction === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedFundOverview.map((f) => (
            <tr key={f.fundName}>
              {columns.map((col) => {
                if (col.key === 'fundName') {
                  return <td key={col.key}>{f.fundName}</td>;
                } else if (col.key === 'remainingUnits') {
                  return (
                    <td key={col.key}>
                      {f.remainingUnits.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  );
                } else if (col.key === 'holdingPeriod') {
                  return <td key={col.key}>{f.holdingPeriod}</td>;
                } else {
                  return (
                    <td key={col.key}>{formatValue(f[col.key as keyof typeof f] as number)}</td>
                  );
                }
              })}
            </tr>
          ))}
          <tr>
            {columns.map((col) => {
              if (col.key === 'fundName') {
                return (
                  <td key={col.key}>
                    <strong>Total</strong>
                  </td>
                );
              } else if (col.key === 'remainingUnits' || col.key === 'holdingPeriod') {
                return <td key={col.key}></td>;
              } else {
                let totalValue = 0;
                switch (col.key) {
                  case 'totalInvested':
                    totalValue = totalInvested;
                    break;
                  case 'realizedGain':
                    totalValue = totalRealized;
                    break;
                  case 'taxes':
                    totalValue = totalTaxes;
                    break;
                  case 'currentHoldingValue':
                    totalValue = totalCurrentHoldingValue;
                    break;
                  case 'unrealizedGain':
                    totalValue = totalUnrealizedGain;
                    break;
                  case 'totalGain':
                    totalValue = totalGain;
                    break;
                }
                return (
                  <td key={col.key}>
                    <strong>{formatValue(totalValue)}</strong>
                  </td>
                );
              }
            })}
          </tr>
        </tbody>
      </Table>
    </div>
  );
};
