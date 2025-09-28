-- Create the jobs table for storing edit history
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  mode text check (mode in ('edit','replace')),
  prompt text,
  images jsonb,           -- array of source URLs
  output_url text,
  meta jsonb,
  created_at timestamptz default now()
);

-- Create index for efficient queries
create index on jobs (user_id, created_at desc);

-- Enable Row Level Security (RLS)
alter table jobs enable row level security;

-- Create policy to allow users to only see their own jobs
create policy "Users can only see their own jobs" on jobs
  for all using (auth.uid() = user_id);

-- Create policy to allow users to insert their own jobs
create policy "Users can insert their own jobs" on jobs
  for insert with check (auth.uid() = user_id);

-- Create policy to allow users to update their own jobs
create policy "Users can update their own jobs" on jobs
  for update using (auth.uid() = user_id);

-- Create policy to allow users to delete their own jobs
create policy "Users can delete their own jobs" on jobs
  for delete using (auth.uid() = user_id);