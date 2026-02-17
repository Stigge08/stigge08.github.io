import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { interFaceFundData } from './Interfaces/interfaces';

interface FundGraphProps {
  fundData: interFaceFundData[];
}

const FundGraph: React.FC<FundGraphProps> = ({ fundData }) => {
  // Sort data by date
  const sortedData = [...fundData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  // Get unique funds
  const funds = Array.from(new Set(sortedData.map((item) => item.fundName).filter(Boolean)));

  // Maps to track current state
  const quantityMap = new Map<string, number>();
  const priceMap = new Map<string, number>();
  let netInvested = 0;

  // Data points for the chart
  const chartData: any[] = [];

  // Group transactions by date
  const transactionsByDate = new Map<string, interFaceFundData[]>();
  sortedData.forEach((item) => {
    if (!transactionsByDate.has(item.date)) {
      transactionsByDate.set(item.date, []);
    }
    transactionsByDate.get(item.date)!.push(item);
  });

  // Process each date
  for (const [date, transactions] of transactionsByDate) {
    const hasBuy = transactions.some((t) => t.type === 'buy');
    const hasSell = transactions.some((t) => t.type === 'sell');

    // Track actions per fund
    const fundActions = new Map<string, { hasBuy: boolean; hasSell: boolean }>();
    funds.forEach((fund) => fundActions.set(fund, { hasBuy: false, hasSell: false }));

    // Process all transactions for this date
    transactions.forEach((item) => {
      if (item.fundName) {
        // Update quantity
        const currentQty = quantityMap.get(item.fundName) || 0;
        if (item.type === 'buy') {
          quantityMap.set(item.fundName, currentQty + item.quantity);
          fundActions.get(item.fundName)!.hasBuy = true;
        } else if (item.type === 'sell') {
          quantityMap.set(item.fundName, currentQty - item.quantity);
          fundActions.get(item.fundName)!.hasSell = true;
        } else if (item.type === 'holding') {
          quantityMap.set(item.fundName, item.quantity);
        }

        // Update net invested
        if (item.type === 'buy' && item.amount) {
          netInvested += item.amount;
        } else if (item.type === 'sell' && item.amount) {
          netInvested -= item.amount;
        }

        // Update price
        priceMap.set(item.fundName, item.unitPrice);
      }
    });

    // After processing all transactions for the date, calculate values and add data point
    let totalValue = 0;
    const fundValues: { [key: string]: number | null } = {};
    quantityMap.forEach((qty, fund) => {
      const price = priceMap.get(fund) || 0;
      const value = qty * price;
      if (qty > 0) {
        fundValues[fund] = Math.round(value);
      } else if (qty === 0) {
        fundValues[fund] = 0;
      } else {
        fundValues[fund] = null;
      }
      totalValue += value;
    });

    // Add fund actions to data
    const fundActionData: { [key: string]: boolean } = {};
    fundActions.forEach((actions, fund) => {
      fundActionData[`${fund}_hasBuy`] = actions.hasBuy;
      fundActionData[`${fund}_hasSell`] = actions.hasSell;
    });

    chartData.push({
      date,
      totalValue: Math.round(totalValue),
      netInvested: Math.round(netInvested),
      unrealized: Math.round(totalValue - netInvested),
      hasBuy,
      hasSell,
      ...fundValues,
      ...fundActionData,
    });
  }

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          <p style={{ margin: 0, fontWeight: 'bold' }}>{`Date: ${label}`}</p>
          <hr style={{ margin: '5px 0' }} />
          {payload.map(
            (p: any, index: number) =>
              p.value !== 0 && (
                <p key={index} style={{ margin: '2px 0', color: p.color }}>
                  {`${p.name}: $${p.value?.toLocaleString() || 0}`}
                </p>
              ),
          )}
        </div>
      );
    }
    return null;
  };

  // Custom Dot Component for Buy/Sell indicators
  const CustomDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    if (typeof dataKey === 'string' && payload[`${dataKey}_hasBuy`]) {
      return (
        <g>
          <circle cx={cx} cy={cy} r={8} fill="green" stroke="white" strokeWidth={2} />
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dy=".3em"
            fontSize="10"
            fill="white"
            fontWeight="bold"
          >
            B
          </text>
        </g>
      );
    }
    if (typeof dataKey === 'string' && payload[`${dataKey}_hasSell`]) {
      return (
        <g>
          <circle cx={cx} cy={cy} r={8} fill="red" stroke="white" strokeWidth={2} />
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dy=".3em"
            fontSize="10"
            fill="white"
            fontWeight="bold"
          >
            S
          </text>
        </g>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: '70vh' }}>
      <h3>Fund Value Over Time</h3>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip shared={true} content={<CustomTooltip />} />
          <Legend />
          {funds.map((fund, index) => (
            <Line
              key={fund}
              type="monotone"
              dataKey={fund}
              stroke={`hsl(${index * 60}, 70%, 50%)`}
              name={fund}
              dot={<CustomDot />}
              strokeWidth={3}
              activeDot={{ r: 6, fill: 'red' }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <h3>Portfolio Value Over Time</h3>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip shared={true} content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalValue"
            stroke="#8884d8"
            name="Total Value"
            strokeWidth={3}
            activeDot={{ r: 6, fill: 'red' }}
          />
          <Line
            type="monotone"
            dataKey="netInvested"
            stroke="#82ca9d"
            name="Net Invested"
            strokeWidth={3}
            activeDot={{ r: 6, fill: 'red' }}
          />
          <Line
            type="monotone"
            dataKey="unrealized"
            stroke="#ffc658"
            name="Unrealized Gain/Loss"
            strokeWidth={3}
            activeDot={{ r: 6, fill: 'red' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FundGraph;
