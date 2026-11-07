-- MCC: Apple Wallet passes (run AFTER members-2-registration.sql).
-- Remembers the Wallet pass made for each ticket, so a ticket only ever makes one pass
-- (tapping "Add to Apple Wallet" again reuses it instead of using up the monthly quota).
-- Only the wallet-pass Edge Function writes these columns.

alter table public.event_registrations
  add column if not exists wallet_serial text,
  add column if not exists wallet_url    text;

select column_name from information_schema.columns
 where table_schema = 'public' and table_name = 'event_registrations' and column_name like 'wallet%';
