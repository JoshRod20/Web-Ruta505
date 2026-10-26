import { useState } from 'react';
import Modal from './Modal';

/**
 * Confirmación genérica. `onConfirm` hace el trabajo y cierra el modal si todo sale bien;
 * si falla, el error se muestra aquí. `onClose` se usa solo para cancelar.
 */
export default function ConfirmModal({
  title,
  children,
  confirmLabel = 'Confirmar',
  confirmClassName = 'btn btn-r505',
  onConfirm,
  onClose,
}) {
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setWorking(true);
    setError('');
    try {
      await onConfirm();
    } catch (err) {
      setError(err.message);
      setWorking(false);
    }
  };

  return (
    <Modal
      title={title}
      role="alertdialog"
      busy={working}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={working}>
            Cancelar
          </button>
          <button type="button" className={confirmClassName} onClick={handleConfirm} disabled={working}>
            {working ? 'Procesando…' : confirmLabel}
          </button>
        </>
      }
    >
      {children}
      {error && <p role="alert" className="text-danger small mt-3 mb-0">{error}</p>}
    </Modal>
  );
}