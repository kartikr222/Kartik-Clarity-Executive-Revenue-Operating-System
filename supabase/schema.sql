create table if not exists public.qualified_leads (
  id uuid primary key default gen_random_uuid(),
  founder_name text,
  work_email text not null,
  company_name text not null,
  current_arr_usd numeric,
  target_arr_usd numeric,
  primary_revenue_bottleneck text,
  qualification_score integer not null,
  icp_fit boolean not null,
  created_at timestamptz not null default now()
);

alter table public.qualified_leads enable row level security;

-- No public policies are created intentionally. Inserts should be performed by the server-side service-role bridge.
