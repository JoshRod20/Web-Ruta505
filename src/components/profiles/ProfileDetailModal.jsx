import { useState } from 'react';
import Modal from '../common/Modal';
import { UserIcon } from '../icons/ProfileIcons';
import { VERIFICATION_STATUS } from '../../constants/firestoreSchema';
import { ACTOR_TYPE_LABELS, PROFILE_DETAIL_FIELDS } from '../../constants/profiles';

const { pending, approved, rejected } = VERIFICATION_STATUS;

const STATUS_VIEW = {
  [pending]: { title: 'En revisión', badge: 'Perfil enviado para revisión' },
  [approved]: { title: 'Activo', badge: 'Perfil aprobado' },
  [rejected]: { title: 'Rechazado', badge: 'Perfil rechazado' },
};

// Botones del pie según el estado de la cuenta: [izquierda, derecha].
const STATUS_ACTIONS = {
  [pending]: ['reject', 'approve'],
  [approved]: ['reject', 'pending'],
  [rejected]: ['pending', 'approve'],
};

const BUTTONS = {
  reject: { label: 'Rechazar perfil', className: 'btn btn-r505-orange' },
  pending: { label: 'Pasar a pendiente', busyLabel: 'Moviendo…', className: 'btn btn-outline-secondary' },
  approve: { label: 'Aprobar perfil', busyLabel: 'Aprobando…', className: 'btn btn-r505' },
};

/**
 * Perfil ampliado. `onAction(action, profile)` es asíncrono y decide qué hacer
 * ('approve' | 'reject' | 'pending'); si lanza un error, se muestra aquí.
 */
export default function ProfileDetailModal({ profile, onAction, onClose }) {
  const status = profile.estado;
  const view = STATUS_VIEW[status] ?? STATUS_VIEW[pending];
  const actions = STATUS_ACTIONS[status] ?? STATUS_ACTIONS[pending];

  const [working, setWorking] = useState(null); // acción en curso
  const [error, setError] = useState('');
  const busy = working !== null;

  const handleAction = async (action) => {
    setWorking(action);
    setError('');
    try {
      await onAction(action, profile);
    } catch (err) {
      setError(err.message);
      setWorking(null);
    }
  };

  return (
    <Modal
      title={`Perfil seleccionado - ${view.title}`}
      size="lg"
      busy={busy}
      onClose={onClose}
      footer={
        <div className="profile-modal__footer">
          {actions.map((action) => {
            const { label, busyLabel, className } = BUTTONS[action];
            return (
              <button
                key={action}
                type="button"
                className={className}
                onClick={() => handleAction(action)}
                disabled={busy}
              >
                {working === action ? busyLabel ?? label : label}
              </button>
            );
          })}
        </div>
      }
    >
      <div className="profile-modal__header">
        <span className="profile-modal__avatar"><UserIcon size={64} /></span>
        <div className="profile-modal__identity">
          <h3 className="profile-modal__name">{profile.nombre || 'Sin nombre'}</h3>
          <p className="profile-modal__type">
            Actor Cultural: {ACTOR_TYPE_LABELS[profile.tipoActor] ?? 'Sin clasificar'}
          </p>
          <span className={`profile-modal__status ${status === rejected ? 'is-rejected' : ''}`}>
            {view.badge}
          </span>
        </div>
      </div>

      <h3 className="profile-modal__section">Datos del perfil</h3>
      <dl className="profile-modal__data">
        {PROFILE_DETAIL_FIELDS.map(({ key, label, uppercase }) => (
          <div key={key}>
            <dt>{label}</dt>
            <dd className={uppercase ? 'is-uppercase' : undefined}>{profile[key] || '—'}</dd>
          </div>
        ))}
      </dl>

      <dl className="profile-modal__description">
        <dt>Descripción del negocio</dt>
        <dd>{profile.descripcion || 'Sin descripción.'}</dd>
      </dl>

      {error && <p role="alert" className="text-danger small mt-3 mb-0">{error}</p>}
    </Modal>
  );
}