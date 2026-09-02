-- Foro PPI: ejecutar una sola vez después de schema.sql.
create table public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles on delete cascade,
  title text not null check (char_length(trim(title)) between 6 and 120 and title !~ '<[^>]+>'),
  body text not null check (char_length(trim(body)) between 1 and 4000 and body !~ '<[^>]+>'),
  category text not null default 'General' check (category in ('General','Prevención','Amenazas','Ayuda técnica')),
  status public.comment_status not null default 'pending',
  locked boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.forum_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.forum_posts on delete cascade,
  author_id uuid not null references public.profiles on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 2000 and body !~ '<[^>]+>'),
  status public.comment_status not null default 'pending',
  created_at timestamptz not null default now()
);
alter table public.forum_posts enable row level security;
alter table public.forum_replies enable row level security;
create policy "read approved or own forum posts" on public.forum_posts for select to authenticated using (status='approved' or author_id=auth.uid() or public.is_admin());
create policy "create own forum posts" on public.forum_posts for insert to authenticated with check (author_id=auth.uid() and status='pending');
create policy "admin moderate forum posts" on public.forum_posts for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "delete own or admin forum posts" on public.forum_posts for delete to authenticated using (author_id=auth.uid() or public.is_admin());
create policy "read approved or own forum replies" on public.forum_replies for select to authenticated using (status='approved' or author_id=auth.uid() or public.is_admin());
create policy "create replies on open approved posts" on public.forum_replies for insert to authenticated with check (author_id=auth.uid() and status='pending' and exists(select 1 from public.forum_posts p where p.id=post_id and p.status='approved' and not p.locked));
create policy "admin moderate forum replies" on public.forum_replies for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "delete own or admin forum replies" on public.forum_replies for delete to authenticated using (author_id=auth.uid() or public.is_admin());
