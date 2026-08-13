-- World Latte Art Throwdown v1 schema (MySQL).
-- Runtime currently uses the in-memory store with this relational model.
-- Apply in production with drizzle or your MySQL client when DATABASE_URL is set.

CREATE TABLE IF NOT EXISTS wlat_members (
  id CHAR(36) PRIMARY KEY,
  auth_user_id BIGINT UNSIGNED NULL,
  identity_provider VARCHAR(32) NOT NULL,
  external_subject VARCHAR(255) NULL,
  external_member_id VARCHAR(255) NULL,
  last_identity_sync_at DATETIME NULL,
  email_normalized VARCHAR(320) NULL,
  display_name VARCHAR(255) NOT NULL,
  given_name VARCHAR(120) NULL,
  family_name VARCHAR(120) NULL,
  country_code VARCHAR(8) NULL,
  city VARCHAR(120) NULL,
  preferred_language VARCHAR(16) NOT NULL DEFAULT 'en',
  avatar_path TEXT NULL,
  public_bio TEXT NULL,
  affiliation_name VARCHAR(255) NULL,
  public_profile_consent TINYINT(1) NOT NULL DEFAULT 0,
  profile_completed_at DATETIME NULL,
  suspended_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  UNIQUE KEY wlat_members_email (email_normalized),
  UNIQUE KEY wlat_members_external (identity_provider, external_subject)
);

CREATE TABLE IF NOT EXISTS wlat_events (
  id CHAR(36) PRIMARY KEY,
  product_type VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  description TEXT NULL,
  owner_member_id CHAR(36) NOT NULL,
  organisation_name VARCHAR(255) NULL,
  venue_name VARCHAR(255) NULL,
  city VARCHAR(120) NULL,
  country_code VARCHAR(8) NULL,
  timezone VARCHAR(64) NOT NULL,
  starts_at DATETIME NULL,
  ends_at DATETIME NULL,
  status VARCHAR(32) NOT NULL,
  field_size INT NOT NULL,
  competition_format VARCHAR(32) NOT NULL,
  judging_delivery_mode VARCHAR(32) NOT NULL,
  voting_model VARCHAR(32) NOT NULL,
  official_judge_count INT NOT NULL,
  participation_structure VARCHAR(32) NOT NULL,
  equipment_mode VARCHAR(32) NOT NULL,
  rules_version VARCHAR(32) NOT NULL,
  roster_locked_at DATETIME NULL,
  bracket_locked_at DATETIME NULL,
  completed_at DATETIME NULL,
  published_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  CONSTRAINT wlat_events_field CHECK (field_size BETWEEN 8 AND 128)
);

CREATE TABLE IF NOT EXISTS wlat_event_runtime_locks (
  event_id CHAR(36) PRIMARY KEY,
  station_id CHAR(36) NOT NULL,
  active_heat_id CHAR(36) NULL,
  active_timer_run_id CHAR(36) NULL,
  version INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS wlat_stations (
  id CHAR(36) PRIMARY KEY,
  event_id CHAR(36) NOT NULL,
  name VARCHAR(120) NOT NULL,
  ordinal INT NOT NULL,
  status VARCHAR(32) NOT NULL,
  is_enabled TINYINT(1) NOT NULL,
  created_at DATETIME NOT NULL,
  UNIQUE KEY wlat_stations_event_ordinal (event_id, ordinal)
);

CREATE TABLE IF NOT EXISTS wlat_heats (
  id CHAR(36) PRIMARY KEY,
  event_id CHAR(36) NOT NULL,
  station_id CHAR(36) NOT NULL,
  bracket_node_id CHAR(36) NOT NULL,
  heat_number INT NOT NULL,
  state VARCHAR(32) NOT NULL,
  state_version INT NOT NULL,
  restart_number INT NOT NULL DEFAULT 0,
  winner_blind_entry CHAR(1) NULL,
  winner_entry_id CHAR(36) NULL,
  finalized_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS wlat_heat_blind_mappings (
  id CHAR(36) PRIMARY KEY,
  heat_id CHAR(36) NOT NULL,
  mapping_version VARCHAR(32) NOT NULL,
  entry_a_id CHAR(36) NOT NULL,
  entry_b_id CHAR(36) NOT NULL,
  generated_at DATETIME NOT NULL,
  voided_at DATETIME NULL
);

CREATE TABLE IF NOT EXISTS wlat_ballots (
  id CHAR(36) PRIMARY KEY,
  ballot_round_id CHAR(36) NOT NULL,
  heat_id CHAR(36) NOT NULL,
  voter_member_id CHAR(36) NOT NULL,
  selected_blind_entry CHAR(1) NOT NULL,
  feedback_text TEXT NOT NULL,
  submitted_at DATETIME NOT NULL,
  status VARCHAR(16) NOT NULL,
  voided_at DATETIME NULL,
  UNIQUE KEY wlat_ballots_unique (ballot_round_id, voter_member_id, status)
);

CREATE TABLE IF NOT EXISTS wlat_audit_events (
  id CHAR(36) PRIMARY KEY,
  event_id CHAR(36) NULL,
  heat_id CHAR(36) NULL,
  actor_member_id CHAR(36) NULL,
  actor_type VARCHAR(16) NOT NULL,
  action VARCHAR(64) NOT NULL,
  entity_type VARCHAR(64) NOT NULL,
  entity_id CHAR(36) NOT NULL,
  before_json JSON NULL,
  after_json JSON NULL,
  reason TEXT NULL,
  request_id VARCHAR(64) NULL,
  created_at DATETIME NOT NULL
);

-- v1: exactly one enabled station is enforced in domain services.
-- Replace event-level active_heat_id uniqueness with station-level uniqueness in v2.
