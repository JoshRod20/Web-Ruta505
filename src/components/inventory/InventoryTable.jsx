import StatusBadge from './StatusBadge';
import { deleteIcon, editIcon } from '../../constants/icons';

const COLUMNS = ['N°', 'Nombre del negocio', 'Categoría', 'Departamento', 'Municipio', 'Estado'];
const TOTAL_COLUMNS = COLUMNS.length + 1; // + acciones

export default function InventoryTable({ rows, loading, emptyMessage, onEdit, onDelete }) {
  return (
    <div className="inventory-table-wrap">
      <table className="inventory-table" aria-label="Inventario turístico" aria-busy={loading}>
        <thead>
          <tr>
            {COLUMNS.map((label, index) => (
              <th key={label} scope="col" className={index === 0 ? 'inventory-table__number' : undefined}>
                {label}
              </th>
            ))}
            <th scope="col">
              <span className="visually-hidden">Acciones</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan={TOTAL_COLUMNS} className="inventory-table__message">
                Cargando inventario…
              </td>
            </tr>
          )}

          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={TOTAL_COLUMNS} className="inventory-table__message">
                {emptyMessage}
              </td>
            </tr>
          )}

          {!loading &&
            rows.map((item) => (
              <tr key={item.id}>
                <td className="inventory-table__number">{item.numero}</td>
                <td>{item.nombre}</td>
                <td>{item.categoria}</td>
                <td>{item.departamento}</td>
                <td>{item.municipio}</td>
                <td><StatusBadge status={item.estado} /></td>
                <td className="inventory-table__actions">
                  <button
                    type="button"
                    className="icon-btn"
                    title="Editar"
                    aria-label={`Editar ${item.nombre}`}
                    onClick={() => onEdit(item)}
                  >
                    <img src={editIcon} alt="" />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    title="Eliminar"
                    aria-label={`Eliminar ${item.nombre}`}
                    onClick={() => onDelete(item)}
                  >
                    <img src={deleteIcon} alt="" />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}