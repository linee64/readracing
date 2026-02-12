-- Safe setup script - runs even if things already exist

-- 1. Books Table
create table if not exists books (
  id text primary key,
  user_id uuid references auth.users not null,
  title text,
  author text,
  cover_url text,
  file_url text,
  total_pages integer default 0,
  current_page integer default 0,
  current_page_cfi text,
  last_read_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table books enable row level security;

-- Drop existing policies to avoid "already exists" error
drop policy if exists "Users can view their own books" on books;
drop policy if exists "Users can insert their own books" on books;
drop policy if exists "Users can update their own books" on books;
drop policy if exists "Users can delete their own books" on books;

-- Recreate policies
create policy "Users can view their own books" on books for select using ( auth.uid() = user_id );
create policy "Users can insert their own books" on books for insert with check ( auth.uid() = user_id );
create policy "Users can update their own books" on books for update using ( auth.uid() = user_id );
create policy "Users can delete their own books" on books for delete using ( auth.uid() = user_id );

-- 2. Profiles Table
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  pages_read integer default 0,
  updated_at timestamptz
);

alter table profiles enable row level security;

drop policy if exists "Users can manage own profile" on profiles;
create policy "Users can manage own profile" on profiles for all using ( auth.uid() = id );

-- 3. Storage
insert into storage.buckets (id, name, public) values ('books', 'books', true) on conflict (id) do nothing;

drop policy if exists "Users can upload books" on storage.objects;
drop policy if exists "Users can view books" on storage.objects;
drop policy if exists "Users can update books" on storage.objects;
drop policy if exists "Users can delete books" on storage.objects;

-- Note: We use a simple policy here ensuring users can only access their own folder (user_id/filename)
create policy "Users can upload books" on storage.objects for insert with check ( bucket_id = 'books' and auth.uid()::text = (storage.foldername(name))[1] );
create policy "Users can view books" on storage.objects for select using ( bucket_id = 'books' and auth.uid()::text = (storage.foldername(name))[1] );
create policy "Users can update books" on storage.objects for update using ( bucket_id = 'books' and auth.uid()::text = (storage.foldername(name))[1] );
create policy "Users can delete books" on storage.objects for delete using ( bucket_id = 'books' and auth.uid()::text = (storage.foldername(name))[1] );
