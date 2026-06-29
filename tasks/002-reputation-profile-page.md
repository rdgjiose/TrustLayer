Task 002 — Reputation Profile Page

Objective

Create the first MVP version of the TrustLayer Reputation Profile page.

This page should show how TrustLayer presents trading reputation as historical evidence, not as a single score.

⸻

References

* PROJECT_BIBLE.md
* prompts/codex-system.md
* docs/ui/reputation-profile.md
* docs/architecture/reputation-model.md
* docs/glossary/glossary.md
* tasks/completed/001-project-bootstrap.md

⸻

Requirements

* Add a route for a public reputation profile page.
* Use a sample TrustLayer user profile with static mock data.
* Display the core MVP profile fields:
    * display name
    * TrustLayer ID
    * member since
    * completed trades
    * confirmation rate
    * dispute count
    * verification status
    * reputation confidence
    * recent activity
    * public event timeline
* Use TrustLayer vocabulary:
    * Reputation Profile
    * Reputation Events
    * Trading History
    * Reputation Confidence
* The page must be mobile-first and readable.

⸻

Suggested Route

Use:

/u/tl-9f32a

Example local URL:

http://localhost:3000/u/tl-9f32a

⸻

Deliverables

* A working Reputation Profile page.
* Static mock data only.
* Clean reusable frontend components if useful.
* No API calls yet.
* No backend changes unless necessary.

⸻

Out of Scope

* No login
* No database
* No blockchain
* No real user accounts
* No profile editing
* No marketplace integration
* No universal trust score

⸻

Constraints

* Must follow PROJECT_BIBLE.md.
* Must follow docs/ui/reputation-profile.md.
* Do not use star ratings.
* Do not use “good user” or “bad user” labels.
* Do not create a universal social credit score.
* Keep implementation minimal.

⸻

Acceptance Criteria

[ ] npm run dev succeeds

[ ] npm run typecheck passes

[ ] npm run lint passes

[ ] npm run build passes

[ ] http://localhost:3000/u/tl-9f32a loads successfully

[ ] Page shows sample Reputation Profile data

[ ] Page uses history-based metrics, not star ratings

[ ] Page is readable on mobile screen width

⸻

Success Definition

Task 002 is successful when a user can open a TrustLayer reputation profile page and immediately understand:

* who the profile belongs to
* how long the profile has existed
* how much trading history exists
* how strong the evidence is
* what recent events support the reputation

The page should support trust decisions without making the decision for the user.