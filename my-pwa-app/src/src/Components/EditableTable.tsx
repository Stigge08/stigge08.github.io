import React from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import type { RowData } from './Interfaces/interfaces';

interface EditableTableProps {
  rows: RowData[];
  setRows: React.Dispatch<React.SetStateAction<RowData[]>>;
}

const EditableTable: React.FC<EditableTableProps> = ({ rows, setRows }) => {
  const handleChange = (id: number, field: keyof RowData, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const addRow = () => {
    const newId = rows.length ? rows[rows.length - 1].id + 1 : 1;
    const fieldDefaults = Object.keys(rows[0] || {}).reduce((acc, key) => {
      if (key === 'id') acc[key] = newId;
      else acc[key] = key; // default placeholder = field name
      return acc;
    }, {} as any);

    setRows([...rows, fieldDefaults]);
  };

  const columns = Object.keys(rows[0] || {});

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
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col}>
                  {col === 'id' ? (
                    row[col as keyof RowData]
                  ) : (
                    <Form.Control
                      type="text"
                      value={row[col as keyof RowData] as string}
                      onChange={(e) => handleChange(row.id, col as keyof RowData, e.target.value)}
                    />
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

export default EditableTable;
