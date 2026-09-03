# Guía de funcionalidades

Esta guía documenta la responsabilidad de cada módulo y sirve como registro de mantenimiento. Cuando se agregue una funcionalidad, debe actualizarse la sección correspondiente en el mismo cambio.

## Aplicación React

| Módulo | Responsabilidad |
| --- | --- |
| `src/main.jsx` | Monta `App` dentro del elemento `root` y activa `StrictMode`. |
| `src/App.jsx` | Define navegación, sesión, autorización por rol y todas las vistas principales. |
| `src/lib/supabase.js` | Lee las variables de entorno, indica si Supabase está configurado y crea el cliente con sesión persistente. |
| `src/components/Login.jsx` | Componente heredado de acceso local de prueba; no forma parte de las rutas activas de `App.jsx`. |
| `src/components/MenuAdmin.jsx` | Menú administrativo heredado; sus acciones son visuales y no sustituyen el panel conectado a Supabase. |
| `src/components/MenuUsuario.jsx` | Menú de usuario heredado; se conserva para compatibilidad con la versión anterior. |
| `src/components/MetodosPrevencion.jsx` | Catálogo estático heredado; el catálogo actual se carga desde Supabase mediante `Catalogue`. |

## Flujo de acceso

`AuthProvider` obtiene la sesión inicial y escucha cambios de autenticación. `Access` permite iniciar sesión, registrarse y solicitar recuperación de contraseña. `Protected` redirige a `/acceso` si no hay sesión y bloquea `/admin` para perfiles que no tengan `role = 'admin'`.

## Contenido y comunidad

`Catalogue` carga métodos o amenazas y filtra cualquier campo visible mediante el buscador. `Community` sanitiza el texto antes de insertarlo y publica aportes con estado `pending`; `Moderation` permite que un administrador los apruebe o rechace. `Profile` solo actualiza el nombre del usuario autenticado.

## Administración

`AdminCollection` reutiliza el mismo formulario para crear, editar y eliminar métodos o amenazas. Las políticas RLS de Supabase siguen siendo la autoridad final: el frontend no debe considerarse un límite de seguridad.

## Base de datos

`supabase/schema.sql` crea perfiles, catálogos, comentarios, funciones, disparadores, políticas RLS y datos iniciales. `supabase/migrations/001-admin-users.sql` añade la función segura para cambiar roles. Cualquier cambio de tabla, política o función debe documentarse aquí y en el SQL correspondiente.

## Regla de actualización

Cada nueva ruta, componente, consulta, acción administrativa o regla de seguridad debe incluir en el mismo cambio:

1. Un comentario breve junto al código que controla la funcionalidad.
2. Una actualización de esta guía en la tabla o sección apropiada.
3. Una comprobación con `pnpm lint` y `pnpm build`.
