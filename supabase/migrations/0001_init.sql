create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  asset_class text not null,
  country text not null,
  currency text not null default 'USD',
  current_value numeric not null default 0,
  acquisition_date date,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default now()
);
alter table assets enable row level security;
drop policy if exists "assets_v1_read" on assets;
create policy "assets_v1_read" on assets for select using (true);
drop policy if exists "assets_v1_write" on assets;
create policy "assets_v1_write" on assets for all using (true) with check (true);

create table if not exists liabilities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  liability_type text not null,
  country text not null,
  currency text not null default 'USD',
  outstanding_amount numeric not null default 0,
  original_amount numeric,
  interest_rate numeric,
  due_date date,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default now()
);
alter table liabilities enable row level security;
drop policy if exists "liabilities_v1_read" on liabilities;
create policy "liabilities_v1_read" on liabilities for select using (true);
drop policy if exists "liabilities_v1_write" on liabilities;
create policy "liabilities_v1_write" on liabilities for all using (true) with check (true);

create table if not exists value_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  record_id uuid not null,
  record_type text not null,
  previous_value numeric,
  new_value numeric not null,
  currency text not null default 'USD',
  reason text,
  snapshot_date date not null default current_date,
  created_at timestamptz not null default now()
);
alter table value_snapshots enable row level security;
drop policy if exists "value_snapshots_v1_read" on value_snapshots;
create policy "value_snapshots_v1_read" on value_snapshots for select using (true);
drop policy if exists "value_snapshots_v1_write" on value_snapshots;
create policy "value_snapshots_v1_write" on value_snapshots for all using (true) with check (true);

create table if not exists nominees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  asset_id uuid,
  liability_id uuid,
  full_name text not null,
  relationship text not null,
  email text,
  phone text,
  share_percent numeric default 100,
  notes text,
  created_at timestamptz not null default now()
);
alter table nominees enable row level security;
drop policy if exists "nominees_v1_read" on nominees;
create policy "nominees_v1_read" on nominees for select using (true);
drop policy if exists "nominees_v1_write" on nominees;
create policy "nominees_v1_write" on nominees for all using (true) with check (true);

create table if not exists beneficiary_guides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  asset_id uuid,
  guide_text text not null,
  guide_text_source text default 'openai-gpt-4o',
  guide_text_confidence numeric default 0.8,
  guide_text_review_status text default 'unreviewed',
  version integer not null default 1,
  created_at timestamptz not null default now()
);
alter table beneficiary_guides enable row level security;
drop policy if exists "beneficiary_guides_v1_read" on beneficiary_guides;
create policy "beneficiary_guides_v1_read" on beneficiary_guides for select using (true);
drop policy if exists "beneficiary_guides_v1_write" on beneficiary_guides;
create policy "beneficiary_guides_v1_write" on beneficiary_guides for all using (true) with check (true);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  payload jsonb,
  created_at timestamptz not null default now()
);
alter table audit_logs enable row level security;
drop policy if exists "audit_logs_v1_read" on audit_logs;
create policy "audit_logs_v1_read" on audit_logs for select using (true);
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_v1_write" on audit_logs for all using (true) with check (true);

insert into assets (id, name, asset_class, country, currency, current_value, acquisition_date, status, notes) values
  ('a1000000-0000-0000-0000-000000000001', 'Kuala Lumpur Condo', 'Real Estate', 'Malaysia', 'MYR', 850000, '2018-03-15', 'active', 'Freehold unit in Mont Kiara'),
  ('a1000000-0000-0000-0000-000000000002', 'S&P 500 Index Fund', 'Equities', 'United States', 'USD', 120000, '2020-01-10', 'active', 'Held via Interactive Brokers'),
  ('a1000000-0000-0000-0000-000000000003', 'EPF (Employees Provident Fund)', 'Pension', 'Malaysia', 'MYR', 310000, '2010-06-01', 'active', 'Mandatory retirement account'),
  ('a1000000-0000-0000-0000-000000000004', 'Bitcoin Holdings', 'Crypto', 'Singapore', 'USD', 45000, '2021-11-05', 'active', 'Cold wallet — Ledger Nano X');

insert into liabilities (id, name, liability_type, country, currency, outstanding_amount, original_amount, interest_rate, due_date, status) values
  ('b1000000-0000-0000-0000-000000000001', 'KL Condo Mortgage', 'Mortgage', 'Malaysia', 'MYR', 420000, 600000, 3.5, '2038-03-01', 'active'),
  ('b1000000-0000-0000-0000-000000000002', 'Personal Loan (car)', 'Personal Loan', 'Malaysia', 'MYR', 28000, 45000, 5.2, '2026-09-01', 'active');

insert into nominees (id, asset_id, full_name, relationship, email, phone, share_percent) values
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Siti Rahim', 'Spouse', 'siti@example.com', '+60123456789', 60),
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Ahmad Bin Ali', 'Child', 'ahmad@example.com', '+60198765432', 40),
  ('c1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'Siti Rahim', 'Spouse', 'siti@example.com', '+60123456789', 100);

insert into value_snapshots (record_id, record_type, previous_value, new_value, currency, reason, snapshot_date) values
  ('a1000000-0000-0000-0000-000000000001', 'asset', 780000, 850000, 'MYR', 'Annual property revaluation', '2024-01-10'),
  ('a1000000-0000-0000-0000-000000000002', 'asset', 95000, 120000, 'USD', 'Market appreciation Q1 2024', '2024-04-01');

insert into beneficiary_guides (id, asset_id, guide_text, guide_text_source, guide_text_confidence, guide_text_review_status, version) values
  ('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'To access the Kuala Lumpur Condo upon the owner''s passing: 1) Obtain the Grant of Probate or Letter of Administration from the Malaysian High Court. 2) Contact Maybank home loan division with the death certificate to freeze outstanding mortgage. 3) Engage a Malaysian property lawyer to transfer title via Form 14A at the Land Office. 4) The property is registered under Strata Title — collect the strata title document from the owner''s safe. 5) Contact: Siti Rahim (spouse, 60% share) and Ahmad Bin Ali (child, 40% share) are registered nominees.', 'openai-gpt-4o', 0.82, 'unreviewed', 1);