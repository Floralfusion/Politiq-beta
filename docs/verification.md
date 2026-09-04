# Verification

Four independent verification types: `IDENTITY`, `PROFESSIONAL`, `ORGANISATION`, `EXPERIENCE`.

## Status lifecycle
`NOT_STARTED → DRAFT → SUBMITTED → UNDER_REVIEW → VERIFIED | REJECTED | NEEDS_MORE_INFORMATION → EXPIRED`

## Flow
1. User uploads document(s) to the private `verification-documents` Storage bucket (path:
   `{profile_id}/{verification_request_id}/{filename}`).
2. `verification_requests.status` moves to `SUBMITTED`, then `UNDER_REVIEW` once a reviewer opens it.
3. A `VERIFICATION_REVIEWER`+ admin reviews the document(s) via a signed URL (never a public one)
   in `/admin/verifications/:requestId`, and approves or rejects with a reason.
4. On approval, `profiles.is_verified` and the profile's badge update; a `VERIFICATION_APPROVED`
   notification is sent. On rejection, `NEEDS_MORE_INFORMATION`/`REJECTED` with a reason is shown
   back to the user, who can re-submit.
5. Every transition is recorded in `verification_events` for audit purposes.

## Demo mode
`src/pages/app/VerificationPage.tsx` lets you upload any file (its name is recorded, not its
bytes — no real Storage bucket exists in demo mode) and immediately reflects `UNDER_REVIEW`; the
admin console's `/admin/verifications` queue lets you approve/reject it, exercising the same UI
and state machine as live mode without needing real Storage or reviewers.
