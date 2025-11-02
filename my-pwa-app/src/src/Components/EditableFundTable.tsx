import React from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import type { FundData } from './Interfaces/interfaces';

interface EditableFundTableProps {
  fundData: FundData[];
  setfundData: React.Dispatch<React.SetStateAction<FundData[]>>;
}

const EditableFundTable: React.FC<EditableFundTableProps> = ({ fundData, setfundData }) => {
  const handleChange = (index: number, field: keyof FundData, value: string | number) => {
    setfundData((prevfundData: any[]) =>
      prevfundData.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  const addRow = () => {
    const newRow: FundData = {
      date: new Date().toISOString().split('T')[0], // current date
      type: 'holding',
      amount: 0,
      quantity: 0,
      unitPrice: 0,
      note: '',
      fundName: '',
    };
    setfundData([...fundData, newRow]);
  };

  const columns = Object.keys(fundData[0] || {});

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col.charAt(0).toUpperCase() + col.slice(1)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fundData.map((row, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={col}>
                  {col === 'date' ? (
                    <Form.Control
                      type="date"
                      value={row.date}
                      onChange={(e) => handleChange(index, 'date', e.target.value)}
                    />
                  ) : col === 'type' ? (
                    <Form.Select
                      value={row.type}
                      onChange={(e) => handleChange(index, 'type', e.target.value)}
                    >
                      <option value="holding">holding</option>
                      <option value="buy">buy</option>
                      <option value="sell">sell</option>
                    </Form.Select>
                  ) : col === 'amount' || col === 'quantity' || col === 'unitPrice' ? (
                    <Form.Control
                      type="number"
                      value={row[col as keyof FundData] as number}
                      onChange={(e) =>
                        handleChange(index, col as keyof FundData, parseFloat(e.target.value))
                      }
                    />
                  ) : col === 'note' ? (
                    <Form.Control
                      type="text"
                      value={row.note || ''}
                      onChange={(e) => handleChange(index, 'note', e.target.value)}
                    />
                  ) : col === 'fundName' ? (
                    <Form.Control
                      type="text"
                      value={row.fundName || ''}
                      onChange={(e) => handleChange(index, 'fundName', e.target.value)}
                    />
                  ) : (
                    row[col as keyof FundData]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={addRow}>Add Row</Button>
    </>
  );
};

export default EditableFundTable;
