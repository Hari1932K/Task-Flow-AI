-- TaskFlow AI — Supabase schema. Run in your Supabase SQL editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text, email text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "Profiles select own" on public.profiles;
create policy "Profiles select own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "Profiles insert own" on public.profiles;
create policy "Profiles insert own" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "Profiles update own" on public.profiles;
create policy "Profiles update own" on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), new.email)
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null, description text default '',
  status text not null default 'planning' check (status in ('planning','active','on_hold','completed')),
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  due_date date, created_at timestamptz not null default now()
);
create index if not exists projects_user_id_idx on public.projects (user_id);
alter table public.projects enable row level security;
drop policy if exists "Projects select own" on public.projects;
create policy "Projects select own" on public.projects for select using (auth.uid() = user_id);
drop policy if exists "Projects insert own" on public.projects;
create policy "Projects insert own" on public.projects for insert with check (auth.uid() = user_id);
drop policy if exists "Projects update own" on public.projects;
create policy "Projects update own" on public.projects for update using (auth.uid() = user_id);
drop policy if exists "Projects delete own" on public.projects;
create policy "Projects delete own" on public.projects for delete using (auth.uid() = user_id);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null, completed boolean not null default false,
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  tags text[] not null default '{}',
  due_date date, created_at timestamptz not null default now()
);
create index if not exists tasks_user_id_idx on public.tasks (user_id);
create index if not exists tasks_project_id_idx on public.tasks (project_id);
alter table public.tasks enable row level security;
drop policy if exists "Tasks select own" on public.tasks;
create policy "Tasks select own" on public.tasks for select using (auth.uid() = user_id);
drop policy if exists "Tasks insert own" on public.tasks;
create policy "Tasks insert own" on public.tasks for insert with check (auth.uid() = user_id);
drop policy if exists "Tasks update own" on public.tasks;
create policy "Tasks update own" on public.tasks for update using (auth.uid() = user_id);
drop policy if exists "Tasks delete own" on public.tasks;
create policy "Tasks delete own" on public.tasks for delete using (auth.uid() = user_id);
