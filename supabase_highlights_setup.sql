-- Create highlights table
create table if not exists highlights (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  book_title text not null,
  page_number integer,
  quote text not null,
  color text default 'bg-brand-gold/20',
  created_at timestamptz default now()
);

alter table highlights enable row level security;

create policy "Users can view their own highlights" on highlights for select using ( auth.uid() = user_id );
create policy "Users can insert their own highlights" on highlights for insert with check ( auth.uid() = user_id );
create policy "Users can update their own highlights" on highlights for update using ( auth.uid() = user_id );
create policy "Users can delete their own highlights" on highlights for delete using ( auth.uid() = user_id );
