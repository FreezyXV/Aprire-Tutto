-- Realistic AI reservations (measured on the real API, Nov 2026):
-- a Flash correction costs ~0.003 USD, a Flash course ~0.01-0.02 USD.
-- Reservations stay above real costs, so the 1 USD/day and 5 USD/month caps
-- still bound real spending, while allowing ~50 corrections a day instead of ~12.
create or replace function private.reserve_ai(request_id uuid,kind text) returns text
language plpgsql security definer set search_path='' as $$
declare allowance numeric; day_used numeric; month_used numeric;
begin
 if not private.is_app_owner() then raise exception 'Access denied' using errcode='42501'; end if;
 if kind not in ('course','tutor') then raise exception 'Invalid action'; end if;
 allowance:=case when kind='course' then 0.05 else 0.02 end;
 perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text,0));
 if exists(select 1 from private.ai_reservations r where r.request_id=reserve_ai.request_id) then return 'duplicate'; end if;
 if exists(select 1 from private.ai_reservations r where r.user_id=auth.uid() and r.created_at>now()-interval '20 seconds') then return 'wait'; end if;
 select coalesce(sum(amount) filter(where created_at>=date_trunc('day',now() at time zone 'UTC') at time zone 'UTC'),0),coalesce(sum(amount),0)
 into day_used,month_used from private.ai_reservations where user_id=auth.uid() and created_at>=date_trunc('month',now() at time zone 'UTC') at time zone 'UTC';
 if day_used+allowance>1 or month_used+allowance>5 then return 'budget'; end if;
 insert into private.ai_reservations values(request_id,auth.uid(),allowance,now());
 return 'ok';
end; $$;
