Bulk internship import — README

This repo contains two helper scripts and two JSON payloads to import internships into the SQLite DB used by the app.

Files added
- `internships_bulk.json` — small sample payload (used earlier)
- `internships_full.json` — the cleaned payload containing 25 internships (IDs 1..25)
- `scripts/bulk_upsert_internships.js` — ESM Node script that upserts entries from `internships_bulk.json` (safe upsert using ON CONFLICT)
- `scripts/replace_internships_with_full.js` — ESM Node script that deletes any internships whose IDs appear in `internships_full.json` and inserts the payload. Runs in a single transaction.

How to run
1. Ensure dependencies are installed (the project already uses `sqlite3` and Node 18+). From the repo root:

   node -v

2. To run the upsert script (will upsert the file `internships_bulk.json`):

   node scripts/bulk_upsert_internships.js

3. To replace (delete existing IDs and insert the full payload):

   node scripts/replace_internships_with_full.js

Important notes
- Both scripts assume `database.sqlite` is located at the project root (same place the app uses by default).
- `replace_internships_with_full.js` will DELETE rows with matching IDs before inserting. Use with caution.
- The scripts normalize missing arrays/fields into safe defaults (empty arrays, empty strings, 0 for numbers).

Alternative: API-based import
- If you prefer to import via the server API, authenticate as an admin and call the bulk endpoint:
  - POST /api/auth/login -> get token
  - PUT /api/internships/bulk/update with `internships_full.json` as body

If you want, I can:
- Add a small npm script to run these commands (e.g., `npm run import:replace`).
- Revert the DB changes and only use API-based import instead.
- Export the current internships to CSV/JSON for review.
