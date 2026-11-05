import { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { getDisplayName, getRoleLabel } from "../../utils/userDisplay";

export default function UserBadge() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const badgeRef = useRef(null);

  if (!user) return null;

  const name = getDisplayName(user);
  const role = getRoleLabel(user);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleOutsideClick = (event) => {
      if (
        badgeRef.current &&
        !badgeRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="user-badge" ref={badgeRef}>
      <button
        type="button"
        className="user-badge__avatar"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={`Perfil de ${name}. Mostrar información de la cuenta`}
        aria-expanded={isOpen}
        aria-controls="user-badge-popover"
      >
        {name.charAt(0).toUpperCase()}
      </button>

      <div className="user-badge__info">
        <span className="user-badge__name">{name}</span>
        <span className="user-badge__role">{role}</span>
      </div>

      {isOpen && (
        <div
          id="user-badge-popover"
          className="user-badge__popover"
          role="status"
        >
          <span className="user-badge__popover-name">
            {name}
          </span>

          <span className="user-badge__popover-role">
            {role}
          </span>
        </div>
      )}
    </div>
  );
}