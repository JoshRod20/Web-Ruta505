import { useState } from 'react';
import Modal from '../common/Modal';

const MAX_LISTED_ERRORS = 50;

export default function ImportModal({ result, onConfirm, onClose }) {
  const { fileName, valid, errors } = result;
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setImporting(true);
    setError('');
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err.message);
      setImporting(false);
    }
  };

  return (
    <Modal
      title="Importar archivo"
      busy={importing}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={importing}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-r505"
            onClick={handleConfirm}
            disabled={importing || valid.length === 0}
          >
            {importing ? 'Importando…' : `Importar ${valid.length} ${valid.length === 1 ? 'dato' : 'datos'}`}
          </button>
        </>
      }
    >
      <p className="mb-2 text-break"><strong>{fileName}</strong></p>
      <p className="mb-2">
        <strong>{valid.length}</strong> {valid.length === 1 ? 'fila lista' : 'filas listas'} para importar.
        Se agregarán con estado <strong>Activo</strong>.
      </p>

      {errors.length > 0 && (
        <>
          <p className="mb-1 text-danger">
            <strong>{errors.length}</strong> {errors.length === 1 ? 'fila omitida' : 'filas omitidas'}:
          </p>
          <ul className="import-errors">
            {errors.slice(0, MAX_LISTED_ERRORS).map(({ row, message }) => (
              <li key={row}>Fila {row}: {message}</li>
            ))}
            {errors.length > MAX_LISTED_ERRORS && (
              <li>…y {errors.length - MAX_LISTED_ERRORS} más.</li>
            )}
          </ul>
        </>
      )}

      {error && <p role="alert" className="text-danger small mt-3 mb-0">{error}</p>}
    </Modal>
  );
}