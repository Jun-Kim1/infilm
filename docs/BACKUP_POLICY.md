# Supabase backup policy

The database is backed up every day at 03:00 Asia/Seoul by
`.github/workflows/supabase-backup.yml`. A manual run is also available from
GitHub Actions.

## Retention and security

- Roles, schema, and table data are exported separately with the Supabase CLI.
- The files are packed and encrypted with AES-256-CBC and PBKDF2 before upload.
- Only the encrypted archive and its SHA-256 checksum are uploaded.
- GitHub keeps each backup artifact for 14 days.
- Chat messages are retained in the database; this workflow does not delete them.
- Supabase Storage objects are not included. Add a separate Storage backup before
  file uploads become a production feature.

The repository is public. Never commit a database URL, password, decrypted dump,
or encryption passphrase.

## Required GitHub secrets

Add these repository secrets before enabling the first backup:

1. `SUPABASE_DB_PASSWORD`: the raw Supabase database password. The workflow URL
   encodes it and constructs the fixed session-pooler connection string without
   printing the value.
2. `BACKUP_ENCRYPTION_PASSPHRASE`: a unique high-entropy passphrase. Generate one
   locally with `openssl rand -base64 48` and store a recovery copy in a password
   manager outside GitHub.

After adding both secrets, run **Encrypted Supabase backup** manually once and
confirm that the encrypted artifact is present and the workflow is green.

An older `SUPABASE_DB_URL` secret is not used and can be removed after the first
successful backup.

## Restore drill

Download an artifact, verify the checksum, and decrypt it locally:

```bash
sha256sum -c infilm-supabase-*.tar.gz.enc.sha256
openssl enc -d -aes-256-cbc -pbkdf2 \
  -in infilm-supabase-*.tar.gz.enc \
  -out infilm-supabase-backup.tar.gz
tar -xzf infilm-supabase-backup.tar.gz
```

Restore into a disposable Supabase project first. Apply `roles.sql`, `schema.sql`,
and `data.sql` in that order, verify authentication and RLS, and only then use the
backup for production recovery.
