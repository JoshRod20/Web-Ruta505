import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * - busy: mientras se guarda, no se puede cerrar.
 * - role: usa "alertdialog" para confirmaciones destructivas.
 */
export default function Modal({ title, onClose, children, footer, busy = false, role = 'dialog' }) {
  const titleId = useId();
  const dialogRef = useRef(null);

  // Referencias para que el efecto principal se ejecute una sola vez
  // y no le robe el foco al campo que se está escribiendo.
  const closeRef = useRef(onClose);
  const busyRef = useRef(busy);
  useEffect(() => {
    closeRef.current = onClose;
    busyRef.current = busy;
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const dialog = dialogRef.current;

    // Si un campo ya tiene autoFocus, se respeta.
    if (dialog && !dialog.contains(document.activeElement)) dialog.focus();
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !busyRef.current) closeRef.current();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previouslyFocused?.focus?.();
    };
  }, []);

  // Mantiene el Tab dentro del modal.
  const trapTab = (e) => {
    if (e.key !== 'Tab') return;
    const focusables = dialogRef.current.querySelectorAll(FOCUSABLE);
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && (active === first || active === dialogRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <>
      <div className="modal-backdrop show" />
      <div
        className="modal d-block"
        role="presentation"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget && !busy) onClose();
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            ref={dialogRef}
            className="modal-content r505-modal"
            role={role}
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            onKeyDown={trapTab}
          >
            <div className="modal-header">
              <h2 className="modal-title" id={titleId}>{title}</h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={onClose}
                disabled={busy}
              />
            </div>
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}