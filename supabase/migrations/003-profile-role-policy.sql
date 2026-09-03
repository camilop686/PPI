-- Impide que un usuario normal cambie su rol mediante una actualización de perfil.
-- Los cambios administrativos de rol deben pasar por admin_set_role().
drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles
for update to authenticated
using (id = auth.uid())
with check (id = auth.uid() and (role = 'user' or public.is_admin()));
