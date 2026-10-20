import { useState } from 'react';

function EyeIcon({ off }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
      {off && <line x1="3" y1="3" x2="21" y2="21" />}
    </svg>
  );
}

export default function PasswordField({ id, label, value, onChange, ...rest }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="r505-field r505-field--icon">
      <label htmlFor={id} className="visually-hidden">{label}</label>
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        className="form-control"
        placeholder={label}
        value={value}
        onChange={onChange}
        {...rest}
      />
      <button
        type="button"
        className="r505-field__toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        <EyeIcon off={visible} />
      </button>
    </div>
  );
}