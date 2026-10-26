import { useEffect, useRef, useState } from 'react';
import { STATUS_LABELS } from '../../constants/inventory';

const POP_MS = 500;

export default function StatusBadge({ status }) {
  const previous = useRef(status);
  const [changed, setChanged] = useState(false);

  // Dispara el "pop" solo cuando el estado cambia, no en el primer render.
  useEffect(() => {
    if (previous.current === status) return undefined;

    previous.current = status;
    setChanged(true);
    const timer = setTimeout(() => setChanged(false), POP_MS);
    return () => clearTimeout(timer);
  }, [status]);

  return (
    <span className={`status-badge status-badge--${status} ${changed ? 'status-badge--changed' : ''}`}>
      <span className="status-badge__dot" aria-hidden="true" />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}