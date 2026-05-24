-- Migration: Drop NOT NULL constraint on token_id in public.qr_scan_events
-- This allows dynamic scans (without a physical token) to be captured successfully.

ALTER TABLE public.qr_scan_events ALTER COLUMN token_id DROP NOT NULL;
