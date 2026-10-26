export default function TextField({ id, label, value, onChange, type = 'text', ...rest }) {
  return (
    <div className="r505-field">
      <label htmlFor={id} className="visually-hidden">{label}</label>
      <input
        id={id}
        type={type}
        className="form-control"
        placeholder={label}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </div>
  );
}