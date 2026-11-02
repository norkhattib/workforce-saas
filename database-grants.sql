-- Run in the NEW SaaS Supabase project only.
-- RLS remains responsible for tenant isolation.

grant usage on schema public to authenticated;

grant select, insert, update, delete on table public.businesses to authenticated;
grant select, insert, update, delete on table public.business_users to authenticated;
grant select, insert, update, delete on table public.business_settings to authenticated;
grant select, insert, update, delete on table public.advance_providers to authenticated;
grant select, insert, update, delete on table public.employees to authenticated;
grant select, insert, update, delete on table public.clients to authenticated;
grant select, insert, update, delete on table public.locations to authenticated;
grant select, insert, update, delete on table public.shifts to authenticated;
grant select, insert, update, delete on table public.shift_employees to authenticated;
grant select, insert, update, delete on table public.employee_payments to authenticated;

grant execute on function public.create_business(text, text) to authenticated;
grant execute on function public.is_business_member(uuid) to authenticated;
grant execute on function public.has_business_role(uuid, text[]) to authenticated;
