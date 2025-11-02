import React from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import type { interFaceFundData } from './Interfaces/interfaces';

interface EditableFundTableProps {
  fundData: interFaceFundData[];
  setfundData: React.Dispatch<React.SetStateAction<interFaceFundData[]>>;
}

const EditableFundTable: React.FC<EditableFundTableProps> = ({ fundData, setfundData }) => {
  const handleChange = (index: number, field: keyof interFaceFundData, value: string | number) => {
    setfundData((prevfundData: any[]) =>
      prevfundData.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  const addRow = () => {
    const newRow: interFaceFundData = {
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

  const removeRow = (index: number) => {
    setfundData((prevfundData) => prevfundData.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text === 'string') {
          const jsonData = JSON.parse(text) as interFaceFundData[];
          if (Array.isArray(jsonData)) {
            setfundData(jsonData);
          }
        }
      } catch (error) {
        console.error('Error parsing JSON file:', error);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const columns = Object.keys(fundData[0] || {});

  return (
    <>
      <Form.Group controlId="jsonFileUpload" className="mb-3">
        <Form.Label>Import JSON File</Form.Label>
        <Form.Control type="file" accept=".json,application/json" onChange={handleFileUpload} />
      </Form.Group>
      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col.charAt(0).toUpperCase() + col.slice(1)}</th>
            ))}
            <th>Remove</th>
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
                  ) : col === 'amount' ? (
                    <Form.Control
                      type="text"
                      value={(row.quantity * row.unitPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      readOnly
                    />
                  ) : col === 'quantity' || col === 'unitPrice' ? (
                    <Form.Control
                      type="text"
                      value={(row[col as keyof interFaceFundData] as number).toLocaleString()}
                      onChange={(e) =>
                        handleChange(
                          index,
                          col as keyof interFaceFundData,
                          parseFloat(e.target.value.replace(/,/g, '')) || 0,
                        )
                      }
                    />
                  ) : col === 'note' ? (
                    <Form.Control
                      type="text"
                      value={row.note || ''}
                      onChange={(e) => handleChange(index, 'note', e.target.value)}
                    />
                  ) : col === 'fundName' ? (
                    <Form.Select
                      value={row.fundName || ''}
                      onChange={(e) => handleChange(index, 'fundName', e.target.value)}
                    >
                      <option value="">Select Fund</option>
                      <option value="Nordea Optima">Nordea Optima</option>
                      <option value="Nordea Global Enhanced Small Cap Fund BP">
                        Nordea Global Enhanced Small Cap Fund BP
                      </option>
                      <option value="Nordea Global">Nordea Global</option>
                    </Form.Select>
                  ) : (
                    row[col as keyof interFaceFundData]
                  )}
                </td>
              ))}
              <td>
                <Button variant="danger" onClick={() => removeRow(index)}>
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={addRow}>Add Row</Button>
    </>
  );
};

export default EditableFundTable;
