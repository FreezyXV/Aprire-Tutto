-- Transactional verification: creates no persistent accounts or progress.
begin;
insert into auth.users(id,email,email_confirmed_at)
values ('77777777-7777-4777-8777-777777777777','aprire-test@example.invalid',now());
insert into private.app_owner values('aprire-test@example.invalid');
select set_config('request.jwt.claim.sub','77777777-7777-4777-8777-777777777777',true);
set local role authenticated;
do $$ begin
 if not public.is_app_owner() then raise exception 'Owner recognition failed'; end if;
 if public.save_learning_state('{"version":1}',0) is distinct from 1 then raise exception 'Initial save failed'; end if;
 if public.save_learning_state('{"version":1}',0) is not null then raise exception 'Concurrent initial save overwrites data'; end if;
 if public.save_learning_state('{"version":1}',1) is distinct from 2 then raise exception 'Revision update failed'; end if;
 if public.save_learning_state('{"version":1}',1) is not null then raise exception 'Stale revision accepted'; end if;
 if public.reserve_ai('77777777-0000-4000-8000-000000000001','course')<>'ok' then raise exception 'Budget reservation failed'; end if;
 if public.reserve_ai('77777777-0000-4000-8000-000000000001','course')<>'duplicate' then raise exception 'Duplicate charge allowed'; end if;
 if public.reserve_ai('77777777-0000-4000-8000-000000000002','course')<>'wait' then raise exception 'Rate limit failed'; end if;
end $$;
reset role;
update private.ai_reservations set created_at=now()-interval '1 minute',amount=0.9 where user_id='77777777-7777-4777-8777-777777777777';
set local role authenticated;
do $$ begin
 if public.reserve_ai('77777777-0000-4000-8000-000000000002','course')<>'budget' then raise exception 'Daily cap failed'; end if;
end $$;
reset role;
update private.ai_reservations set amount=4.95,created_at=date_trunc('month',now() at time zone 'UTC') at time zone 'UTC' where user_id='77777777-7777-4777-8777-777777777777';
set local role authenticated;
do $$ begin
 if public.reserve_ai('77777777-0000-4000-8000-000000000002','tutor')<>'budget' then raise exception 'Monthly cap failed'; end if;
end $$;
reset role;
select set_config('request.jwt.claim.sub','77777777-7777-4777-8777-888888888888',true);
set local role authenticated;
do $$ begin
 if public.is_app_owner() then raise exception 'Unknown user is owner'; end if;
 if exists(select 1 from public.learning_state) then raise exception 'RLS leaks progress'; end if;
 begin
  perform public.save_learning_state('{"version":1}',0);
  raise exception 'Non-owner save allowed';
 exception when insufficient_privilege then null; end;
 begin
  perform public.reserve_ai('77777777-0000-4000-8000-000000000003','course');
  raise exception 'Non-owner charge allowed';
 exception when insufficient_privilege then null; end;
end $$;
rollback;
select 'All transactional database checks passed; fixtures rolled back' as result;
