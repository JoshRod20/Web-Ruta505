import { ROLES } from "./roles";

/**
 * Catálogo de permisos de Ruta 505.
 *
 * Se basa en la matriz de funcionalidades por rol del documento de
 * propuesta (sección 4: Turistas / Comunidades / Artesanos / Guías /
 * Emprendedores / INTUR). La idea: el turista tiene permisos de solo
 * lectura + interacción personal (favoritos, calificar, escanear QR),
 * el actor cultural (comunidad, artesano, guía, emprendedor) puede
 * publicar y gestionar su propio contenido, e INTUR aprueba, verifica
 * y modera.
 *
 * IMPORTANTE: esto es para permisos a nivel de UI (mostrar/ocultar un
 * botón, una acción, un ítem de menú dentro de un componente
 * compartido como el Navbar). La protección real de datos siempre
 * debe reforzarse también en las reglas de Firestore/Storage — esto
 * no reemplaza eso, solo evita que el turista *vea* acciones que no
 * le corresponden.
 */

export const PERMISOS = {
  // Comunes a cualquier usuario logueado (turista incluido)
  VER_MAPA: "ver_mapa",
  VER_EXPERIENCIAS: "ver_experiencias",
  USAR_PINOLITO: "usar_pinolito",

  // Exclusivos del turista
  GUARDAR_FAVORITOS: "guardar_favoritos",
  CALIFICAR_EXPERIENCIA: "calificar_experiencia",
  ESCANEAR_QR: "escanear_qr",
  VER_PASAPORTE: "ver_pasaporte",

  // Actor cultural (comunidad / artesano / guía / emprendedor)
  CREAR_PERFIL_ACTOR: "crear_perfil_actor",
  PUBLICAR_EXPERIENCIA: "publicar_experiencia", // incluye tour, producto o evento según actorType
  GENERAR_QR_EXPERIENCIA: "generar_qr_experiencia",
  VER_ESTADISTICAS_PROPIAS: "ver_estadisticas_propias",

  // INTUR (institución)
  APROBAR_PERFILES: "aprobar_perfiles",
  OTORGAR_VERIFICACION: "otorgar_verificacion",
  MODERAR_CONTENIDO: "moderar_contenido",
  VER_ESTADISTICAS_GENERALES: "ver_estadisticas_generales",
  EXPORTAR_REPORTES: "exportar_reportes",
};

const PERMISOS_POR_ROL = {
  [ROLES.TURISTA]: [
    PERMISOS.VER_MAPA,
    PERMISOS.VER_EXPERIENCIAS,
    PERMISOS.USAR_PINOLITO,
    PERMISOS.GUARDAR_FAVORITOS,
    PERMISOS.CALIFICAR_EXPERIENCIA,
    PERMISOS.ESCANEAR_QR,
    PERMISOS.VER_PASAPORTE,
  ],

  [ROLES.ACTOR_CULTURAL]: [
    PERMISOS.VER_MAPA,
    PERMISOS.VER_EXPERIENCIAS,
    PERMISOS.USAR_PINOLITO,
    PERMISOS.CREAR_PERFIL_ACTOR,
    PERMISOS.PUBLICAR_EXPERIENCIA,
    PERMISOS.GENERAR_QR_EXPERIENCIA,
    PERMISOS.VER_ESTADISTICAS_PROPIAS,
  ],

  [ROLES.INSTITUCION]: [
    PERMISOS.VER_MAPA,
    PERMISOS.VER_EXPERIENCIAS,
    PERMISOS.APROBAR_PERFILES,
    PERMISOS.OTORGAR_VERIFICACION,
    PERMISOS.MODERAR_CONTENIDO,
    PERMISOS.VER_ESTADISTICAS_GENERALES,
    PERMISOS.EXPORTAR_REPORTES,
  ],
};

/**
 * @param {string|null} role - uno de ROLES (viene de useAuth().role)
 * @param {string} permiso - uno de PERMISOS
 */
export const tienePermiso = (role, permiso) =>
  Boolean(PERMISOS_POR_ROL[role]?.includes(permiso));