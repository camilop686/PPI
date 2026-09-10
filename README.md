# PPI · Prevención de Virus

PPI es una plataforma educativa para aprender métodos fiables de prevención de
amenazas informáticas. La aplicación permite consultar información sobre
prevención y virus, participar en una comunidad moderada y gestionar el contenido
desde un panel protegido para administradores.

## Capturas de pantalla

Las capturas de la aplicación pueden añadirse aquí cuando el equipo defina la
versión visual que desea presentar.

## Tecnologías usadas

- React 19
- Vite
- React Router
- Supabase Auth, Database y Storage
- `@supabase/supabase-js`
- `lucide-react`
- ESLint

## Requisitos

- Node.js 20 o una versión compatible con Vite
- `pnpm`
- Un proyecto de Supabase

## Instalación y ejecución

Clona el repositorio e instala las dependencias:

```bash
git clone <URL_DEL_REPOSITORIO>
cd PPI
pnpm install
```

Configura Supabase siguiendo la sección [Configuración de Supabase](#configuración-de-supabase),
y después inicia el servidor de desarrollo:

```bash
pnpm dev
```

Para comprobar el proyecto antes de publicarlo:

```bash
pnpm lint
pnpm build
pnpm preview
```

## Variables de entorno

En la raíz del proyecto, crea un archivo `.env` a partir de `.env.example`:

```bash
cp .env.example .env
```

Completa los valores con la URL de tu proyecto y la clave pública `anon` de
Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-publica-anon
```

No incluyas claves reales en el README ni en el repositorio. Nunca uses la clave
`service_role` en el frontend.

## Configuración de Supabase

1. Crea un proyecto en Supabase.
2. En **SQL Editor**, ejecuta [`supabase/schema.sql`](supabase/schema.sql). Este
	archivo crea perfiles, catálogos, comentarios, políticas RLS y datos
	educativos iniciales.
3. Ejecuta las migraciones en orden:
	[`001-admin-users.sql`](supabase/migrations/001-admin-users.sql),
	[`002-forum.sql`](supabase/migrations/002-forum.sql),
	[`003-profile-role-policy.sql`](supabase/migrations/003-profile-role-policy.sql)
	y [`004-forum-social-immediate.sql`](supabase/migrations/004-forum-social-immediate.sql).
4. Registra una cuenta desde la aplicación. Para habilitar el panel de
	administración, cambia de forma controlada su `role` a `admin` en Supabase.
5. Crea los buckets `forum-images` y `avatars` y aplica sus políticas siguiendo
	[`STORAGE_SETUP.md`](STORAGE_SETUP.md).

La cuenta administradora puede gestionar métodos de prevención, amenazas y
contenido pendiente de moderación. Las políticas RLS de Supabase son la
autoridad final de seguridad; las restricciones de la interfaz no las
sustituyen.

## Funcionalidades

- [x] Registro, inicio de sesión y recuperación de contraseña
- [x] Persistencia y renovación de sesión con Supabase Auth
- [x] Catálogo filtrable de métodos de prevención
- [x] Catálogo filtrable de amenazas informáticas
- [x] Edición del nombre y foto de perfil
- [x] Publicaciones y respuestas en la comunidad
- [x] Imágenes para publicaciones, respuestas y avatares
- [x] Moderación de contenido por administradores
- [x] CRUD de métodos y amenazas desde el panel administrativo
- [x] Rutas protegidas según autenticación y rol

## Estructura del proyecto

```text
src/
├── App.jsx                  # Rutas, sesión y vistas principales
├── main.jsx                 # Punto de entrada de React
├── App.css                  # Estilos de la aplicación
├── components/              # Componentes heredados y reutilizables
└── lib/supabase.js          # Cliente y configuración de Supabase
supabase/
├── schema.sql               # Esquema inicial, RLS y datos de ejemplo
└── migrations/              # Cambios posteriores de base de datos
docs/
└── GUIA-FUNCIONALIDADES.md  # Responsabilidad de módulos y reglas de mantenimiento
STORAGE_SETUP.md              # Configuración de buckets y políticas de Storage
```

La navegación, autenticación, autorización por rol, catálogo, comunidad, perfil
y administración activa se encuentran en `src/App.jsx`. La guía de módulos
documenta qué componentes heredados se conservan por compatibilidad.

## Seguridad

- Las credenciales se leen mediante variables `VITE_*` y no deben guardarse en
  `.env` dentro del repositorio.
- Row Level Security limita los perfiles a su propietario, el contenido de
  administración a administradores y los comentarios a su autor o moderación.
- El frontend sanitiza el contenido visible, pero la seguridad real depende de
  las políticas y funciones definidas en Supabase.
- La eliminación de usuarios de Supabase Auth no se hace desde el navegador,
  porque requiere `service_role`; si se necesita, debe implementarse con una
  Edge Function protegida.

## Documentación adicional

- [Guía de funcionalidades](docs/GUIA-FUNCIONALIDADES.md)
- [Configuración de Supabase Storage](STORAGE_SETUP.md)
- [Esquema de base de datos](supabase/schema.sql)

## Autores

- Juan Camilo Pineda Cortes
- Ronald Steven Zapata

## Licencia

Este proyecto es académico. Añade aquí la licencia elegida por el equipo si se
publicará para reutilización.
