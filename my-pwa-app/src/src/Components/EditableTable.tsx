import { useState } from 'react';
import { Table, Form, Button } from 'react-bootstrap';

interface RowData {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
}

function EditableTable() {
  const [rows, setRows] = useState<RowData[]>([
    { id: 1, firstName: 'Mark', lastName: 'Otto', username: '@mdo' },
    { id: 2, firstName: 'Jacob', lastName: 'Thornton', username: '@fat' },
    { id: 3, firstName: 'Larry', lastName: 'Bird', username: '@twitter' },
  ]);

  const handleChange = (id: number, field: keyof RowData, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const addRow = () => {
    const newId = rows.length ? rows[rows.length - 1].id + 1 : 1;
    const newRow: RowData = {
      id: newId,
      firstName: 'First Name',
      lastName: 'Last Name',
      username: '@username',
    };
    setRows([...rows, newRow]);
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>
                <Form.Control
                  type="text"
                  value={row.firstName}
                  onChange={(e) => handleChange(row.id, 'firstName', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={row.lastName}
                  onChange={(e) => handleChange(row.id, 'lastName', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={row.username}
                  onChange={(e) => handleChange(row.id, 'username', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={addRow}>Add Row</Button>
    </>
  );
}

export default EditableTable;
