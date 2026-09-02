# PPI · Prevención de Virus

Plataforma educativa React + Vite para aprender métodos fiables de prevención de amenazas informáticas. Incluye autenticación Supabase, catálogo filtrable, comunidad moderada y rutas protegidas por rol.

## Inicio

1. Crea un proyecto en Supabase y, en **SQL Editor**, ejecuta [`supabase/schema.sql`](supabase/schema.sql).
2. Copia `.env.example` como `.env` y completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (la clave pública anon).
3. Registra una cuenta y promociónala a administradora con la sentencia final del esquema.
4. Instala dependencias con `pnpm install`, inicia con `pnpm dev` y valida con `pnpm build`.

## Seguridad

Las credenciales no se incluyen en el repositorio. Row Level Security limita perfiles a su propietario, contenido de administración a administradores y comentarios a su autor o moderación. No uses una `service_role` en el frontend.

## Estado verificado

La autenticación, persistencia de sesión, rutas protegidas, lectura de catálogos, edición de perfil, publicación de comentarios y moderación/CRUD de métodos y amenazas usan el cliente de Supabase. El panel administrativo requiere que la cuenta tenga `role = 'admin'`. Después del esquema inicial, ejecuta también [`001-admin-users.sql`](supabase/migrations/001-admin-users.sql) para habilitar cambios de rol seguros. La eliminación de usuarios de Auth no se realiza desde el navegador porque exige `service_role`; debe implementarse con una Edge Function protegida si se requiere.

## Arquitectura

`src/App.jsx` contiene las rutas y vistas; `src/lib/supabase.js` inicializa el cliente; `supabase/schema.sql` define tablas, disparador de perfil, RLS y datos iniciales educativos.
