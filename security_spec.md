# Security Specification: Aabiskar Portfolio & Admin

## 1. Data Invariants

1. **Public Read Integrity**: All visitors can query and read published projects in the `/projects` collection to view the portfolio.
2. **Admin-Only Mutation**: Only authenticated users with admin privileges (matching the authenticated Google account) can create, update, or delete projects in `/projects`.
3. **Payload Sanitization**: Projects must conform to structural bounds: title <= 120 chars, client <= 100 chars, summary <= 2000 chars, category in `['3d', 'video', 'graphic', 'interactive']`.
4. **No Document Poisoning**: Project IDs must be valid alphanumeric strings.

## 2. Dirty Dozen Security Payloads

1. Unauthenticated Project Insertion: Attacker attempts to POST a fake project to `/projects/bad-proj`. Expected: `PERMISSION_DENIED`.
2. Unauthenticated Project Deletion: Attacker attempts to DELETE `/projects/1`. Expected: `PERMISSION_DENIED`.
3. Unauthenticated Project Update: Attacker attempts to change project title. Expected: `PERMISSION_DENIED`.
4. Invalid Category Injection: Attacker attempts to set category: `"crypto_scam"`. Expected: `PERMISSION_DENIED`.
5. Oversized Payload Injection: Attacker attempts to inject a 2MB summary string into `/projects/1`. Expected: `PERMISSION_DENIED`.
6. Document ID Poisoning: Attacker uses junk character path. Expected: `PERMISSION_DENIED`.
7. Client Self-Promoted Admin: Attacker writes their UID into `/admins/{uid}` without authorization. Expected: `PERMISSION_DENIED`.
8. Ghost Field Shadow Write: Attacker writes arbitrary fields into project doc. Expected: `PERMISSION_DENIED`.
9. Non-string Title Type Mismatch: Attacker sets title to boolean `true`. Expected: `PERMISSION_DENIED`.
10. Unverified Email Admin Access: Attacker with unverified email attempts write. Expected: `PERMISSION_DENIED`.
11. Arbitrary Collection Query Scraping: Insecure blanket list queries on non-existent or internal collections blocked. Expected: `PERMISSION_DENIED`.
12. Malformed Document Update: Attacker attempts update without valid project entity structure. Expected: `PERMISSION_DENIED`.
