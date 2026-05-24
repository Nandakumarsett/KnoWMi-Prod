-- =========================================================================
-- KNOWNMI DATABASE FIX: ALLOW DYNAMIC SCANS FOR DEEP MAP INTELLIGENCE
-- =========================================================================
-- Run this statement in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jwsoutcwgwwfovrdrmjk/sql

ALTER TABLE public.qr_scan_events ALTER COLUMN token_id DROP NOT NULL;
