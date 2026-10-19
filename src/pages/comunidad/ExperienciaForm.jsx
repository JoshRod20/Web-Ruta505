import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/firebase";
import { usePermisos } from "../../hooks/usePermisos";
import { PERMISOS } from "../../constants/permissions";
import { mapFirebaseError } from "../../utils/firebaseErrors";
import "../../styles/comunidad/ExperienciaStyle.css";

/**
 * Formulario de alta de experiencia cultural (Comunidad).
 * Campos según la especificación funcional (sección 4.2 del documento
 * de propuesta): título, descripción, categoría y ubicación exacta.
 *
 * Todo el flujo de Firebase (guardar en Firestore) vive dentro de
 * este mismo componente, igual que en los demás formularios del
 * proyecto — sin service externo.
 *
 * La lista de categorías y el permiso PUBLICAR_EXPERIENCIA salen del
 * catálogo de rutas/permisos del proyecto Ruta 505.
 *
 * Nota: esta página todavía no está conectada en AppRouter. Cuando se
 * agregue la ruta (ej. "/comunidad/experiencias/nueva"), conviene
 * envolverla también con <RequireAuth roles={[ROLES.ACTOR_CULTURAL]}>.
 */

// Catálogo de categorías tomado del flujo de experiencias culturales del proyecto.
const CATEGORIAS = [
  { value: "historia", label: "Historia y patrimonio" },
  { value: "naturaleza", label: "Naturaleza y aventura" },
  { value: "gastronomia", label: "Gastronomía" },
  { value: "artesania", label: "Artesanía y oficios" },
  { value: "musica-danza", label: "Música y danza" },
  { value: "tradicion-oral", label: "Tradición oral y leyendas" },
  { value: "festividad", label: "Festividad patronal o religiosa" },
];

const initialForm = {
  titulo: "",
  categoria: CATEGORIAS[0].value,
  descripcion: "",
  ubicacionExacta: "",
};

const ExperienciaForm = () => {
  const { puede } = usePermisos();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [publicado, setPublicado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validación mínima de campos obligatorios antes de tocar Firestore.
    if (!form.titulo || !form.descripcion || !form.ubicacionExacta) {
      setError("Completa título, descripción y ubicación exacta.");
      return;
    }

    try {
      setCargando(true);

      await addDoc(collection(db, "experiencias"), {
        titulo: form.titulo,
        categoria: form.categoria,
        descripcion: form.descripcion,
        ubicacionExacta: form.ubicacionExacta,
        createdAt: serverTimestamp(),
      });

      // Cuando Firestore responde bien, limpiamos el formulario y mostramos confirmación.
      setPublicado(true);
      setForm(initialForm);
    } catch (err) {
      console.error("Error al guardar experiencia:", err);

      const mensaje = mapFirebaseError(err.code);
      if (mensaje === "Ocurrió un error. Inténtalo de nuevo.") {
        setError(`Error al guardar experiencia: ${err.code || err.message || "desconocido"}`);
      } else {
        setError(mensaje);
      }
    } finally {
      setCargando(false);
    }
  };

  // Guard de UI: si el rol logueado no puede publicar experiencias
  // (ej. es un turista que llegó acá por URL directa), no se muestra
  // el formulario. La protección real de la ruta se hace con
  // RequireAuth cuando se conecte en AppRouter.
  if (!puede(PERMISOS.PUBLICAR_EXPERIENCIA)) {
    return (
      <div className="experiencia-page">
        <div className="experiencia-shell">
          <div className="experiencia-header">
            <h1 className="experiencia-header__title">Acceso no disponible</h1>
            <p className="experiencia-header__subtitle">
              Solo comunidades, artesanos, guías o emprendedores pueden
              publicar experiencias.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="experiencia-page">
      <div className="experiencia-shell">
        <div className="experiencia-header">
          <h1 className="experiencia-header__title">Publica una experiencia cultural</h1>
          <p className="experiencia-header__subtitle">
            Comparte un recorrido, taller o vivencia de tu comunidad
          </p>
        </div>

        <div className="experiencia-card">
  
          {publicado ? (
            <div className="experiencia-form">
              <p className="experiencia-feedback">
                Tu experiencia se publicó correctamente.
              </p>
              <button
                type="button"
                className="experiencia-submit"
                onClick={() => setPublicado(false)}
              >
                Publicar otra experiencia
              </button>
            </div>
          ) : (
            <form className="experiencia-form" onSubmit={handleSubmit}>
              <input
                className="experiencia-input"
                type="text"
                name="titulo"
                placeholder="Título de la experiencia"
                value={form.titulo}
                onChange={handleChange}
                required
              />

              <select
                className="experiencia-select"
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
              >
                {CATEGORIAS.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <textarea
                className="experiencia-textarea"
                name="descripcion"
                placeholder="Descripción de la experiencia"
                value={form.descripcion}
                onChange={handleChange}
                required
              />

              <input
                className="experiencia-input"
                type="text"
                name="ubicacionExacta"
                placeholder="Ubicación exacta (dirección o punto de referencia)"
                value={form.ubicacionExacta}
                onChange={handleChange}
                required
              />

              {error && <p className="experiencia-error">{error}</p>}

              <button className="experiencia-submit" type="submit" disabled={cargando}>
                {cargando ? "Publicando..." : "Publicar experiencia"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienciaForm;