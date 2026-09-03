# Configuración de Supabase Storage para PPI

## Buckets Requeridos

El proyecto usa dos buckets en Supabase Storage:

1. **forum-images** - Para imágenes en publicaciones y comentarios
2. **avatars** - Para fotos de perfil de usuarios

## Configuración en Supabase

### 1. Crear buckets

En Supabase Dashboard → Storage:

1. Crear bucket "forum-images" (público)
2. Crear bucket "avatars" (público)

### 2. Políticas de Seguridad (RLS)

**Para bucket `forum-images`:**

- Usuarios autenticados pueden subir al path `{user_id}/*`
- Todos pueden leer (público)

**Para bucket `avatars`:**

- Usuarios autenticados pueden subir/reemplazar el archivo `{user_id}/avatar.*`
- Todos pueden leer (público)

### 3. Rutas permitidas

El frontend crea automáticamente:

```
forum-images/{user_id}/{timestamp}.{ext}
avatars/{user_id}/avatar.{ext}
```

### 4. Validaciones en Frontend

- Formatos: JPG, PNG, WebP
- Máximo 5MB para imágenes de publicaciones
- Máximo 2MB para avatars
- Validación de tipo MIME

## Migración SQL

No se requieren migraciones SQL directas para Storage, pero se han agregado:

- Columna `image_url` en `forum_posts`
- Columna `image_url` en `forum_replies`
- Columna `avatar_url` en `profiles` (ya existe)

Ver: `supabase/migrations/004-forum-social-immediate.sql`

## Verificación

Después de configurar los buckets:

1. Accede a la app
2. Ve a Perfil → "Cambiar foto"
3. Sube una imagen
4. Ve a Comunidad → "Crear publicación"
5. Sube imagen en publicación
6. Verifica que aparezca correctamente

Si hay error "storage policy", revisa que los buckets sean públicos (read).
