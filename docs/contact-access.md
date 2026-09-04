# Contact Access

## State machine
`REQUESTED → APPROVED | DECLINED → (if APPROVED) PAYMENT_PENDING → PAID → CONTACT_UNLOCKED`
(`EXPIRED`, `CANCELLED` can occur before unlock.)

## Flow
1. User A visits User B's profile and submits **Request Contact** with an optional message →
   inserts a `contact_requests` row (`status = REQUESTED`).
2. User B sees it under `/contact-requests` (Incoming tab) and approves or declines.
3. If approved, User A sees a **Pay to unlock** action under `/contact-requests` (Outgoing tab).
4. Payment goes through the standard Cashfree flow (`cashfree-create-order` →  Checkout →
   `cashfree-webhook`). The webhook is the only thing that can move a request to
   `CONTACT_UNLOCKED` and insert the `contact_access` row.
5. Only once `contact_access` exists does the server return the recipient's actual contact
   details — this lookup is never included in the `contact_requests` payload itself, precisely so
   a client can't read it before authorization checks pass.

## Server-side checks before returning contact details (production)
- Caller is the original requester (`requester_profile_id = current_profile_id()`).
- `contact_requests.status = 'CONTACT_UNLOCKED'`.
- A matching `contact_access` row exists and `revoked_at is null`.
- The associated payment is `SUCCESS` and not refunded.
