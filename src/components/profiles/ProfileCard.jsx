import { SubArrowIcon } from '../icons/ProfileIcons';
import { PROFILE_CARD_FIELDS } from '../../constants/profiles';

/**
 * Tarjeta de un perfil. Los botones Rechazar y Aprobar solo aparecen
 * si se pasan `onApprove` y `onReject` (solicitudes pendientes).
 */
export default function ProfileCard({ profile, busy = false, onView, onApprove, onReject }) {
  const hasActions = Boolean(onApprove && onReject);

  return (
    <article className="profile-card">
      <dl className="profile-card__fields">
        {PROFILE_CARD_FIELDS.map(({ key, label, uppercase }) => (
          <div className="profile-card__field" key={key}>
            <dt>{label}:</dt>
            <dd className={uppercase ? 'is-uppercase' : undefined}>
              <SubArrowIcon />
              <span>{profile[key] || '—'}</span>
            </dd>
          </div>
        ))}
      </dl>

      <button type="button" className="profile-card__more" onClick={() => onView(profile)}>
        Ver más<span className="visually-hidden"> de {profile.nombre}</span>
      </button>

      {hasActions && (
        <div className="profile-card__actions">
          <button type="button" className="btn btn-r505-orange" onClick={() => onReject(profile)} disabled={busy}>
            Rechazar
          </button>
          <button type="button" className="btn btn-r505" onClick={() => onApprove(profile)} disabled={busy}>
            {busy ? 'Aprobando…' : 'Aprobar'}
          </button>
        </div>
      )}
    </article>
  );
}