import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { addDoc, collection, onSnapshot, query, serverTimestamp, where } from "firebase/firestore";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../styles/Comunidad/MapaNicaraguaStyle.css";
import { db } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";

// Arreglo necesario: los bundlers modernos (Vite/webpack) rompen las
// rutas por defecto de los íconos de Leaflet si no se reasignan así.
import iconoMarcador from "leaflet/dist/images/marker-icon.png";
import iconoMarcador2x from "leaflet/dist/images/marker-icon-2x.png";
import iconoSombra from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: iconoMarcador,
  iconRetinaUrl: iconoMarcador2x,
  shadowUrl: iconoSombra,
});

// Límites aproximados de Nicaragua (con margen), para que el mapa
// no se pueda arrastrar ni alejar fuera del país.
const LIMITES_NICARAGUA = [
  [10.6, -87.9], // suroeste
  [15.1, -82.3], // noreste
];
const CENTRO_NICARAGUA = [12.8654, -85.2072];

// Ícono especial (punto azul) para "mi ubicación en tiempo real".
const iconoUbicacionActual = L.divIcon({
  className: "mapa-mi-ubicacion",
  html: '<div class="mapa-mi-ubicacion__punto"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// Escucha clics en el mapa; solo actúa si el modo actual lo permite.
function CapturarClicks({ activo, onSeleccionar }) {
  useMapEvents({
    click(e) {
      if (activo) {
        onSeleccionar(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

// Mueve la cámara del mapa cuando se solicita centrar en un punto.
function CentrarEnPosicion({ posicion }) {
  const map = useMap();
  useEffect(() => {
    if (posicion) {
      map.flyTo([posicion.lat, posicion.lng], 15);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posicion]);
  return null;
}

const abrirEnGoogleMaps = (lat, lng) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

/**
 * Mapa interactivo reutilizable, acotado a Nicaragua.
 *
 * @param {"seleccionar" | "visualizar" | "explorar"} modo
 *   - "seleccionar": el usuario hace clic para marcar una ubicación (ej. comunidad registrando su ubicación)
 *   - "visualizar": muestra un único punto fijo, sin poder cambiarlo
 *   - "explorar": muestra varios pines a la vez (ej. mapa general de comunidades)
 * @param {{lat, lng} | null} valorInicial - marcador inicial (seleccionar/visualizar)
 * @param {(lat: number, lng: number) => void} onSeleccionar - callback solo en modo "seleccionar"
 * @param {Array<{id, lat, lng, titulo, categoria}>} marcadores - solo en modo "explorar"
 * @param {boolean} mostrarUbicacionActual - activa el punto azul en tiempo real (por defecto true)
 * @param {string} alturaCss - ej. "400px" o "60vh"
 */
const MapaNicaragua = ({
  modo = "visualizar",
  valorInicial = null,
  onSeleccionar,
  marcadores = [],
  mostrarUbicacionActual = true,
  alturaCss = "400px",
}) => {
  const { user, profile } = useAuth();
  const [marcadorSeleccionado, setMarcadorSeleccionado] = useState(valorInicial);
  const [miUbicacion, setMiUbicacion] = useState(null);
  const [errorUbicacion, setErrorUbicacion] = useState("");
  const [centrarSolicitado, setCentrarSolicitado] = useState(null);
  const [puntosCompartidos, setPuntosCompartidos] = useState([]);
  const [rutasCompartidas, setRutasCompartidas] = useState([]);
  const [errorDatos, setErrorDatos] = useState("");
  const [guardandoPunto, setGuardandoPunto] = useState(false);
  const [guardandoRuta, setGuardandoRuta] = useState(false);
  const [nuevoPunto, setNuevoPunto] = useState({ titulo: "", categoria: "general" });
  const [dibujarRuta, setDibujarRuta] = useState(false);
  const [borradorRuta, setBorradorRuta] = useState([]);
  const [formRuta, setFormRuta] = useState({ nombre: "", descripcion: "" });
  const watchIdRef = useRef(null);

  useEffect(() => {
    const qPuntos = query(collection(db, "puntos_mapa"), where("visible", "==", true));
    const qRutas = query(collection(db, "rutas_mapa"), where("visible", "==", true));

    const unsubPuntos = onSnapshot(
      qPuntos,
      (snap) => {
        const items = snap.docs
          .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
          .filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng));
        setPuntosCompartidos(items);
        setErrorDatos("");
      },
      (err) => {
        console.error("Error al leer puntos compartidos:", err);
        setErrorDatos("No se pudieron cargar los puntos compartidos.");
      }
    );

    const unsubRutas = onSnapshot(
      qRutas,
      (snap) => {
        const items = snap.docs
          .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
          .filter((item) => Array.isArray(item.puntos) && item.puntos.length >= 2);
        setRutasCompartidas(items);
      },
      (err) => {
        console.error("Error al leer rutas compartidas:", err);
        setErrorDatos("No se pudieron cargar las rutas compartidas.");
      }
    );

    return () => {
      unsubPuntos();
      unsubRutas();
    };
  }, []);

  // Geolocalización EN TIEMPO REAL: watchPosition, no getCurrentPosition.
  // Se actualiza sola cada vez que el navegador detecta un cambio de posición.
  useEffect(() => {
    if (!mostrarUbicacionActual || !navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setMiUbicacion({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setErrorUbicacion("");
      },
      (err) => {
        console.error(err);
        setErrorUbicacion("No pudimos acceder a tu ubicación en tiempo real.");
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [mostrarUbicacionActual]);

  const handleClickMapa = (lat, lng) => {
    if (dibujarRuta) {
      setBorradorRuta((prev) => [...prev, { lat, lng }]);
      return;
    }

    setMarcadorSeleccionado({ lat, lng });
    if (onSeleccionar) onSeleccionar(lat, lng);
  };

  const guardarPuntoCompartido = async () => {
    if (!marcadorSeleccionado) return;

    if (!user) {
      setErrorDatos("Debes iniciar sesion para guardar puntos.");
      return;
    }

    const tituloLimpio = nuevoPunto.titulo.trim();
    if (!tituloLimpio) {
      setErrorDatos("Escribe un titulo para el punto.");
      return;
    }

    try {
      setGuardandoPunto(true);
      await addDoc(collection(db, "puntos_mapa"), {
        lat: marcadorSeleccionado.lat,
        lng: marcadorSeleccionado.lng,
        titulo: tituloLimpio,
        categoria: nuevoPunto.categoria.trim() || "general",
        creadoPor: user?.uid || null,
        creadoPorNombre:
          profile?.nombreComunidad || profile?.displayName || user?.displayName || user?.email || "usuario",
        visible: true,
        createdAt: serverTimestamp(),
      });
      setNuevoPunto({ titulo: "", categoria: "general" });
      setErrorDatos("");
    } catch (err) {
      console.error("Error al guardar punto:", err);
      setErrorDatos("No se pudo guardar el punto.");
    } finally {
      setGuardandoPunto(false);
    }
  };

  const guardarRutaCompartida = async () => {
    if (borradorRuta.length < 2) {
      setErrorDatos("Agrega al menos 2 puntos para guardar una ruta.");
      return;
    }

    if (!user) {
      setErrorDatos("Debes iniciar sesion para guardar rutas.");
      return;
    }

    const nombreLimpio = formRuta.nombre.trim();
    if (!nombreLimpio) {
      setErrorDatos("Escribe un nombre para la ruta.");
      return;
    }

    try {
      setGuardandoRuta(true);
      await addDoc(collection(db, "rutas_mapa"), {
        nombre: nombreLimpio,
        descripcion: formRuta.descripcion.trim(),
        puntos: borradorRuta.map((p, index) => ({ ...p, orden: index + 1 })),
        creadoPor: user?.uid || null,
        creadoPorNombre:
          profile?.nombreComunidad || profile?.displayName || user?.displayName || user?.email || "usuario",
        visible: true,
        createdAt: serverTimestamp(),
      });
      setBorradorRuta([]);
      setDibujarRuta(false);
      setFormRuta({ nombre: "", descripcion: "" });
      setErrorDatos("");
    } catch (err) {
      console.error("Error al guardar ruta:", err);
      setErrorDatos("No se pudo guardar la ruta.");
    } finally {
      setGuardandoRuta(false);
    }
  };

  return (
    <div className="mapa-nicaragua-wrap">
      <div
        className="mapa-nicaragua-contenedor"
        style={{ height: alturaCss }}
      >
        <MapContainer
          center={valorInicial ? [valorInicial.lat, valorInicial.lng] : CENTRO_NICARAGUA}
          zoom={valorInicial ? 13 : 7}
          minZoom={6}
          maxBounds={LIMITES_NICARAGUA}
          maxBoundsViscosity={1.0}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <CapturarClicks activo={modo === "seleccionar"} onSeleccionar={handleClickMapa} />
          <CentrarEnPosicion posicion={centrarSolicitado} />

          {(modo === "seleccionar" || modo === "visualizar") && marcadorSeleccionado && (
            <Marker position={[marcadorSeleccionado.lat, marcadorSeleccionado.lng]}>
              <Popup>
                Ubicación seleccionada
                <br />
                <button
                  type="button"
                  className="mapa-popup-btn"
                  onClick={() =>
                    abrirEnGoogleMaps(marcadorSeleccionado.lat, marcadorSeleccionado.lng)
                  }
                >
                  Ir a esta ubicación
                </button>
              </Popup>
            </Marker>
          )}

          {modo === "explorar" &&
            marcadores.map((m) => (
              <Marker key={m.id} position={[m.lat, m.lng]}>
                <Popup>
                  <strong>{m.titulo}</strong>
                  {m.categoria && <p>{m.categoria}</p>}
                  <button
                    type="button"
                    className="mapa-popup-btn"
                    onClick={() => abrirEnGoogleMaps(m.lat, m.lng)}
                  >
                    Ir a esta ubicación
                  </button>
                </Popup>
              </Marker>
            ))}

          {puntosCompartidos.map((m) => (
            <Marker key={`punto-${m.id}`} position={[m.lat, m.lng]}>
              <Popup>
                <strong>{m.titulo || "Punto"}</strong>
                {m.categoria && <p>{m.categoria}</p>}
                {m.creadoPorNombre && <p>Publicado por: {m.creadoPorNombre}</p>}
                <button
                  type="button"
                  className="mapa-popup-btn"
                  onClick={() => abrirEnGoogleMaps(m.lat, m.lng)}
                >
                  Ir a esta ubicacion
                </button>
              </Popup>
            </Marker>
          ))}

          {rutasCompartidas.map((ruta) => {
            const posiciones = ruta.puntos.map((p) => [p.lat, p.lng]);
            return (
              <Polyline key={`ruta-${ruta.id}`} positions={posiciones} pathOptions={{ color: "#0f7a65", weight: 4 }}>
                <Popup>
                  <strong>{ruta.nombre || "Ruta"}</strong>
                  {ruta.descripcion && <p>{ruta.descripcion}</p>}
                  {ruta.creadoPorNombre && <p>Creada por: {ruta.creadoPorNombre}</p>}
                </Popup>
              </Polyline>
            );
          })}

          {dibujarRuta && borradorRuta.length >= 2 && (
            <Polyline
              positions={borradorRuta.map((p) => [p.lat, p.lng])}
              pathOptions={{ color: "#ef8a17", weight: 4, dashArray: "8,8" }}
            />
          )}

          {miUbicacion && (
            <Marker position={[miUbicacion.lat, miUbicacion.lng]} icon={iconoUbicacionActual}>
              <Popup>Tu ubicación actual</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <div className="mapa-nicaragua-acciones">
        {errorUbicacion && <p className="mapa-nicaragua-error">{errorUbicacion}</p>}
        {errorDatos && <p className="mapa-nicaragua-error">{errorDatos}</p>}
        {miUbicacion && (
          <button
            type="button"
            className="mapa-nicaragua-btn"
            onClick={() => setCentrarSolicitado({ ...miUbicacion, _t: Date.now() })}
          >
            <i className="bi bi-crosshair" aria-hidden="true" /> Centrar en mi ubicación
          </button>
        )}
        {modo === "seleccionar" && marcadorSeleccionado && (
          <p className="mapa-nicaragua-coords">
            Lat: {marcadorSeleccionado.lat.toFixed(5)}, Lng:{" "}
            {marcadorSeleccionado.lng.toFixed(5)}
          </p>
        )}

        {modo === "seleccionar" && marcadorSeleccionado && !dibujarRuta && (
          <div className="mapa-panel">
            <input
              type="text"
              className="mapa-input"
              placeholder="Titulo del punto"
              value={nuevoPunto.titulo}
              onChange={(e) => setNuevoPunto((prev) => ({ ...prev, titulo: e.target.value }))}
            />
            <input
              type="text"
              className="mapa-input"
              placeholder="Categoria"
              value={nuevoPunto.categoria}
              onChange={(e) => setNuevoPunto((prev) => ({ ...prev, categoria: e.target.value }))}
            />
            <button
              type="button"
              className="mapa-nicaragua-btn"
              disabled={guardandoPunto}
              onClick={guardarPuntoCompartido}
            >
              {guardandoPunto ? "Guardando..." : "Guardar punto publico"}
            </button>
          </div>
        )}

        {modo === "seleccionar" && (
          <div className="mapa-panel">
            <button
              type="button"
              className="mapa-nicaragua-btn"
              onClick={() => {
                setDibujarRuta((prev) => !prev);
                if (dibujarRuta) {
                  setBorradorRuta([]);
                  setFormRuta({ nombre: "", descripcion: "" });
                }
              }}
            >
              {dibujarRuta ? "Cancelar ruta" : "Crear ruta"}
            </button>

            {dibujarRuta && (
              <>
                <input
                  type="text"
                  className="mapa-input"
                  placeholder="Nombre de la ruta"
                  value={formRuta.nombre}
                  onChange={(e) => setFormRuta((prev) => ({ ...prev, nombre: e.target.value }))}
                />
                <input
                  type="text"
                  className="mapa-input"
                  placeholder="Descripcion corta"
                  value={formRuta.descripcion}
                  onChange={(e) => setFormRuta((prev) => ({ ...prev, descripcion: e.target.value }))}
                />
                <p className="mapa-nicaragua-coords">Puntos en ruta: {borradorRuta.length}</p>
                <button
                  type="button"
                  className="mapa-nicaragua-btn"
                  onClick={() => setBorradorRuta((prev) => prev.slice(0, -1))}
                  disabled={borradorRuta.length === 0}
                >
                  Deshacer ultimo punto
                </button>
                <button
                  type="button"
                  className="mapa-nicaragua-btn"
                  onClick={guardarRutaCompartida}
                  disabled={guardandoRuta}
                >
                  {guardandoRuta ? "Guardando ruta..." : "Guardar ruta publica"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapaNicaragua;