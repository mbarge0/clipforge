-- ============================================================================
-- Slack Lite - Database Schema with Row-Level Security
-- ============================================================================
-- Project: Slack Lite (Dry Run Edition)
-- Database: Supabase PostgreSQL
-- Version: 1.0
-- Last Updated: October 10, 2025
-- 
-- INSTRUCTIONS:
-- 1. Run this script in Supabase SQL Editor
-- 2. Verify all tables are created successfully
-- 3. Verify RLS is enabled on all tables
-- 4. Test RLS policies with test users
-- 5. Seed #general channel (see bottom of file)
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Users Table
-- ----------------------------------------------------------------------------
-- Stores user profiles and display names
-- Auth is handled by Supabase Auth (auth.users)
-- This table extends auth.users with app-specific data

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add comment for documentation
COMMENT ON TABLE users IS 'User profiles with display names, extends Supabase auth.users';

-- ----------------------------------------------------------------------------
-- Channels Table
-- ----------------------------------------------------------------------------
-- Stores chat channels (public and private)

CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  is_private BOOLEAN DEFAULT FALSE NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT channels_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 50),
  CONSTRAINT channels_name_format CHECK (name ~ '^[a-zA-Z0-9_-]+$')
);

-- Add comment for documentation
COMMENT ON TABLE channels IS 'Chat channels, supports public and private channels';
COMMENT ON COLUMN channels.is_private IS 'If true, only members can see and access this channel';
COMMENT ON COLUMN channels.name IS 'Unique channel name, 1-50 chars, alphanumeric + hyphens/underscores';

-- ----------------------------------------------------------------------------
-- Messages Table
-- ----------------------------------------------------------------------------
-- Stores chat messages

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'user' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT messages_content_length CHECK (char_length(content) >= 1 AND char_length(content) <= 2000),
  CONSTRAINT messages_type_valid CHECK (message_type IN ('user', 'ai_summary'))
);

-- Add comment for documentation
COMMENT ON TABLE messages IS 'Chat messages, supports user messages and AI summaries';
COMMENT ON COLUMN messages.message_type IS 'Type of message: "user" for normal messages, "ai_summary" for AI-generated summaries (future)';
COMMENT ON COLUMN messages.updated_at IS 'Timestamp of last edit, used to show "(edited)" indicator';

-- ----------------------------------------------------------------------------
-- Channel Members Table
-- ----------------------------------------------------------------------------
-- Tracks channel membership (for private channels and permissions)

CREATE TABLE IF NOT EXISTS channel_members (
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Composite primary key
  PRIMARY KEY (channel_id, user_id)
);

-- Add comment for documentation
COMMENT ON TABLE channel_members IS 'Channel membership tracking, determines who can access which channels';

-- ----------------------------------------------------------------------------
-- User Presence Table
-- ----------------------------------------------------------------------------
-- Tracks online/offline status of users

CREATE TABLE IF NOT EXISTS user_presence (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  online BOOLEAN DEFAULT FALSE NOT NULL,
  last_seen TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add comment for documentation
COMMENT ON TABLE user_presence IS 'User presence tracking, shows who is currently online';
COMMENT ON COLUMN user_presence.last_seen IS 'Timestamp of last heartbeat, used to determine if user is still active';

-- ============================================================================
-- INDEXES (Performance Optimization)
-- ============================================================================

-- Messages: Fast recent message queries (channel timeline)
CREATE INDEX IF NOT EXISTS idx_messages_channel_created 
  ON messages(channel_id, created_at DESC);

-- Messages: User's messages (for edit/delete permission checks)
CREATE INDEX IF NOT EXISTS idx_messages_user 
  ON messages(user_id);

-- Channels: Fast channel name lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_channels_name 
  ON channels(name);

-- Channel Members: Fast membership lookups (covered by PK, but explicit for clarity)
-- Note: Composite PK (channel_id, user_id) already provides this index

-- User Presence: Fast lookup by user (covered by PK)
-- Note: PK on user_id already provides this index

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Enable RLS on all tables
-- ----------------------------------------------------------------------------

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Users Table Policies
-- ----------------------------------------------------------------------------

-- Policy: Users can view their own profile
CREATE POLICY "users_select_own" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own display_name
CREATE POLICY "users_update_own" ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Users can insert their own profile (on first login)
CREATE POLICY "users_insert_own" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- Channels Table Policies
-- ----------------------------------------------------------------------------

-- Policy: Users can view all public channels
CREATE POLICY "channels_select_public" ON channels
  FOR SELECT
  USING (is_private = FALSE);

-- Policy: Users can view private channels they're members of
CREATE POLICY "channels_select_private_member" ON channels
  FOR SELECT
  USING (
    is_private = TRUE 
    AND EXISTS (
      SELECT 1 FROM channel_members 
      WHERE channel_members.channel_id = channels.id 
        AND channel_members.user_id = auth.uid()
    )
  );

-- Policy: Any authenticated user can create channels
CREATE POLICY "channels_insert_authenticated" ON channels
  FOR INSERT
  WITH CHECK (
    auth.uid() = created_by
    AND auth.role() = 'authenticated'
  );

-- Policy: Channel creators can update their channels
CREATE POLICY "channels_update_creator" ON channels
  FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- ----------------------------------------------------------------------------
-- Messages Table Policies
-- ----------------------------------------------------------------------------

-- Policy: Users can view messages from channels they're members of
CREATE POLICY "messages_select_member" ON messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM channel_members 
      WHERE channel_members.channel_id = messages.channel_id 
        AND channel_members.user_id = auth.uid()
    )
  );

-- Policy: Users can insert messages to channels they're members of
CREATE POLICY "messages_insert_member" ON messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM channel_members 
      WHERE channel_members.channel_id = messages.channel_id 
        AND channel_members.user_id = auth.uid()
    )
  );

-- Policy: Users can update only their own messages
CREATE POLICY "messages_update_own" ON messages
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete only their own messages
CREATE POLICY "messages_delete_own" ON messages
  FOR DELETE
  USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Channel Members Table Policies
-- ----------------------------------------------------------------------------

-- Policy: Users can view memberships for channels they're in
CREATE POLICY "members_select_own_channels" ON channel_members
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM channel_members cm
      WHERE cm.channel_id = channel_members.channel_id 
        AND cm.user_id = auth.uid()
    )
  );

-- Policy: Channel creators can add members to their channels
CREATE POLICY "members_insert_creator" ON channel_members
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM channels 
      WHERE channels.id = channel_id 
        AND channels.created_by = auth.uid()
    )
  );

-- Policy: Users can join public channels themselves
CREATE POLICY "members_insert_self_public" ON channel_members
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM channels
      WHERE channels.id = channel_id
        AND channels.is_private = FALSE
    )
  );

-- Policy: Channel creators can remove members from their channels
CREATE POLICY "members_delete_creator" ON channel_members
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM channels 
      WHERE channels.id = channel_id 
        AND channels.created_by = auth.uid()
    )
  );

-- Policy: Users can leave channels themselves
CREATE POLICY "members_delete_self" ON channel_members
  FOR DELETE
  USING (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- User Presence Table Policies
-- ----------------------------------------------------------------------------

-- Policy: All authenticated users can view presence
CREATE POLICY "presence_select_all" ON user_presence
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Users can insert their own presence
CREATE POLICY "presence_insert_own" ON user_presence
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own presence
CREATE POLICY "presence_update_own" ON user_presence
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Function: Update updated_at timestamp on message edits
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Automatically update updated_at when message is edited
CREATE TRIGGER trigger_update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_messages_updated_at();

-- ----------------------------------------------------------------------------
-- Function: Auto-create user profile on signup
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create user profile when auth.users record is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- REALTIME CONFIGURATION
-- ============================================================================

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE channels;
ALTER PUBLICATION supabase_realtime ADD TABLE channel_members;
ALTER PUBLICATION supabase_realtime ADD TABLE user_presence;

-- Note: users table doesn't need realtime (auth changes are rare)

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Create #general channel (if not exists)
-- ----------------------------------------------------------------------------
-- This should be run after first user signs up, or create a system user

-- Option 1: Create #general with no creator (manual insert, bypasses RLS)
-- Run this as a Supabase admin in SQL editor:

INSERT INTO channels (id, name, description, is_private, created_by)
VALUES (
  '00000000-0000-0000-0000-000000000001', -- Fixed UUID for #general
  'general',
  'General discussion channel for everyone',
  FALSE,
  NULL -- No creator, or set to first user's ID
)
ON CONFLICT (name) DO NOTHING;

-- Option 2: Create a system user (recommended for production)
-- Uncomment if you want a dedicated system user:

/*
INSERT INTO users (id, email, display_name)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'system@slacklite.app',
  'System'
)
ON CONFLICT (id) DO NOTHING;

-- Then create #general owned by system user
INSERT INTO channels (id, name, description, is_private, created_by)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'general',
  'General discussion channel for everyone',
  FALSE,
  '00000000-0000-0000-0000-000000000000' -- System user
)
ON CONFLICT (name) DO NOTHING;
*/

-- ============================================================================
-- TESTING QUERIES
-- ============================================================================

-- Use these queries to verify the schema and RLS policies

-- Test 1: Check all tables exist
/*
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'channels', 'messages', 'channel_members', 'user_presence');
*/

-- Test 2: Check RLS is enabled
/*
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'channels', 'messages', 'channel_members', 'user_presence');
*/

-- Test 3: Check indexes exist
/*
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('messages', 'channels');
*/

-- Test 4: Check RLS policies
/*
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
*/

-- ============================================================================
-- MIGRATION NOTES
-- ============================================================================

-- Version 1.0 - Initial schema
-- - Created all core tables
-- - Implemented RLS policies
-- - Added performance indexes
-- - Set up realtime
-- - Created #general channel seed

-- Future migrations:
-- - Add message reactions table
-- - Add file attachments (with Supabase Storage)
-- - Add user settings/preferences table
-- - Add AI summary tracking table

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

