-- Your schema DDL (create table statements) goes here 

-- Users
DROP TABLE IF EXISTS people CASCADE;
CREATE TABLE people(user_id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), people jsonb);
CREATE UNIQUE INDEX email_idx ON people((people->>'email'));

-- Workspaces, jsonb if want to add something in future
DROP TABLE IF EXISTS workspace CASCADE;
CREATE TABLE workspace(ws_id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES people(user_id) ON DELETE CASCADE, workspace jsonb);

-- User access to workspaces
DROP TABLE IF EXISTS wspuser;
CREATE TABLE wspuser(user_id UUID REFERENCES people(user_id) ON DELETE CASCADE, ws_id UUID REFERENCES workspace(ws_id) ON DELETE CASCADE, UNIQUE (user_id, ws_id));

-- User invitations to workspaces
DROP TABLE IF EXISTS invitews;
CREATE TABLE invitews(user_id UUID REFERENCES people(user_id) ON DELETE CASCADE, ws_id UUID REFERENCES workspace(ws_id) ON DELETE CASCADE, UNIQUE (user_id, ws_id));

-- Channel, jsonb if want to add something in future
DROP TABLE IF EXISTS channel CASCADE;
CREATE TABLE channel(ch_id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), ws_id UUID REFERENCES workspace(ws_id) ON DELETE CASCADE, channel jsonb);
CREATE UNIQUE INDEX chname_idx ON channel((channel->>'name'));
-- Challenge: Cant have same channel names, even in diff workspaces
-- Remove Index and check manually ??

-- Channel Access
DROP TABLE IF EXISTS chuser;
CREATE TABLE chuser(ch_id UUID REFERENCES channel(ch_id) ON DELETE CASCADE, ws_id UUID REFERENCES workspace(ws_id) ON DELETE CASCADE, user_id UUID REFERENCES people(user_id) ON DELETE CASCADE, UNIQUE (user_id, ch_id));
-- Problem: Revoke access Workspace but if still has chid can access it

-- Message, jsonb if want to add something in future
DROP TABLE IF EXISTS message CASCADE;
CREATE TABLE message(ms_id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), ch_id UUID REFERENCES channel(ch_id) ON DELETE CASCADE, user_id UUID REFERENCES people(user_id), message jsonb);
