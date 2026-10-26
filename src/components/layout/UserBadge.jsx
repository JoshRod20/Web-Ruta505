import useAuth from '../../hooks/useAuth';
import { getDisplayName, getRoleLabel } from '../../utils/userDisplay';

export default function UserBadge() {
  const { user } = useAuth();
  if (!user) return null;

  const name = getDisplayName(user);

  return (
    <div className="user-badge">
      <span className="user-badge__avatar" aria-hidden="true">
        {name.charAt(0).toUpperCase()}
      </span>
      <div className="user-badge__info">
        <span className="user-badge__name">{name}</span>
        <span className="user-badge__role">{getRoleLabel(user)}</span>
      </div>
    </div>
  );
}