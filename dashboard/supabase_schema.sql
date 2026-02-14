-- Create highlights table
create table if not exists public.highlights (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  book_id text not null, -- Can be uuid or string depending on book source
  quote text not null,
  book_title text not null,
  page_number integer default 0,
  color text,
  cfi_range text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.highlights enable row level security;

-- Policies
create policy "Users can view their own highlights" 
  on public.highlights for select 
  using (auth.uid() = user_id);

create policy "Users can insert their own highlights" 
  on public.highlights for insert 
  with check (auth.uid() = user_id);

create policy "Users can update their own highlights" 
  on public.highlights for update 
  using (auth.uid() = user_id);

create policy "Users can delete their own highlights" 
  on public.highlights for delete 
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists highlights_user_id_idx on public.highlights (user_id);
create index if not exists highlights_book_id_idx on public.highlights (book_id);
