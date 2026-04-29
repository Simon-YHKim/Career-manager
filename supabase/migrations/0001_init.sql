-- Sprint 1: schema scaffold for documents, projects, tasks, memories.
--
-- This migration creates tables only. RLS policies are added in S2 (Auth)
-- and S4 (Document/Version) sprints. The pgvector extension and the
-- `memories.embedding` column are intentionally deferred to S24.
--
-- Spec references:
--   v1 §1.3   document, document_version, document_snapshot
--   v1 §4.1   project, project_atom_link
--   v2 §1.10  tasks
--   v2 §2.5   memories (without vector column)

set check_function_bodies = off;

-- ---------------------------------------------------------------------------
-- Projects (per-job-posting workspace)
-- ---------------------------------------------------------------------------
create table if not exists project (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null,
  name            text not null,
  company         text,
  jd_url          text,
  jd_archived_html text,
  track           text check (track in (
                    'kr_chaebol','kr_startup','kr_foreign','kr_public',
                    'us_bigtech','us_consulting','us_ib','global_design'
                  )),
  stage           text default 'applied' check (stage in (
                    'applied','screen','1st','2nd','final','offer',
                    'rejected','withdrawn'
                  )),
  priority        smallint default 3 check (priority between 1 and 5),
  deadline        date,
  tags            text[] default '{}',
  pinned          boolean default false,
  archived        boolean default false,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index if not exists idx_project_user_stage on project(user_id, stage, archived);

-- ---------------------------------------------------------------------------
-- Documents (everything user-authored: profile, atoms, resumes, etc.)
-- ---------------------------------------------------------------------------
create table if not exists document (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null,
  project_id      uuid references project(id) on delete set null,
  type            text not null check (type in (
                    'career_profile','experience_atom','career_description',
                    'cover_letter','resume','mock_interview','negotiation_sim',
                    'portfolio','application','company_research','jd_analysis',
                    'memo','schedule'
                  )),
  title           text not null,
  body            jsonb not null,
  schema_version  text not null,
  current_version int not null default 1,
  tags            text[] default '{}',
  killer_class    text default 'unknown' check (killer_class in (
                    '필살기','빌살기','밉살기','unknown'
                  )),
  engine_used     text check (engine_used in ('G','S','L','AB','AD')),
  evaluation_mode text check (evaluation_mode in ('coaching','evaluation')),
  content_hash    text not null,
  blob_ref        text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  deleted_at      timestamptz
);
create index if not exists idx_document_body on document using gin (body jsonb_path_ops);
create index if not exists idx_document_user_type on document (user_id, type, project_id);

-- Append-only version history for documents.
create table if not exists document_version (
  id               uuid primary key default gen_random_uuid(),
  document_id      uuid not null references document(id) on delete cascade,
  version          int not null,
  body             jsonb not null,
  diff             jsonb,
  message          text,
  author           text not null,
  evaluation_score jsonb,
  content_hash     text not null,
  created_at       timestamptz default now(),
  unique(document_id, version)
);

-- Periodic snapshots for disaster recovery / Article 20 export.
create table if not exists document_snapshot (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null,
  cadence         text not null check (cadence in (
                    'hourly','daily','manual','export'
                  )),
  payload         jsonb not null,
  payload_size_bytes bigint,
  blob_ref        text,
  created_at      timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Reuse links: a STAR atom can be cited by multiple projects/artifacts.
-- ---------------------------------------------------------------------------
create table if not exists project_atom_link (
  project_id  uuid references project(id) on delete cascade,
  atom_id     uuid references document(id) on delete cascade,
  used_in     text not null,
  created_at  timestamptz default now(),
  primary key (project_id, atom_id, used_in)
);

-- ---------------------------------------------------------------------------
-- Tasks (planner / coach output)
-- ---------------------------------------------------------------------------
create table if not exists tasks (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null,
  project_id      uuid references project(id) on delete set null,
  parent_task_id  uuid references tasks(id) on delete cascade,
  title           text not null,
  description     text,
  category        text check (category in (
                    'study','write','practice','external','life','admin'
                  )),
  priority        smallint check (priority between 1 and 5),
  deadline        timestamptz,
  estimated_min   integer default 30,
  scheduled_start timestamptz,
  scheduled_end   timestamptz,
  status          text default 'todo' check (status in (
                    'todo','in_progress','done','cancelled','blocked'
                  )),
  dependencies    uuid[] default '{}',
  recurrence_rule text,
  external_calendar_event_ids jsonb default '[]'::jsonb,
  ai_recommended  boolean default false,
  why_recommended text,
  source_engine   text check (source_engine in ('G','S','L','AB','AD','user')),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  completed_at    timestamptz
);
create index if not exists idx_tasks_user_deadline on tasks(user_id, deadline);
create index if not exists idx_tasks_user_status   on tasks(user_id, status);
create index if not exists idx_tasks_project       on tasks(project_id);

-- ---------------------------------------------------------------------------
-- Memories (curated, evidence-backed; embedding column added in S24).
-- ---------------------------------------------------------------------------
create table if not exists memories (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null,
  type              text check (type in (
                      'factual','preference','weakness','strength',
                      'decision','outcome','pattern','method'
                    )),
  title             text not null,
  content           text not null,
  evidence_refs     jsonb default '[]'::jsonb,
  source_project_id uuid references project(id) on delete set null,
  source_activity   text,
  confidence        real check (confidence between 0 and 1),
  is_curated        boolean default false,
  curated_at        timestamptz,
  expires_at        timestamptz,
  privacy_level     text default 'normal' check (privacy_level in (
                      'normal','masked_pii','local_only'
                    )),
  -- embedding vector(1536),  -- TODO(S24): activate after `create extension vector;`
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);
create index if not exists idx_memories_user_type on memories(user_id, type)
  where is_curated = true;
