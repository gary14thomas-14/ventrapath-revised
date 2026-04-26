-- up
-- Create application users table.

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text null,
  auth_provider text not null,
  auth_provider_user_id text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_email_unique unique (email)
);

create index if not exists users_auth_provider_lookup_idx
  on users (auth_provider, auth_provider_user_id);
