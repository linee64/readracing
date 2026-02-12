
-- Create reading_sessions table
create table if not exists reading_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  book_id text references books(id) on delete set null,
  pages_read integer default 0,
  duration_seconds integer default 0,
  created_at timestamptz default now()
);

alter table reading_sessions enable row level security;

create policy "Users can view their own sessions" on reading_sessions for select using ( auth.uid() = user_id );
create policy "Users can insert their own sessions" on reading_sessions for insert with check ( auth.uid() = user_id );
create policy "Users can update their own sessions" on reading_sessions for update using ( auth.uid() = user_id );
create policy "Users can delete their own sessions" on reading_sessions for delete using ( auth.uid() = user_id );

-- Add weekly_goal to profiles if it doesn't exist
alter table profiles add column if not exists weekly_goal integer default 150;
