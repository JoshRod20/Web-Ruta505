import { useState } from 'react';
import Modal from '../common/Modal';

export default function ConfirmDeleteModal({ item, onConfirm, onClose }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setDeleting(true);
    setError('');
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  return (
    <Modal
      title="Eliminar dato"
      role="alertdialog"
      busy={deleting}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={deleting}>
            Cancelar
          </button>
          <button type="button" className="btn btn-danger" onClick={handleConfirm} disabled={deleting}>
            {deleting ? 'Eliminando…' : 'Sí, eliminar'}
          </button>
        </>
      }
    >
      <p className="mb-2">
        ¿Seguro que quieres eliminar <strong>{item.nombre}</strong> del inventario?
      </p>
      <p className="text-muted small mb-0">Esta acción no se puede deshacer.</p>
      {error && <p role="alert" className="text-danger small mt-3 mb-0">{error}</p>}
    </Modal>
  );
}