-- Qualified leads persistence with server-only writes.
-- The API uses the Supabase service-role key; anon/authenticated clients have no direct table access.

create table if not exists public.qualified_leads (
  id uuid primary key default gen_random_uuid(),
  founder_name text,
  work_email text not null,
  company_name text not null,
  current_arr_usd numeric,
  target_arr_usd numeric,
  primary_revenue_bottleneck text,
  qualification_score integer not null check (qualification_score between 0 and 100),
  icp_fit boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.qualified_leads enable row level security;

-- No client-facing policies are intentionally created. The service-role key bypasses RLS
-- for the server-side lead qualification endpoint.

create index if not exists qualified_leads_work_email_idx
  on public.qualified_leads (work_email);

create index if not exists qualified_leads_created_at_idx
  on public.qualified_leads (created_at desc);
