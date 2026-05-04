# Security Specification

## Data Invariants
1. A complaint must always have a valid `userId` associated with the authenticated user.
2. Users can only read and write their own profile and complaints.
3. Timestamps (`createdAt`, `updatedAt`) must be set using server time.
4. Document IDs must be valid alphanumeric strings.

## The "Dirty Dozen" Payloads (Denial Tests)
1. Creating a complaint with someone else's `userId`.
2. Updating a complaint's `userId` after creation.
3. Creating a complaint with an excessively large content string.
4. Reading another user's complaint.
5. Deleting another user's profile.
6. Injecting a "role: admin" field into a user profile.
7. Creating a document with a non-alphanumeric ID (ID poisoning).
8. Listing all complaints without a filter for the current user's ID.
9. Updating a terminal status complaint (if status is 'resolved').
10. Providing a client-side timestamp instead of server timestamp.
11. Adding extra fields not defined in the schema.
12. Accessing data without being authenticated.
