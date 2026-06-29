# Task 003 — Trade Record Page

## Objective

Create the first TrustLayer Trade Record page.

This page should present the complete historical record of a single trade.

The page must demonstrate that TrustLayer records history rather than judging people.

---

## References

- PROJECT_BIBLE.md
- docs/architecture/trade-event-model.md
- docs/architecture/reputation-model.md
- docs/ui/trade-page.md
- docs/glossary/glossary.md

---

## Requirements

Create a public trade record page using static mock data.

Suggested route:

/trade/tr-000001

The page should contain:

### Trade Summary

- Trade ID
- Trade Status
- Trade Date
- Marketplace
- Category

---

### Participants

Buyer

Seller

Each participant links to their Reputation Profile.

---

### Timeline

Display historical events in chronological order.

Example:

Trade Created

↓

Buyer Accepted

↓

Meeting Scheduled

↓

Trade Completed

↓

Buyer Confirmed

↓

Seller Confirmed

↓

Trade Recorded

---

### Attached Evidence

Display available evidence.

Examples:

Marketplace Listing

Listing Screenshot

Trade Description

Timestamp

Hash ID

Evidence availability only.

No image uploads yet.

---

### TrustLayer Notes

Display a short explanation.

Example:

This page records historical events only.

TrustLayer does not determine who is right or wrong.

Users should interpret the historical record themselves.

---

## Deliverables

Working page:

/trade/tr-000001

Static data only.

No API.

No backend.

No database.

---

## Constraints

Must follow PROJECT_BIBLE.

Do not add dispute judgement.

Do not add comments.

Do not add ratings.

Do not add likes.

Do not add recommendations.

Do not determine fault.

Keep implementation minimal.

---

## Acceptance Criteria

[ ] npm run dev passes

[ ] npm run build passes

[ ] Trade page loads

[ ] Timeline displays correctly

[ ] Buyer profile links work

[ ] Seller profile links work

[ ] No business logic

[ ] Mobile friendly

---

## Success Definition

After viewing the page, a user should understand:

- What happened
- When it happened
- Who participated
- What evidence exists

The page should help users make informed decisions without making the decision for them.