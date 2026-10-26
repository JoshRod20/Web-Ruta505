import { useCallback, useEffect, useState } from 'react';
import useAuth from './useAuth';
import {
  addInventoryItem,
  deleteInventoryItem,
  importInventoryItems,
  subscribeInventory,
  updateInventoryItem,
} from '../services/inventoryService';
import { mapFirestoreError } from '../utils/firestoreErrors';

export default function useInventory() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  // Tiempo real: Firestore empuja cada alta, cambio o baja.
  useEffect(() => {
    setLoading(true);
    setError('');

    return subscribeInventory(
      (list) => {
        setItems(list);
        setLoading(false);
      },
      (err) => {
        console.error('[inventory]', err);
        setError(mapFirestoreError(err));
        setLoading(false);
      }
    );
  }, [attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  // Ejecuta una acción y convierte cualquier error en un mensaje legible.
  const run = useCallback(async (action) => {
    try {
      return await action();
    } catch (err) {
      console.error('[inventory]', err);
      throw new Error(mapFirestoreError(err));
    }
  }, []);

  const addItem = useCallback((values) => run(() => addInventoryItem(values, user.uid)), [run, user]);
  const updateItem = useCallback((id, values) => run(() => updateInventoryItem(id, values)), [run]);
  const removeItem = useCallback((id) => run(() => deleteInventoryItem(id)), [run]);
  const importItems = useCallback((rows) => run(() => importInventoryItems(rows, user.uid)), [run, user]);

  return { items, loading, error, reload, addItem, updateItem, removeItem, importItems };
}