import { ACTOR_TYPES } from '../../constants/profiles';

/**
 * Los cuatro botones de tipo de actor.
 * - counts: solicitudes pendientes por tipo (círculo naranja). Si es null, no se muestran.
 */
export default function ProfileTabs({ selected, onSelect, counts = null }) {
  return (
    <div className="profile-tabs" role="group" aria-label="Tipo de actor cultural">
      {ACTOR_TYPES.map(({ value, label }) => {
        const count = counts?.[value] ?? 0;
        const isSelected = selected === value;

        return (
          <button
            key={value}
            type="button"
            className={`profiles-pill ${isSelected ? 'is-selected' : ''}`}
            aria-pressed={isSelected}
            onClick={() => onSelect(value)}
          >
            {label}
            {count > 0 && (
              <span className="profile-tabs__badge">
                {count}
                <span className="visually-hidden"> pendientes</span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}