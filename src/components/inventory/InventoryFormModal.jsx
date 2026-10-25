import { useState } from 'react';
import Modal from '../common/Modal';
import { INVENTORY_FIELDS, STATUS_OPTIONS } from '../../constants/inventory';
import { cleanText } from '../../utils/text';
import { validateInventoryFields } from '../../utils/validators';

const FORM_ID = 'inventory-form';

function initialValues(item) {
  const values = Object.fromEntries(
    INVENTORY_FIELDS.map(({ key }) => [key, item?.[key] ?? ''])
  );
  return item ? { ...values, estado: item.estado } : values;
}

export default function InventoryFormModal({ item = null, onSubmit, onClose }) {
  const isEdit = Boolean(item);
  const [values, setValues] = useState(() => initialValues(item));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (key) => (event) => {
    setValues((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleaned = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, key === 'estado' ? value : cleanText(value)])
    );

    const validation = validateInventoryFields(cleaned, { withStatus: isEdit });
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setSaving(true);
    setSubmitError('');
    try {
      await onSubmit(cleaned);
      onClose();
    } catch (err) {
      setSubmitError(err.message);
      setSaving(false);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Editar dato' : 'Agregar dato'}
      busy={saving}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </button>
          <button type="submit" form={FORM_ID} className="btn btn-r505" disabled={saving}>
            {saving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Agregar'}
          </button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} noValidate>
        {INVENTORY_FIELDS.map(({ key, label, maxLength }, index) => (
          <div className="r505-field mb-3" key={key}>
            <label htmlFor={`inventory-${key}`} className="form-label">{label}</label>
            <input
              id={`inventory-${key}`}
              type="text"
              className={`form-control ${errors[key] ? 'is-invalid' : ''}`}
              value={values[key]}
              onChange={handleChange(key)}
              maxLength={maxLength}
              autoFocus={index === 0}
              aria-invalid={Boolean(errors[key])}
            />
            {errors[key] && <div className="invalid-feedback d-block">{errors[key]}</div>}
          </div>
        ))}

        {isEdit && (
          <div className="r505-field mb-1">
            <label htmlFor="inventory-estado" className="form-label">Estado</label>
            <select
              id="inventory-estado"
              className={`form-select ${errors.estado ? 'is-invalid' : ''}`}
              value={values.estado}
              onChange={handleChange('estado')}
            >
              {STATUS_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {errors.estado && <div className="invalid-feedback d-block">{errors.estado}</div>}
          </div>
        )}

        {submitError && <p role="alert" className="text-danger small mt-3 mb-0">{submitError}</p>}
      </form>
    </Modal>
  );
}