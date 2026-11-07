-- Initial schema (Supabase CLI migration). Apply with `supabase db push`.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;
create table if not exists private.app_owner(email text primary key);
alter table private.app_owner enable row level security;
revoke all on private.app_owner from public, anon, authenticated;

create or replace function private.is_app_owner() returns boolean
language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and exists(
 select 1 from auth.users u join private.app_owner o on lower(u.email)=lower(o.email)
 where u.id=auth.uid() and u.email_confirmed_at is not null);
$$;
revoke all on function private.is_app_owner() from public,anon;
grant execute on function private.is_app_owner() to authenticated;
create or replace function public.is_app_owner() returns boolean
language sql stable security invoker set search_path='' as $$ select private.is_app_owner(); $$;
revoke all on function public.is_app_owner() from public,anon;
grant execute on function public.is_app_owner() to authenticated;

create table if not exists public.learning_state(
 user_id uuid primary key references auth.users(id) on delete cascade,
 state jsonb not null check (octet_length(state::text)<=4500000),
 revision bigint not null default 1 check(revision>0),
 updated_at timestamptz not null default now()
);
alter table public.learning_state enable row level security;
revoke all on public.learning_state from public,anon,authenticated;
grant select on public.learning_state to authenticated;
create policy owner_reads_state on public.learning_state for select to authenticated
 using(user_id=(select auth.uid()) and (select private.is_app_owner()));
create or replace function private.save_learning_state(new_state jsonb,expected_revision bigint) returns bigint
language plpgsql security definer set search_path='' as $$
declare result bigint;
begin
 if not private.is_app_owner() then raise exception 'Access denied' using errcode='42501'; end if;
 if new_state->>'version' is distinct from '1' then raise exception 'Invalid state'; end if;
 if expected_revision=0 then
  insert into public.learning_state(user_id,state) values(auth.uid(),new_state)
  on conflict do nothing returning revision into result;
 else
  update public.learning_state set state=new_state,revision=revision+1,updated_at=now()
  where user_id=auth.uid() and revision=expected_revision returning revision into result;
 end if;
 return result;
end; $$;
revoke all on function private.save_learning_state(jsonb,bigint) from public,anon;
grant execute on function private.save_learning_state(jsonb,bigint) to authenticated;
create or replace function public.save_learning_state(new_state jsonb,expected_revision bigint) returns bigint
language sql security invoker set search_path='' as $$ select private.save_learning_state(new_state,expected_revision); $$;
revoke all on function public.save_learning_state(jsonb,bigint) from public,anon;
grant execute on function public.save_learning_state(jsonb,bigint) to authenticated;

create table if not exists private.ai_reservations(
 request_id uuid primary key, user_id uuid not null references auth.users(id) on delete cascade,
 amount numeric(8,4) not null, created_at timestamptz not null default now()
);
create index if not exists ai_reservations_user_time on private.ai_reservations(user_id,created_at);
alter table private.ai_reservations enable row level security;
revoke all on private.ai_reservations from public,anon,authenticated;
-- Conservative reservations, not provider invoices. Failures remain reserved.
-- UTC windows; maximum USD 1/day and USD 5/month, one call every 20 seconds.
create or replace function private.reserve_ai(request_id uuid,kind text) returns text
language plpgsql security definer set search_path='' as $$
declare allowance numeric; day_used numeric; month_used numeric;
begin
 if not private.is_app_owner() then raise exception 'Access denied' using errcode='42501'; end if;
 if kind not in ('course','tutor') then raise exception 'Invalid action'; end if;
 allowance:=case when kind='course' then 0.15 else 0.08 end;
 perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text,0));
 if exists(select 1 from private.ai_reservations r where r.request_id=reserve_ai.request_id) then return 'duplicate'; end if;
 if exists(select 1 from private.ai_reservations r where r.user_id=auth.uid() and r.created_at>now()-interval '20 seconds') then return 'wait'; end if;
 select coalesce(sum(amount) filter(where created_at>=date_trunc('day',now() at time zone 'UTC') at time zone 'UTC'),0),coalesce(sum(amount),0)
 into day_used,month_used from private.ai_reservations where user_id=auth.uid() and created_at>=date_trunc('month',now() at time zone 'UTC') at time zone 'UTC';
 if day_used+allowance>1 or month_used+allowance>5 then return 'budget'; end if;
 insert into private.ai_reservations values(request_id,auth.uid(),allowance,now());
 return 'ok';
end; $$;
revoke all on function private.reserve_ai(uuid,text) from public,anon;
grant execute on function private.reserve_ai(uuid,text) to authenticated;
create or replace function public.reserve_ai(request_id uuid,kind text) returns text
language sql security invoker set search_path='' as $$ select private.reserve_ai(request_id,kind); $$;
revoke all on function public.reserve_ai(uuid,text) from public,anon;
grant execute on function public.reserve_ai(uuid,text) to authenticated;
