create table profiles(id uuid primary key, email text, created_at timestamptz default now());
