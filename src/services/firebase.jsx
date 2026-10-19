// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwzL-hLoWpblezYIYlIJXNkPaTAAdXlZ8",
  authDomain: "ruta505.firebaseapp.com",
  projectId: "ruta505",
  storageBucket: "ruta505.firebasestorage.app",
  messagingSenderId: "65945086045",
  appId: "1:65945086045:web:36e92b414a14b744fe45b4",
  measurementId: "G-ELKCD18NDZ"
};

// Initialize Firebase
// Initialize Firebase
const appfirebase = initializeApp(firebaseConfig);

let db;
try {
  db = initializeFirestore(appfirebase, {
    localCache: persistentLocalCache({
      cacheSizeBytes: 100 * 1024 * 1024, // 100 MB (opcional, para limitar tamaño)
    }),
  });
  console.log("Firestore inicializado con persistencia offline.");
} catch (error) {
  console.error("Error al inicializar Firestore con persistencia:", error);
  // Fallback: inicializar sin persistencia si falla
  db = initializeFirestore(appfirebase, {});
}

//Inicializa autenticación 
const auth = getAuth(appfirebase);

// Inicializa Storage
const storage = getStorage(appfirebase);

export { appfirebase, db, auth, storage };
