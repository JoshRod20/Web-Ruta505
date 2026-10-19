# Ruta 505

Descubre la Cultura junto a Pinolito

Plataforma web progresiva (PWA) que conecta a turistas con comunidades, artesanos y guías locales, ofreciendo recomendaciones culturales personalizadas a través de Pinolito, un asistente conversacional impulsado por la API de Claude.

Desarrollado por el equipo Cuajada Salvaje para Hackathon Nicaragua 2026.

---

## Tabla de contenido

1. [Descripción general](#descripción-general)
2. [Arquitectura](#arquitectura)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Stack tecnológico](#stack-tecnológico)
5. [Instalación](#instalación)
6. [Variables de entorno](#variables-de-entorno)
7. [Scripts disponibles](#scripts-disponibles)
8. [Dependencias principales](#dependencias-principales)
9. [Servicios y ejemplos de uso (endpoints internos)](#servicios-y-ejemplos-de-uso-endpoints-internos)
10. [Roles de usuario](#roles-de-usuario)
11. [Control de versiones](#control-de-versiones)

---

## Descripción general

Ruta 505 es una PWA ligera pensada para funcionar incluso con conectividad limitada, típica de zonas rurales o comunitarias. No tiene un backend propio: usa Firebase como backend-as-a-service (autenticación, base de datos y hosting) y consume la API de Claude para dar vida a Pinolito, el asistente virtual que recomienda experiencias, narra el significado histórico de los lugares y responde preguntas frecuentes de los turistas.

## Arquitectura

**Nombre de la arquitectura:** Arquitectura en capas con organización por características (*Layered + Feature-based Architecture*).

- **Por capas:** separa responsabilidades técnicas en carpetas independientes (`components`, `services`, `context`, `hooks`, `utils`).
- **Por características:** agrupa las pantallas en `pages/` según el rol de usuario (turista, comunidad, artesano, guía, INTUR) en lugar de mezclarlas todas juntas.

Este enfoque híbrido combina la claridad de una capa técnica (saber dónde vive la lógica de un tipo) con la facilidad de encontrar todo lo relacionado a una vista concreta.

### Arquitectura de alto nivel

El frontend (**React + Vite**, empaquetado como PWA) contiene dos zonas internas —las vistas por rol y la interfaz de Pinolito— y se comunica con dos servicios externos:

| Servicio | Función |
|---|---|
| **Firebase** | Autenticación, base de datos en tiempo real (Firestore) y hosting de la aplicación |
| **API de Claude** | Motor de inteligencia artificial detrás de Pinolito, el asistente conversacional |

```
┌─────────────────────────────────────────────┐
│              Ruta 505 (PWA)                  │
│   React + Vite · Bootstrap · Tailwind CSS    │
│                                               │
│  ┌───────────────┐      ┌──────────────────┐ │
│  │  Vistas por    │      │   Interfaz de    │ │
│  │  rol (pages/)  │      │   Pinolito       │ │
│  └───────────────┘      └──────────────────┘ │
└───────────────┬───────────────┬───────────────┘
                │               │
       ┌────────▼──────┐ ┌──────▼─────────┐
       │   Firebase     │ │   API Claude   │
       │ (Auth/Firestore│ │  (Anthropic)   │
       │   / Hosting)   │ │                │
       └────────────────┘ └────────────────┘
```

## Estructura del proyecto

```
ruta505/
├── public/
│   ├── favicon.ico
│   ├── manifest.json          # configuración PWA (íconos, nombre, colores)
│   └── icons/                 # íconos para instalación en pantalla de inicio
│
├── src/
│   ├── assets/                # imágenes, ilustraciones, fuentes
│   │   └── images/
│   │
│   ├── components/            # componentes reutilizables de UI
│   │   ├── common/            # botones, cards, inputs, modales genéricos
│   │   ├── layout/             # navbar, footer, sidebar
│   │   └── pinolito/           # chat, burbujas de mensaje, avatar del mascota
│   │
│   ├── pages/                 # una carpeta por vista/rol (nivel de ruta)
│   │   ├── turista/
│   │   ├── comunidad/
│   │   ├── artesano/
│   │   ├── guia/
│   │   └── intur/
│   │
│   ├── routes/
│   │   └── AppRouter.jsx      # define todas las rutas de la app
│   │
│   ├── services/              # conexión con servicios externos
│   │   ├── firebase.js        # inicialización de Firebase (auth, firestore)
│   │   ├── claudeApi.js       # llamadas a la API de Claude (Pinolito)
│   │   └── experiencias.js    # funciones CRUD de experiencias/reservas
│   │
│   ├── context/               # estado global (React Context)
│   │   ├── AuthContext.jsx
│   │   └── UserContext.jsx
│   │
│   ├── hooks/                 # hooks personalizados
│   │   ├── useAuth.js
│   │   └── usePinolito.js
│   │
│   ├── utils/                 # funciones auxiliares (formatos, validaciones)
│   │
│   ├── styles/                # Tailwind config + overrides de Bootstrap
│   │   └── index.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env                        # llaves de Firebase y Claude (no subir a Git)
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

**Justificación de la organización:**

- `pages/`: agrupa las vistas por rol de usuario (turista, comunidad, artesano, guía, INTUR), así cualquiera del equipo ubica la vista que busca sin pensarlo.
- `components/pinolito/`: aísla todo lo relacionado al asistente de IA, separado del resto de la interfaz.
- `services/`: es la única capa que habla con Firebase y con la API de Claude; si cambia una llave o un endpoint, se modifica un solo archivo.
- `context/` y `hooks/`: mantienen el estado de sesión y de Pinolito accesible desde cualquier componente sin pasar props en cascada.
- `.env`: guarda las credenciales sensibles (Firebase, Claude) fuera del código fuente y del control de versiones.

## Stack tecnológico

| Categoría | Tecnología | Uso en Ruta 505 |
|---|---|---|
| Lenguaje | JavaScript (ES6+) | Base para todo el frontend y la lógica de integración con servicios externos |
| Framework | React + Vite | Interfaz de usuario de la PWA; hot reload rápido y build optimizado |
| Estilos (base) | Bootstrap | Grid, componentes prediseñados (botones, tarjetas, modales, navegación), diseño responsivo |
| Estilos (ajustes) | Tailwind CSS | Ajustes finos de espaciado y personalización de marca sobre Bootstrap |
| Backend as a Service | Firebase (Firestore, Authentication, Hosting) | Autenticación, base de datos en tiempo real, hosting |
| Inteligencia artificial | API de Claude (Anthropic) | Motor conversacional de Pinolito |

> Justificación completa de cada elección (y de las alternativas descartadas) disponible en `Definicion_Tecnologias_Ruta505.docx`.

## Instalación

### Requisitos previos

- Node.js 18 o superior
- npm o yarn
- Cuenta de Firebase con un proyecto creado (Auth + Firestore habilitados)
- API key de Anthropic (Claude)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/JoshRod20/Ruta505.git
cd ruta505

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# completar los valores según la sección "Variables de entorno"

# 4. Levantar el entorno de desarrollo
npm run dev
```

## Variables de entorno

Todas las llaves sensibles viven en `.env` (no se sube a Git). Vite expone al cliente solo las variables con prefijo `VITE_`.

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# API de Claude (Pinolito)
VITE_ANTHROPIC_API_KEY=
VITE_ANTHROPIC_MODEL=claude-sonnet-4-6
```

> ⚠️ **Nota de seguridad:** exponer la API key de Anthropic directamente en el cliente es aceptable para el alcance de un MVP de hackathon, pero antes de producción se recomienda mover las llamadas a `claudeApi.js` detrás de una función serverless (Firebase Cloud Functions) para no exponer la llave en el bundle del navegador.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo con hot reload (Vite) |
| `npm run build` | Genera el build de producción optimizado en `/dist` |
| `npm run preview` | Sirve localmente el build de producción para pruebas finales |
| `npm run lint` | Corre ESLint sobre el código fuente |

## Dependencias principales

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.26.0",
    "firebase": "^10.13.0",
    "bootstrap": "^5.3.0",
    "@anthropic-ai/sdk": "^0.27.0"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "vite-plugin-pwa": "^0.20.0",
    "eslint": "^9.9.0"
  }
}
```

## Servicios y ejemplos de uso (endpoints internos)

Ruta 505 **no expone un backend REST propio**: `services/` es la capa que centraliza toda comunicación externa. Estas funciones actúan como los "endpoints" internos de la aplicación.

### `services/firebase.js` — Autenticación y datos

```js
import { signUp, signIn, logOut } from "./services/firebase";

// Registrar un nuevo usuario (turista, comunidad, artesano, guía o INTUR)
await signUp({ email, password, role: "turista" });

// Iniciar sesión
const user = await signIn({ email, password });

// Cerrar sesión
await logOut();
```

### `services/experiencias.js` — CRUD de experiencias y reservas

```js
import { getExperiencias, createReserva } from "./services/experiencias";

// Obtener experiencias culturales disponibles, filtradas por comunidad
const experiencias = await getExperiencias({ comunidad: "Masaya" });

// Crear una reserva para una experiencia
await createReserva({
  experienciaId: "exp_0032",
  turistaId: user.uid,
  fecha: "2026-08-15",
  personas: 2,
});
```

### `services/claudeApi.js` — Pinolito (IA conversacional)

```js
import { sendMessageToPinolito } from "./services/claudeApi";

const respuesta = await sendMessageToPinolito({
  mensaje: "¿Qué experiencias culturales hay cerca de Masaya?",
  historial: chatHistory,
});

console.log(respuesta.texto);
// → "Cerca de Masaya puedes visitar el mercado artesanal y..."
```

## Roles de usuario

| Rol | Descripción |
|---|---|
| **Turista** | Explora experiencias, conversa con Pinolito y realiza reservas |
| **Comunidad** | Publica experiencias culturales locales |
| **Artesano** | Muestra y gestiona sus productos/talleres |
| **Guía** | Ofrece y administra recorridos guiados |
| **INTUR** | Supervisa y valida el contenido cultural/turístico de la plataforma |

## Control de versiones

- Flujo de trabajo con ramas organizadas por función (`feature/`, `fix/`, `hotfix/`)
- Commits siguiendo [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`...)
- Cambios integrados vía Pull Request con revisión antes de mergear a `main`

---

**Equipo:** SlytherCode · Hackathon Nicaragua 2026 · hN10
