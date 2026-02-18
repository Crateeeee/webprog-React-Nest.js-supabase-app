-- Run this in your Supabase SQL Editor:
-- https://app.supabase.com → SQL Editor → New Query

-- 1. Create the guestbook table
CREATE TABLE IF NOT EXISTS public.guestbook (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL CHECK (char_length(name) <= 80),
  message     TEXT NOT NULL CHECK (char_length(message) <= 500),
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;

-- 3. Allow anyone to read posts
CREATE POLICY "Public read" ON public.guestbook
  FOR SELECT USING (true);

-- 4. Allow anyone to insert posts (anon key)
CREATE POLICY "Public insert" ON public.guestbook
  FOR INSERT WITH CHECK (true);

-- 5. Only service role can delete (used by Nest.js backend)
-- (No delete policy for anon — handled server-side)

-- 6. Index for faster ordering
CREATE INDEX IF NOT EXISTS guestbook_created_at_idx
  ON public.guestbook (created_at DESC);
