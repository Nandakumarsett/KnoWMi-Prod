-- ================================================
-- KnoWMi Admin Accounts System
-- Run this AFTER the main schema in Supabase SQL Editor
-- ================================================

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Create admin_accounts table
CREATE TABLE IF NOT EXISTS admin_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'collaborator' CHECK (role IN ('owner', 'ambassador', 'collaborator')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Disable RLS on admin_accounts (we control access via RPC functions)
ALTER TABLE admin_accounts ENABLE ROW LEVEL SECURITY;

-- 3. No direct read/write policies — all access goes through RPC functions

-- 4. RPC: Verify admin login (returns role + display_name if valid)
CREATE OR REPLACE FUNCTION verify_admin_login(p_username TEXT, p_password TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'id', id,
    'username', username,
    'display_name', display_name,
    'role', role
  ) INTO result
  FROM admin_accounts
  WHERE username = p_username
    AND password_hash = crypt(p_password, password_hash)
    AND is_active = true;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RPC: Create admin account (only callable with a valid owner session)
CREATE OR REPLACE FUNCTION create_admin_account(
  p_owner_username TEXT,
  p_owner_password TEXT,
  p_new_username TEXT,
  p_new_password TEXT,
  p_display_name TEXT,
  p_role TEXT DEFAULT 'ambassador'
)
RETURNS JSON AS $$
DECLARE
  owner_check JSON;
  new_account JSON;
BEGIN
  -- Verify the caller is an owner
  SELECT verify_admin_login(p_owner_username, p_owner_password) INTO owner_check;
  IF owner_check IS NULL OR (owner_check->>'role') != 'owner' THEN
    RETURN json_build_object('error', 'Unauthorized: Only owners can create accounts');
  END IF;

  -- Create the new account
  INSERT INTO admin_accounts (username, password_hash, display_name, role)
  VALUES (p_new_username, crypt(p_new_password, gen_salt('bf')), p_display_name, p_role)
  RETURNING json_build_object('id', id, 'username', username, 'display_name', display_name, 'role', role)
  INTO new_account;

  RETURN new_account;
EXCEPTION
  WHEN unique_violation THEN
    RETURN json_build_object('error', 'Username already exists');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RPC: List all admin accounts (owner only)
CREATE OR REPLACE FUNCTION list_admin_accounts(p_owner_username TEXT, p_owner_password TEXT)
RETURNS JSON AS $$
DECLARE
  owner_check JSON;
  accounts JSON;
BEGIN
  SELECT verify_admin_login(p_owner_username, p_owner_password) INTO owner_check;
  IF owner_check IS NULL OR (owner_check->>'role') != 'owner' THEN
    RETURN json_build_object('error', 'Unauthorized');
  END IF;

  SELECT json_agg(json_build_object(
    'id', id,
    'username', username,
    'display_name', display_name,
    'role', role,
    'is_active', is_active,
    'created_at', created_at
  ) ORDER BY created_at DESC) INTO accounts
  FROM admin_accounts;

  RETURN COALESCE(accounts, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. RPC: Toggle admin account active/inactive (owner only)
CREATE OR REPLACE FUNCTION toggle_admin_account(
  p_owner_username TEXT,
  p_owner_password TEXT,
  p_target_id UUID
)
RETURNS JSON AS $$
DECLARE
  owner_check JSON;
BEGIN
  SELECT verify_admin_login(p_owner_username, p_owner_password) INTO owner_check;
  IF owner_check IS NULL OR (owner_check->>'role') != 'owner' THEN
    RETURN json_build_object('error', 'Unauthorized');
  END IF;

  UPDATE admin_accounts SET is_active = NOT is_active WHERE id = p_target_id;
  RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- 8. INSERT YOUR OWNER ACCOUNT (run this once!)
-- ================================================
INSERT INTO admin_accounts (username, password_hash, display_name, role)
VALUES ('Nanda', crypt('Nandhu@2306@1305', gen_salt('bf')), 'Nanda Kumar', 'owner')
ON CONFLICT (username) DO NOTHING;
