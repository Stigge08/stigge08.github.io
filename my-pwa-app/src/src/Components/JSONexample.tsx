import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface JsonExampleModalProps {
  show: boolean;
  onClose: () => void;
}

const JsonExampleModal: React.FC<JsonExampleModalProps> = ({ show, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>JSON Example</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <pre>{`[
  {
    "date": "2024-06-01",
    "type": 'holding' | 'buy' | 'sell',
    "amount": 1000,
    "quantity": 50,
    "unitPrice": 20,
    "note": "Initial investment",
    "fundName": 'Nordea Global Enhanced Small Cap Fund BP' | 'Nordea Optima' | 'Nordea Global' | ''
  }
]`}</pre>
        <a
          href="https://onlinejsonformatter.com/json-beautifier"
          target="_blank"
          rel="noopener noreferrer"
        >
          onlinejsonformatter
        </a>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JsonExampleModal;
