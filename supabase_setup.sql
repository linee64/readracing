
-- 1. Create the 'books' table to store book metadata and progress
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

-- 2. Enable Row Level Security (RLS)
alter table books enable row level security;

-- 3. Create policies to allow users to manage their own books
create policy "Users can view their own books"
  on books for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own books"
  on books for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own books"
  on books for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own books"
  on books for delete
  using ( auth.uid() = user_id );

-- 4. Create the 'profiles' table if it doesn't exist (for user stats)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  pages_read integer default 0,
  updated_at timestamptz
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

-- 5. Storage Bucket Setup (You need to create a bucket named 'books' in Supabase Storage manually if not exists)
-- This SQL just sets up the policies for the 'books' bucket
insert into storage.buckets (id, name, public)
values ('books', 'books', true)
on conflict (id) do nothing;

create policy "Users can upload their own books"
  on storage.objects for insert
  with check ( bucket_id = 'books' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Users can view their own books"
  on storage.objects for select
  using ( bucket_id = 'books' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Users can update their own books"
  on storage.objects for update
  using ( bucket_id = 'books' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Users can delete their own books"
  on storage.objects for delete
  using ( bucket_id = 'books' and auth.uid()::text = (storage.foldername(name))[1] );
