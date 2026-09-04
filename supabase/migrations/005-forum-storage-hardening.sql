-- Refuerza el foro social inmediato con visibilidad controlada y límites de Storage.
-- Mantiene publicaciones/comentarios aprobados por defecto, pero evita exponer contenido moderado.

alter table public.forum_posts
add column if not exists image_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'forum-images',
    'forum-images',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'avatars',
    'avatars',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "read all forum posts" on public.forum_posts;
create policy "read visible forum posts" on public.forum_posts
for select to authenticated
using (status = 'approved' or author_id = auth.uid() or public.is_admin());

drop policy if exists "read all forum replies" on public.forum_replies;
create policy "read visible forum replies" on public.forum_replies
for select to authenticated
using (status = 'approved' or author_id = auth.uid() or public.is_admin());

drop policy if exists "update own forum posts" on public.forum_posts;
create policy "update own forum posts" on public.forum_posts
for update to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());

drop policy if exists "update own forum replies" on public.forum_replies;
create policy "update own forum replies" on public.forum_replies
for update to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());

drop policy if exists "admin manage forum posts" on public.forum_posts;
create policy "admin manage forum posts" on public.forum_posts
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin manage forum replies" on public.forum_replies;
create policy "admin manage forum replies" on public.forum_replies
for all to authenticated
using (public.is_admin())
with check (public.is_admin());
