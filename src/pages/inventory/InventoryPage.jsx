import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import InventoryTable from '../../components/inventory/InventoryTable';
import InventoryFormModal from '../../components/inventory/InventoryFormModal';
import ConfirmDeleteModal from '../../components/inventory/ConfirmDeleteModal';
import ImportModal from '../../components/inventory/ImportModal';
import useAuth from '../../hooks/useAuth';
import useInventory from '../../hooks/useInventory';
import { INVENTORY_SUBTITLES, STATUS_LABELS } from '../../constants/inventory';
import { searchIcon } from '../../constants/icons';
import { parseInventoryFile } from '../../utils/inventoryExcel';
import { normalizeText } from '../../utils/text';

const NOTICE_MS = 5000;

export default function InventoryPage() {
  const { isMainAdmin } = useAuth();
  const inventory = useInventory();

  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // { type: 'create' | 'edit' | 'delete' | 'import', ... }
  const [notice, setNotice] = useState(null); // { type: 'success' | 'danger', text }
  const fileInputRef = useRef(null);

  const closeModal = useCallback(() => setModal(null), []);

  // Los avisos desaparecen solos.
  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(null), NOTICE_MS);
    return () => clearTimeout(timer);
  }, [notice]);

  // El N° es la posición por orden de registro; se calcula antes de filtrar.
  const numbered = useMemo(
    () => inventory.items.map((item, index) => ({ ...item, numero: index + 1 })),
    [inventory.items]
  );

  const rows = useMemo(() => {
    const term = normalizeText(search);
    if (!term) return numbered;

    return numbered.filter((item) =>
      normalizeText(
        [item.nombre, item.categoria, item.departamento, item.municipio, STATUS_LABELS[item.estado]].join(' ')
      ).includes(term)
    );
  }, [numbered, search]);

  const emptyMessage = search.trim()
    ? `No encontramos resultados para «${search.trim()}».`
    : 'Aún no hay datos en el inventario. Agrega un dato o selecciona un archivo.';

  const showSuccess = (text) => setNotice({ type: 'success', text });

  const handleAdd = async (values) => {
    await inventory.addItem(values);
    showSuccess('Dato agregado al inventario.');
  };

  const handleUpdate = async (id, values) => {
    await inventory.updateItem(id, values);
    showSuccess('Dato actualizado.');
  };

  const handleDelete = async (id) => {
    await inventory.removeItem(id);
    showSuccess('Dato eliminado.');
  };

  const handleImport = async (valid) => {
    await inventory.importItems(valid);
    showSuccess(`Se importaron ${valid.length} ${valid.length === 1 ? 'dato' : 'datos'}.`);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // permite volver a elegir el mismo archivo
    if (!file) return;

    setNotice(null);
    try {
      setModal({ type: 'import', result: await parseInventoryFile(file) });
    } catch (err) {
      setNotice({ type: 'danger', text: err.message });
    }
  };

  return (
    <>
      <PageHeader
        title="Inventario"
        subtitle={isMainAdmin ? INVENTORY_SUBTITLES.admin : INVENTORY_SUBTITLES.intur}
    />  

      {inventory.error && (
        <div className="alert alert-warning d-flex align-items-center justify-content-between gap-3" role="alert">
          <span>{inventory.error}</span>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={inventory.reload}>
            Reintentar
          </button>
        </div>
      )}

      {notice && (
        <div
          className={`alert alert-${notice.type}`}
          role={notice.type === 'danger' ? 'alert' : 'status'}
        >
          {notice.text}
        </div>
      )}

      <div className="inventory__toolbar">
        <div className="inventory__search">
          <img src={searchIcon} alt="" className="inventory__search-icon" />
          <label htmlFor="inventory-search" className="visually-hidden">Buscar en el inventario</label>
          <input
            id="inventory-search"
            type="search"
            className="form-control"
            placeholder="Buscar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="inventory__actions">
          <button type="button" className="btn btn-r505" onClick={() => setModal({ type: 'create' })}>
            Agrega un dato
          </button>
          <button type="button" className="btn btn-r505" onClick={() => fileInputRef.current?.click()}>
            + Seleccionar archivo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <InventoryTable
        rows={rows}
        loading={inventory.loading}
        emptyMessage={emptyMessage}
        onEdit={(item) => setModal({ type: 'edit', item })}
        onDelete={(item) => setModal({ type: 'delete', item })}
      />

      {modal?.type === 'create' && <InventoryFormModal onSubmit={handleAdd} onClose={closeModal} />}

      {modal?.type === 'edit' && (
        <InventoryFormModal
          item={modal.item}
          onSubmit={(values) => handleUpdate(modal.item.id, values)}
          onClose={closeModal}
        />
      )}

      {modal?.type === 'delete' && (
        <ConfirmDeleteModal
          item={modal.item}
          onConfirm={() => handleDelete(modal.item.id)}
          onClose={closeModal}
        />
      )}

      {modal?.type === 'import' && (
        <ImportModal
          result={modal.result}
          onConfirm={() => handleImport(modal.result.valid)}
          onClose={closeModal}
        />
      )}
    </>
  );
}