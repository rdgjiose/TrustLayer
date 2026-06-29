TrustLayer API Design

Document: docs/api/api-design.md
Version: 1.0
Status: Draft

⸻

1. Purpose

This document defines the initial API design for TrustLayer MVP 0.1.

The API connects:

* Frontend PWA
* Cloudflare Workers
* Cloudflare D1 database
* Future blockchain ledger
* Future marketplace integrations

The API should remain simple, predictable, and easy for Codex to implement.

⸻

2. API Philosophy

The API must follow the TrustLayer Project Bible.

Core principles:

* Reputation belongs to people, not platforms.
* TrustLayer records events, not opinions.
* History is append-only.
* The system records behaviour, not final truth.
* Blockchain stores evidence references, not reputation scores.

⸻

3. Base URL

Development:

http://localhost:8787/api

Production:

https://api.trustlayer.nz/api

MVP deployment may use a Cloudflare Workers preview URL.

⸻

4. Response Format

All API responses should use JSON.

Successful response:

{
  "success": true,
  "data": {}
}

Error response:

{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}

⸻

5. Authentication

MVP may start with simple session-based or token-based authentication.

Future authentication may include:

* email OTP
* phone OTP
* wallet signature
* DID

Authenticated endpoints require a valid user session.

Public endpoints should never expose private identity data.

⸻

6. Public Profile API

GET /users/:trustlayerId/profile

Returns a public reputation profile.

Example response:

{
  "success": true,
  "data": {
    "trustlayerId": "TL-9F32A",
    "displayName": "Jasper H.",
    "memberSince": "2026-06-28",
    "reputationDomain": "trading",
    "stats": {
      "completedTrades": 12,
      "totalTrades": 13,
      "confirmationRate": 0.92,
      "disputeCount": 0,
      "reputationConfidence": "medium"
    },
    "verification": {
      "emailVerified": true,
      "phoneVerified": false
    },
    "recentActivity": [
      {
        "eventType": "trade_completed",
        "createdAt": "2026-06-28T10:00:00Z"
      }
    ]
  }
}

Private data must not be returned.

⸻

7. Current User API

GET /me

Returns current authenticated user.

{
  "success": true,
  "data": {
    "userId": "usr_123",
    "trustlayerId": "TL-9F32A",
    "displayName": "Jasper H.",
    "publicProfileSlug": "tl-9f32a"
  }
}

⸻

8. Create User API

POST /users

Creates a new user profile.

Request:

{
  "displayName": "Jasper H.",
  "email": "jasper@example.com"
}

Response:

{
  "success": true,
  "data": {
    "userId": "usr_123",
    "trustlayerId": "TL-9F32A",
    "publicProfileSlug": "tl-9f32a"
  }
}

MVP may simplify authentication.

Do not expose raw identity values publicly.

⸻

9. Create Trade API

POST /trades

Creates a new trade link.

Request:

{
  "role": "buyer",
  "marketplaceName": "facebook_marketplace",
  "externalUrl": "https://example.com/listing/123",
  "itemTitle": "iPhone 14",
  "itemSummary": "Used iPhone 14, good condition"
}

Response:

{
  "success": true,
  "data": {
    "tradeId": "trd_123",
    "tradeCode": "TR-8K2P4",
    "tradeUrl": "https://trustlayer.nz/t/TR-8K2P4",
    "status": "created"
  }
}

⸻

10. Get Trade API

GET /trades/:tradeCode

Returns trade page data.

Response:

{
  "success": true,
  "data": {
    "tradeId": "trd_123",
    "tradeCode": "TR-8K2P4",
    "status": "pending_acceptance",
    "item": {
      "title": "iPhone 14",
      "summary": "Used iPhone 14, good condition",
      "marketplaceName": "facebook_marketplace",
      "externalUrl": "https://example.com/listing/123"
    },
    "participants": {
      "buyer": {
        "trustlayerId": "TL-BUYER"
      },
      "seller": null
    },
    "timeline": [
      {
        "eventType": "trade_created",
        "createdAt": "2026-06-28T10:00:00Z"
      }
    ]
  }
}

⸻

11. Accept Trade API

POST /trades/:tradeCode/accept

Allows the invited party to join the trade.

Request:

{
  "role": "seller"
}

Response:

{
  "success": true,
  "data": {
    "tradeCode": "TR-8K2P4",
    "status": "accepted"
  }
}

⸻

12. Confirm Completion API

POST /trades/:tradeCode/confirm-completion

Records buyer or seller confirmation.

Request:

{
  "role": "buyer"
}

Response:

{
  "success": true,
  "data": {
    "tradeCode": "TR-8K2P4",
    "status": "buyer_confirmed"
  }
}

If both buyer and seller confirm, status becomes:

completed

and a trade_completed reputation event is created.

⸻

13. Submit Post-trade Event API

POST /trades/:tradeCode/events

Creates a post-trade event.

Request:

{
  "eventType": "issue_submitted",
  "message": "Item may differ from description",
  "evidenceReferences": []
}

Response:

{
  "success": true,
  "data": {
    "eventId": "evt_123",
    "eventType": "issue_submitted",
    "createdAt": "2026-06-28T11:00:00Z"
  }
}

This is an event record.

It is not a judgement.

⸻

14. Evidence Reference API

POST /events/:eventId/evidence

Adds an evidence reference to an event.

MVP may delay real file uploads.

Request:

{
  "evidenceType": "screenshot",
  "storageProvider": "external_url",
  "storageReference": "https://example.com/image.png",
  "evidenceHash": "sha256:abc123",
  "visibility": "participants_only"
}

Response:

{
  "success": true,
  "data": {
    "evidenceId": "evd_123"
  }
}

⸻

15. Reputation Events API

GET /users/:trustlayerId/events

Returns public reputation events.

Response:

{
  "success": true,
  "data": [
    {
      "eventType": "trade_completed",
      "createdAt": "2026-06-28T10:00:00Z",
      "publicSummary": "Trade completed with mutual confirmation"
    }
  ]
}

Sensitive event payloads should not be public by default.

⸻

16. MVP Error Codes

Suggested error codes:

UNAUTHORIZED
NOT_FOUND
INVALID_INPUT
TRADE_ALREADY_ACCEPTED
INVALID_TRADE_STATE
ROLE_NOT_ALLOWED
PRIVATE_DATA_FORBIDDEN
INTERNAL_ERROR

⸻

17. Security Rules

The API must enforce:

* Users cannot confirm on behalf of another user.
* Users cannot edit historical events.
* Users cannot delete reputation events.
* Users cannot access private evidence without permission.
* Users cannot expose another user’s private identity.

⸻

18. Future Marketplace API

Future marketplaces may use APIs such as:

GET /marketplace/users/:trustlayerId/reputation
POST /marketplace/events
POST /marketplace/trades

These are not included in MVP 0.1.

⸻

19. Design Summary

The API should expose behaviour history, not platform-owned scores.

It should allow users to create trades, confirm behaviour, record events, and view reputation.

The API supports the core mission:

Reputation belongs to people, not platforms.