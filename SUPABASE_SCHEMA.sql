-- Cole este SQL no Supabase: dashboard > SQL Editor > New query > Run

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text,
  plan text not null default 'seed' check (plan in ('seed','ritual','devotion')),
  stripe_customer_id text,
  created_at timestamptz default now()
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  color text not null default '#8b9d89',
  streak integer not null default 0,
  created_at timestamptz default now()
);

create table if not exists public.daily_completions (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid references public.habits on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  completed_date date not null default current_date,
  constraint daily_completions_unique unique (habit_id, completed_date)
);

create table if not exists public.integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  service text not null,
  access_token text,
  refresh_token text,
  expires_at timestamptz,
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  constraint integrations_user_service_unique unique (user_id, service)
);

alter table public.profiles         enable row level security;
alter table public.habits            enable row level security;
alter table public.daily_completions enable row level security;
alter table public.integrations      enable row level security;

create policy "own_profile"     on public.profiles         for all using (auth.uid() = id);
create policy "own_habits"      on public.habits            for all using (auth.uid() = user_id);
create policy "own_completions" on public.daily_completions for all using (auth.uid() = user_id);
create policy "own_integrations"on public.integrations      for all using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email, plan)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'plan','seed')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create index if not exists habits_user_idx on public.habits (user_id);
create index if not exists completions_user_date_idx on public.daily_completions (user_id, completed_date);
