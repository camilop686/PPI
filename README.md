# PPI · Prevención de Virus

Plataforma educativa escolar construida con React + Vite + Supabase para enseñar prevención de amenazas informáticas mediante autenticación, catálogo educativo, comunidad moderada, perfil y panel administrativo protegido.

## Problema que resuelve

El proyecto ayuda a estudiantes a reconocer amenazas comunes, aprender métodos fiables de prevención y participar en una comunidad moderada sin exponer datos sensibles ni permisos administrativos.

## Tecnologías

- React 19
- Vite 8
- Supabase (`auth`, base de datos PostgreSQL, políticas RLS)
- React Router
- Lucide React
- ESLint

## Funcionalidades principales

### Usuario normal

- Registro, inicio de sesión, cierre de sesión y recuperación de contraseña.
- Persistencia de sesión.
- Consulta de amenazas y métodos de prevención.
- Búsqueda y filtros en catálogos.
- Creación de publicaciones y respuestas en comunidad.
- Edición del propio perfil.

### Administrador

- Acceso protegido a `/admin`.
- CRUD de amenazas y métodos de prevención.
- Moderación de publicaciones y respuestas pendientes.
- Eliminación de contenido cuando corresponda.

## Estructura del proyecto

```text
src/
├── components/
├── hooks/
├── lib/
├── pages/
├── services/
├── utils/
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

- `src/services/`: consultas Supabase separadas por dominio.
- `src/pages/`: vistas de acceso, comunidad, catálogos, perfil y administración.
- `src/hooks/useAuthSession.js`: sesión persistente + carga de perfil.
- `src/utils/`: sanitización y mensajes de error en español.

## Configuración local

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Copia `.env.example` como `.env`.
3. Completa solo estas variables:
   ```env
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   ```
4. Inicia el proyecto:
   ```bash
   npm run dev
   ```

## Configuración de Supabase

### Archivos revisados

- `supabase/schema.sql`
- `supabase/migrations/001-admin-users.sql`
- `supabase/migrations/002-forum.sql`

### Tablas actuales

- `profiles`
- `prevention_methods`
- `threats`
- `comments`
- `forum_posts`
- `forum_replies`

### Roles

- `user`
- `admin`

El rol vive en `profiles.role` y el frontend nunca envía cambios de rol desde el perfil. Los cambios administrativos de rol se realizan con la función `public.admin_set_role(...)`.

### Migraciones / orden recomendado

1. Ejecuta `supabase/schema.sql`.
2. Ejecuta `supabase/migrations/001-admin-users.sql`.
3. Ejecuta `supabase/migrations/002-forum.sql`.

> No se incluyen secretos ni `service_role` en el frontend.

## Seguridad y RLS

- `profiles`: lectura autenticada y actualización solo del propio perfil, manteniendo el mismo `role`.
- `prevention_methods` y `threats`: lectura de contenido publicado; administración solo para `admin`.
- `forum_posts` y `forum_replies`: lectura de contenido aprobado o propio; creación propia en estado `pending`; moderación administrativa vía RLS.
- `comments`: se conserva como recurso heredado moderado por RLS.

## Variables de entorno

Nunca subas claves reales al repositorio. La clave permitida en frontend es únicamente la pública `anon`.

## GitHub Actions → Supabase

Se añadió `.github/workflows/supabase.yml` para aplicar migraciones al hacer `push` a `main` cuando cambie `supabase/**`.

### Secrets necesarios

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_ID`
- `SUPABASE_DB_PASSWORD`

El workflow:

1. instala Supabase CLI;
2. valida los secrets;
3. enlaza el proyecto;
4. ejecuta `supabase db push --linked --include-all`.

## Comandos de verificación

```bash
npm run build
npm run lint
```

## Limitaciones conocidas

- La ejecución real de migraciones automáticas depende de que el propietario configure los secrets del repositorio.
- Desde este entorno no se verifica una instancia Supabase remota ni datos de producción.
