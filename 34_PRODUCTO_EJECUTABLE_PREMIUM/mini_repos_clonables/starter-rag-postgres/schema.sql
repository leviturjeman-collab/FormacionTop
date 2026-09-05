CREATE TABLE IF NOT EXISTS document_chunks (
  owner_id text NOT NULL, document_id text NOT NULL, version text NOT NULL,
  position integer NOT NULL CHECK (position >= 0), title text NOT NULL, body text NOT NULL,
  PRIMARY KEY(owner_id, document_id, position)
);
-- A web service MUST derive owner_id from an authenticated session.
