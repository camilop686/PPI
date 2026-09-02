-- Ejecutar una vez después de schema.sql. Permite a administradores cambiar roles
-- sin exponer la service_role al navegador.
create or replace function public.admin_set_role(target_id uuid, next_role public.user_role)
returns void language plpgsql security definer set search_path=public as $$
begin
  if not public.is_admin() then raise exception 'Unauthorized'; end if;
  if target_id = auth.uid() and next_role <> 'admin' then raise exception 'An administrator cannot revoke their own role'; end if;
  update public.profiles set role=next_role where id=target_id;
end;
$$;
revoke all on function public.admin_set_role(uuid, public.user_role) from public;
grant execute on function public.admin_set_role(uuid, public.user_role) to authenticated;
