import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { COLLECTIONS } from '../constants/firestoreSchema';
import { INVENTORY_STATUS } from '../constants/inventory';

const BATCH_SIZE = 400; // Firestore admite hasta 500 escrituras por lote

const pickFields = (values) => ({
  nombre: values.nombre,
  categoria: values.categoria,
  departamento: values.departamento,
  municipio: values.municipio,
});

const inventoryRef = () => collection(db, COLLECTIONS.inventory);

// Tiempo real: se llama a `onData` con la lista completa en cada cambio,
// ordenada por fecha de registro (el más antiguo primero).
export function subscribeInventory(onData, onError) {
  const q = query(inventoryRef(), orderBy('createdAt', 'asc'));
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

// Un dato nuevo siempre nace activo.
export function addInventoryItem(values, uid) {
  return addDoc(inventoryRef(), {
    ...pickFields(values),
    estado: INVENTORY_STATUS.active,
    creadoPor: uid,
    createdAt: serverTimestamp(),
  });
}

export function updateInventoryItem(id, values) {
  return updateDoc(doc(db, COLLECTIONS.inventory, id), {
    ...pickFields(values),
    estado: values.estado,
    updatedAt: serverTimestamp(),
  });
}

export function deleteInventoryItem(id) {
  return deleteDoc(doc(db, COLLECTIONS.inventory, id));
}

// Importa en lotes. Cada fila lleva un milisegundo más que la anterior
// para conservar el orden del archivo.
export async function importInventoryItems(rows, uid) {
  const base = Date.now();

  for (let start = 0; start < rows.length; start += BATCH_SIZE) {
    const batch = writeBatch(db);

    rows.slice(start, start + BATCH_SIZE).forEach((row, index) => {
      batch.set(doc(inventoryRef()), {
        ...pickFields(row),
        estado: INVENTORY_STATUS.active,
        creadoPor: uid,
        createdAt: Timestamp.fromMillis(base + start + index),
      });
    });

    await batch.commit();
  }
}