import { useMemo, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import SearchInput from '../../components/common/SearchInput';
import ConfirmModal from '../../components/common/ConfirmModal';
import ProfileTabs from '../../components/profiles/ProfileTabs';
import ProfileCard from '../../components/profiles/ProfileCard';
import ProfileDetailModal from '../../components/profiles/ProfileDetailModal';
import { CloseIcon } from '../../components/icons/NavIcons';
import useProfiles from '../../hooks/useProfiles';
import useNotice from '../../hooks/useNotice';
import { VERIFICATION_STATUS } from '../../constants/firestoreSchema';
import { ACTOR_TYPES, ACTOR_TYPE_LABELS } from '../../constants/profiles';
import { normalizeText } from '../../utils/text';

// Qué lista se está viendo.
const MODES = { pending: 'pending', active: 'active', rejected: 'rejected' };

const PENDING_EMPTY = 'No hay solicitudes pendientes en esta categoría';

// Botones que abren cada lista; se cierran con la ×.
const MODE_BUTTONS = [
  { mode: MODES.active, label: 'Cuentas activas', className: 'profiles-pill--accounts' },
  { mode: MODES.rejected, label: 'Rechazados', className: 'profiles-pill--rejected' },
];

// Textos de las dos listas con buscador.
const LIST_TEXT = {
  [MODES.active]: {
    searchLabel: 'Buscar entre las cuentas activas',
    one: 'cuenta activa',
    many: 'cuentas activas',
    empty: 'Aún no hay cuentas activas.',
    noMatch: 'No encontramos cuentas activas con esos criterios.',
  },
  [MODES.rejected]: {
    searchLabel: 'Buscar entre las cuentas rechazadas',
    one: 'cuenta rechazada',
    many: 'cuentas rechazadas',
    empty: 'No hay cuentas rechazadas.',
    noMatch: 'No encontramos cuentas rechazadas con esos criterios.',
  },
};

// Las tres acciones sobre una cuenta. `confirm` define el texto del modal de confirmación.
const ACTIONS = {
  approve: {
    method: 'approve',
    success: (profile) => `Perfil de «${profile.nombre}» aprobado.`,
  },
  reject: {
    method: 'reject',
    success: (profile) => `Perfil de «${profile.nombre}» rechazado.`,
    confirm: {
      title: 'Rechazar perfil',
      confirmLabel: 'Sí, rechazar',
      confirmClassName: 'btn btn-r505-orange',
      message: (profile) => (
        <>
          <p className="mb-2">
            ¿Seguro que quieres rechazar el perfil de <strong>{profile.nombre}</strong>?
          </p>
          <p className="text-muted small mb-0">
            {profile.estado === VERIFICATION_STATUS.approved
              ? 'La cuenta dejará de estar aprobada y no podrá publicar contenido en la app.'
              : 'La solicitud saldrá de la lista de pendientes y la cuenta no tendrá acceso como actor cultural.'}{' '}
            Podrás revisarla de nuevo en Rechazados.
          </p>
        </>
      ),
    },
  },
  pending: {
    method: 'returnToPending',
    success: (profile) => `El perfil de «${profile.nombre}» volvió a las solicitudes pendientes.`,
    confirm: {
      title: 'Pasar a pendiente',
      confirmLabel: 'Sí, pasar a pendiente',
      confirmClassName: 'btn btn-r505',
      message: (profile) => (
        <>
          <p className="mb-2">
            ¿Seguro que quieres devolver a revisión el perfil de <strong>{profile.nombre}</strong>?
          </p>
          <p className="text-muted small mb-0">
            La cuenta no podrá publicar contenido en la app hasta que se apruebe de nuevo.
          </p>
        </>
      ),
    },
  },
};

// Rechazar siempre pide confirmación. Pasar a pendiente solo si la cuenta está activa,
// porque en ese caso pierde su acceso.
const needsConfirmation = (action, profile) =>
  action === 'reject' ||
  (action === 'pending' && profile.estado === VERIFICATION_STATUS.approved);

// Texto sobre el que busca el input.
const searchableText = (profile) =>
  normalizeText(
    [
      profile.nombre,
      profile.departamento,
      profile.municipio,
      profile.telefono,
      profile.turismo,
      ACTOR_TYPE_LABELS[profile.tipoActor],
    ].join(' ')
  );

export default function ProfilesPage() {
  const profiles = useProfiles();
  const { notice, success: notifySuccess, error: notifyError } = useNotice();

  const [mode, setMode] = useState(MODES.pending);
  const [pendingType, setPendingType] = useState(null); // tipo elegido en solicitudes
  const [typeFilter, setTypeFilter] = useState(null); // filtro en activas y rechazados (null = todos)
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState(null);
  // { type: 'detail', profile } | { type: 'confirm', action, profile, from }
  const [modal, setModal] = useState(null);

  const closeModal = () => setModal(null);
  const isPendingMode = mode === MODES.pending;
  const listText = LIST_TEXT[mode];

  // Mientras nadie elija, se muestra la primera categoría que tenga solicitudes.
  const currentPendingType =
    pendingType ??
    ACTOR_TYPES.find(({ value }) => profiles.pendingCounts[value])?.value ??
    ACTOR_TYPES[0].value;

const items = useMemo(() => {
  if (mode === MODES.pending) {
    return (profiles.pending ?? []).filter((p) => p.tipoActor === currentPendingType);
  }

  const source = (mode === MODES.active ? profiles.active : profiles.rejected) ?? [];
  const term = normalizeText(search);
  return source.filter(
    (p) => (!typeFilter || p.tipoActor === typeFilter) && (!term || searchableText(p).includes(term))
  );
}, [mode, profiles.pending, profiles.active, profiles.rejected, currentPendingType, typeFilter, search]);

  // Abrir una lista; si ya está abierta, se cierra y vuelven las solicitudes.
  // Cambiar de lista limpia el filtro y la búsqueda.
  const toggleMode = (target) => {
    setMode((current) => (current === target ? MODES.pending : target));
    setTypeFilter(null);
    setSearch('');
  };

  const handleSelectType = (type) => {
    if (isPendingMode) setPendingType(type);
    else setTypeFilter((current) => (current === type ? null : type));
  };

  // ---- Acciones sobre una cuenta ----
  const runAction = async (action, profile) => {
    await profiles[ACTIONS[action].method](profile.id);
    notifySuccess(ACTIONS[action].success(profile));
  };

  // Si hace falta confirmar, abre el aviso; si no, ejecuta la acción de inmediato.
  const requestAction = async (action, profile, from = null) => {
    if (needsConfirmation(action, profile)) {
      setModal({ type: 'confirm', action, profile, from });
      return;
    }
    await runAction(action, profile);
  };

  const approveFromCard = async (profile) => {
    setBusyId(profile.id);
    try {
      await runAction('approve', profile);
    } catch (err) {
      notifyError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  // Acciones del modal ampliado; si la acción termina sin confirmación, el modal se cierra.
  const handleDetailAction = async (action, profile) => {
    await requestAction(action, profile, modal);
    if (!needsConfirmation(action, profile)) closeModal();
  };

  const handleConfirm = async () => {
    await runAction(modal.action, modal.profile);
    closeModal();
  };

  // ---- Contenido de la lista ----
  let content;
  if (profiles.loading) {
    content = <p className="profiles__message">Cargando perfiles…</p>;
  } else if (items.length === 0) {
    let emptyText = PENDING_EMPTY;
    if (!isPendingMode) {
      emptyText = search.trim() || typeFilter ? listText.noMatch : listText.empty;
    }
    content = <p className="profiles__message">{emptyText}</p>;
  } else {
    content = (
      <div className="profile-grid">
        {items.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            busy={busyId === profile.id}
            showType={!isPendingMode}
            onView={(selected) => setModal({ type: 'detail', profile: selected })}
            onApprove={isPendingMode ? approveFromCard : undefined}
            onReject={isPendingMode ? (selected) => requestAction('reject', selected) : undefined}
          />
        ))}
      </div>
    );
  }

  // El modal muestra siempre la versión más reciente del perfil (tiempo real).
  const detailProfile =
    modal?.type === 'detail'
      ? profiles.all.find((p) => p.id === modal.profile.id) ?? modal.profile
      : null;

  const confirmation = modal?.type === 'confirm' ? ACTIONS[modal.action].confirm : null;

  return (
    <>
      <PageHeader
        title="Gestión de perfiles"
        subtitle="Verificación del perfil de cada actor cultural registrado en Ruta 505."
      />

      {profiles.error && (
        <div className="alert alert-warning d-flex align-items-center justify-content-between gap-3" role="alert">
          <span>{profiles.error}</span>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={profiles.reload}>
            Reintentar
          </button>
        </div>
      )}

      {notice && (
        <div className={`alert alert-${notice.type}`} role={notice.type === 'danger' ? 'alert' : 'status'}>
          {notice.text}
        </div>
      )}

      <div className="profiles__controls">
        {MODE_BUTTONS.map(({ mode: target, label, className }) => {
          const isOpen = mode === target;
          return (
            <button
              key={target}
              type="button"
              className={`profiles-pill ${className} ${isOpen ? 'is-open' : ''}`}
              aria-pressed={isOpen}
              aria-label={`${isOpen ? 'Cerrar' : 'Ver'} ${label.toLowerCase()}`}
              onClick={() => toggleMode(target)}
            >
              {label}
              {isOpen && <CloseIcon size={18} />}
            </button>
          );
        })}

        {!isPendingMode && (
          <SearchInput
            id="profiles-search"
            label={listText.searchLabel}
            value={search}
            onChange={setSearch}
          />
        )}
      </div>

      <ProfileTabs
        selected={isPendingMode ? currentPendingType : typeFilter}
        onSelect={handleSelectType}
        counts={isPendingMode ? profiles.pendingCounts : null}
      />

      {!isPendingMode && !profiles.loading && (
        <p className="profiles__count" aria-live="polite">
          {items.length} {items.length === 1 ? listText.one : listText.many}
        </p>
      )}

      {content}

      {modal?.type === 'detail' && (
        <ProfileDetailModal profile={detailProfile} onAction={handleDetailAction} onClose={closeModal} />
      )}

      {confirmation && (
        <ConfirmModal
          title={confirmation.title}
          confirmLabel={confirmation.confirmLabel}
          confirmClassName={confirmation.confirmClassName}
          onConfirm={handleConfirm}
          onClose={() => setModal(modal.from)} // cancelar regresa al perfil si venías de ahí
        >
          {confirmation.message(modal.profile)}
        </ConfirmModal>
      )}
    </>
  );
}