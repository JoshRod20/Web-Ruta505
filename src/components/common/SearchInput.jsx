import { searchIcon } from '../../constants/icons';

export default function SearchInput({ id, label, value, onChange, placeholder = 'Buscar', className = '' }) {
  return (
    <div className={`search-input ${className}`}>
      <img src={searchIcon} alt="" className="search-input__icon" />
      <label htmlFor={id} className="visually-hidden">{label}</label>
      <input
        id={id}
        type="search"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}