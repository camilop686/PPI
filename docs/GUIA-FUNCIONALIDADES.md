# Guía de funcionalidades

Esta guía documenta la responsabilidad de cada módulo y sirve como registro de mantenimiento. Cuando se agregue una funcionalidad, debe actualizarse la sección correspondiente en el mismo cambio.

## Aplicación React

| Módulo | Responsabilidad |
| --- | --- |
| `src/main.jsx` | Monta `App` dentro del elemento `root` y activa `StrictMode`. |
| `src/App.jsx` | Define las rutas principales y conecta sesión + layout sin concentrar la lógica de negocio. |
| `src/components/` | Contiene layout, mensajes de estado, protección de rutas y elementos visuales reutilizables. |
| `src/hooks/useAuthSession.js` | Obtiene la sesión inicial, escucha cambios de autenticación y carga el perfil actual. |
| `src/lib/supabase.js` | Lee las variables de entorno, indica si Supabase está configurado y crea el cliente con sesión persistente. |
| `src/pages/` | Separa las vistas de acceso, catálogos, comunidad, perfil y administración. |
| `src/services/` | Centraliza consultas de autenticación, perfil, comunidad, catálogos y administración. |
| `src/utils/` | Sanitiza texto, normaliza búsquedas y traduce errores técnicos a mensajes claros en español. |
| `src/components/Login.jsx` | Componente heredado de acceso local de prueba; no forma parte de las rutas activas de `App.jsx`. |
| `src/components/MenuAdmin.jsx` | Menú administrativo heredado; sus acciones son visuales y no sustituyen el panel conectado a Supabase. |
| `src/components/MenuUsuario.jsx` | Menú de usuario heredado; se conserva para compatibilidad con la versión anterior. |
| `src/components/MetodosPrevencion.jsx` | Catálogo estático heredado; el catálogo actual se carga desde Supabase mediante `Catalogue`. |

## Flujo de acceso

`useAuthSession` obtiene la sesión inicial y escucha cambios de autenticación. `AccessPage` permite iniciar sesión, registrarse, solicitar recuperación de contraseña y restablecerla con mensajes entendibles. `ProtectedRoute` redirige a `/acceso` si no hay sesión y bloquea `/admin` para perfiles que no tengan `role = 'admin'`.

## Contenido y comunidad

`CataloguePage` carga métodos o amenazas, ofrece búsqueda insensible a mayúsculas/minúsculas y filtro por categoría o nivel. `CommunityPage` sanitiza el texto antes de insertarlo, muestra estados de moderación y publica aportes con estado `pending`; `AdminPage` permite que un administrador apruebe, rechace o elimine publicaciones y respuestas. `ProfilePage` solo actualiza el nombre del usuario autenticado.

## Administración

`AdminCollection` reutiliza el mismo formulario para crear, editar y eliminar métodos o amenazas. Las políticas RLS de Supabase siguen siendo la autoridad final: el frontend no debe considerarse un límite de seguridad.

## Base de datos

`supabase/schema.sql` crea perfiles, catálogos, comentarios, funciones, disparadores, políticas RLS y datos iniciales. `supabase/migrations/001-admin-users.sql` añade la función segura para cambiar roles y `supabase/migrations/002-forum.sql` habilita publicaciones/respuestas moderadas. `.github/workflows/supabase.yml` deja preparado el despliegue de migraciones con GitHub Secrets.

## Regla de actualización

Cada nueva ruta, componente, consulta, acción administrativa o regla de seguridad debe incluir en el mismo cambio:

1. Un comentario breve junto al código que controla la funcionalidad.
2. Una actualización de esta guía en la tabla o sección apropiada.
3. Una comprobación con `npm run lint` y `npm run build`.
