import SceneClouds from './SceneClouds';

/**
 * Layout de dos paneles usado por Bienvenida e Inicio de sesión.
 * - scene: contenido del panel izquierdo (ilustración)
 * - clouds: lista de nubes del panel izquierdo (ver constants/sceneClouds.js)
 * - children: contenido del panel derecho
 * - sceneCols: columnas de Bootstrap (de 12) para el panel izquierdo
 */
export default function SplitLayout({ scene, clouds, children, sceneCols = 6 }) {
  return (
    <main className="container-fluid p-0">
      <div className="row g-0 min-vh-100">
        <aside className={`col-md-${sceneCols} d-none d-md-block split__scene`}>
          <SceneClouds clouds={clouds} />
          {scene}
        </aside>
        <section className={`col-12 col-md-${12 - sceneCols} split__content`}>
          {children}
        </section>
      </div>
    </main>
  );
}