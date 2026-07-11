-- Lock-Down sprint: replace v1 permissive policies with owner-scoped RLS.
-- Demo seed rows (user_id is null) stay readable by anonymous visitors,
-- but only the owning authenticated user can write to their own rows.
-- Seed rows (user_id is null) become read-only once this migration is applied.

-- assets
drop policy if exists "assets_v1_read" on assets;
drop policy if exists "assets_v1_write" on assets;
create policy "assets_read" on assets for select using (user_id is null or auth.uid() = user_id);
create policy "assets_insert" on assets for insert with check (auth.uid() = user_id);
create policy "assets_update" on assets for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "assets_delete" on assets for delete using (auth.uid() = user_id);

-- liabilities
drop policy if exists "liabilities_v1_read" on liabilities;
drop policy if exists "liabilities_v1_write" on liabilities;
create policy "liabilities_read" on liabilities for select using (user_id is null or auth.uid() = user_id);
create policy "liabilities_insert" on liabilities for insert with check (auth.uid() = user_id);
create policy "liabilities_update" on liabilities for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "liabilities_delete" on liabilities for delete using (auth.uid() = user_id);

-- value_snapshots
drop policy if exists "value_snapshots_v1_read" on value_snapshots;
drop policy if exists "value_snapshots_v1_write" on value_snapshots;
create policy "value_snapshots_read" on value_snapshots for select using (user_id is null or auth.uid() = user_id);
create policy "value_snapshots_insert" on value_snapshots for insert with check (auth.uid() = user_id);
create policy "value_snapshots_update" on value_snapshots for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "value_snapshots_delete" on value_snapshots for delete using (auth.uid() = user_id);

-- nominees
drop policy if exists "nominees_v1_read" on nominees;
drop policy if exists "nominees_v1_write" on nominees;
create policy "nominees_read" on nominees for select using (user_id is null or auth.uid() = user_id);
create policy "nominees_insert" on nominees for insert with check (auth.uid() = user_id);
create policy "nominees_update" on nominees for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "nominees_delete" on nominees for delete using (auth.uid() = user_id);

-- beneficiary_guides
drop policy if exists "beneficiary_guides_v1_read" on beneficiary_guides;
drop policy if exists "beneficiary_guides_v1_write" on beneficiary_guides;
create policy "beneficiary_guides_read" on beneficiary_guides for select using (user_id is null or auth.uid() = user_id);
create policy "beneficiary_guides_insert" on beneficiary_guides for insert with check (auth.uid() = user_id);
create policy "beneficiary_guides_update" on beneficiary_guides for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "beneficiary_guides_delete" on beneficiary_guides for delete using (auth.uid() = user_id);

-- audit_logs: append-only, no update/delete policy on purpose
drop policy if exists "audit_logs_v1_read" on audit_logs;
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_read" on audit_logs for select using (user_id is null or auth.uid() = user_id);
create policy "audit_logs_insert" on audit_logs for insert with check (auth.uid() = user_id);
