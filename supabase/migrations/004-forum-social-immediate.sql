-- Migración 004: Foro social inmediato con imágenes
-- Cambia forum_posts y forum_replies para NO requerir aprobación
-- Agrega soporte para imágenes en publicaciones y respuestas

-- Agregar columna de imagen a forum_posts si no existe
alter table public.forum_posts 
add column if not exists image_url text;

-- Agregar columna de imagen a forum_replies si no existe
alter table public.forum_replies 
add column if not exists image_url text;

-- Cambiar status por defecto a 'approved' para nuevas publicaciones
alter table public.forum_posts 
alter column status set default 'approved';

-- Cambiar status por defecto a 'approved' para nuevas respuestas
alter table public.forum_replies 
alter column status set default 'approved';

-- Reemplazar políticas RLS para que las publicaciones sean inmediatamente visibles
drop policy if exists "create own forum posts" on public.forum_posts;
create policy "create own forum posts" on public.forum_posts
for insert to authenticated
with check (author_id=auth.uid() and status='approved');

-- Permitir a usuarios ver todas las publicaciones (sin requerer aprobación)
drop policy if exists "read approved or own forum posts" on public.forum_posts;
create policy "read all forum posts" on public.forum_posts
for select to authenticated
using (true);

-- Permitir a usuarios crear respuestas sin aprobación previa
drop policy if exists "create replies on open approved posts" on public.forum_replies;
create policy "create own forum replies" on public.forum_replies
for insert to authenticated
with check (author_id=auth.uid() and status='approved' and exists(select 1 from public.forum_posts p where p.id=post_id and not p.locked));

-- Permitir a usuarios ver todas las respuestas
drop policy if exists "read approved or own forum replies" on public.forum_replies;
create policy "read all forum replies" on public.forum_replies
for select to authenticated
using (true);

-- Permitir a usuarios actualizar/eliminar solo su propio contenido
drop policy if exists "delete own or admin forum posts" on public.forum_posts;
create policy "delete own forum posts" on public.forum_posts
for delete to authenticated
using (author_id=auth.uid());

drop policy if exists "delete own or admin forum replies" on public.forum_replies;
create policy "delete own forum replies" on public.forum_replies
for delete to authenticated
using (author_id=auth.uid());

-- Admin puede hacer cualquier cosa
drop policy if exists "admin moderate forum posts" on public.forum_posts;
create policy "admin manage forum posts" on public.forum_posts
for all to authenticated
using (public.is_admin());

drop policy if exists "admin moderate forum replies" on public.forum_replies;
create policy "admin manage forum replies" on public.forum_replies
for all to authenticated
using (public.is_admin());

-- Buckets públicos para mostrar imágenes, con escritura limitada a la carpeta
-- cuyo primer segmento coincide con el id del usuario autenticado.
insert into storage.buckets (id, name, public)
values ('forum-images', 'forum-images', true), ('avatars', 'avatars', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "public read forum images" on storage.objects;
create policy "public read forum images" on storage.objects
for select to public
using (bucket_id in ('forum-images', 'avatars'));

drop policy if exists "users upload forum images" on storage.objects;
create policy "users upload forum images" on storage.objects
for insert to authenticated
with check (
	bucket_id in ('forum-images', 'avatars')
	and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "users update own forum images" on storage.objects;
create policy "users update own forum images" on storage.objects
for update to authenticated
using (
	bucket_id in ('forum-images', 'avatars')
	and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
	bucket_id in ('forum-images', 'avatars')
	and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "users delete own forum images" on storage.objects;
create policy "users delete own forum images" on storage.objects
for delete to authenticated
using (
	bucket_id in ('forum-images', 'avatars')
	and (storage.foldername(name))[1] = auth.uid()::text
);
