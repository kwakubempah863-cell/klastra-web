# Tutor Konnect — Backend Specification (MVP)

**Version:** 1.0
**Last updated:** 2026-09-30
**Status:** Draft — approved for implementation
**Scope:** Backend infrastructure for mobile + web frontends

---

## 1. Overview

Tutor Konnect uses **Supabase** as its backend. Supabase provides:
- PostgreSQL database (with Row Level Security)
- Auth (email + password for MVP; phone OTP added in Phase 4)
- Storage (for avatars and verification documents)
- Edge Functions (for custom server logic)
- Realtime (for messaging, added in Phase 3)

Both the mobile app and the website consume the same REST API. The API can be either:
- **Supabase's auto-generated REST API** (via PostgREST) for simple CRUD
- **Edge Functions** for logic that needs server-side control (payment callbacks, custom business rules)

For MVP, we lean heavily on PostgREST for reads and simple writes, and use Edge Functions only for:
- Sending emails (contact forms, waitlist confirmations)
- Payment webhooks (Phase 2)
- Google Calendar/Meet integration (Phase 2)

---

## 2. Technology Decisions

| Layer | Choice | Reason |
|---|---|---|
| Database | Supabase PostgreSQL | Managed, RLS, generous free tier |
| Auth | Supabase Auth (email + password) | Free, no SMS cost in MVP |
| Storage | Supabase Storage | Free tier: 1 GB |
| Edge Functions | Supabase Edge Functions (Deno) | Free tier: 500k invocations/month |
| API style | REST (PostgREST + custom Edge Functions) | Simple, both frontends already use fetch |
| Realtime | Supabase Realtime | For messaging (Phase 3) |
| Payments | Paystack | Ghana-focused, test mode free (Phase 2) |
| Video | Google Calendar + Meet API | Free tier (Phase 2) |
| Push notifications | Expo Notifications | Free (Phase 3) |

**Region:** `eu-west-1` (Ireland) or `af-south-1` (Cape Town). Pick `af-south-1` for lowest latency to Ghana if available; otherwise `eu-west-1`.

---

## 3. Database Schema

All tables use UUID primary keys. All timestamps are `timestamptz` (UTC).

### 3.1 `profiles`

Extends `auth.users`. Created automatically on signup via trigger.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | PK, FK → auth.users(id) ON DELETE CASCADE | |
| role | text | NOT NULL, CHECK IN ('student', 'parent', 'tutor', 'admin') | |
| first_name | text | NOT NULL | |
| middle_name | text | NULL | |
| last_name | text | NOT NULL | |
| phone | text | UNIQUE, NULL | E.164 format |
| avatar_url | text | NULL | |
| email | text | UNIQUE | Copied from auth.users for convenience |
| verified | boolean | DEFAULT false | For tutors |
| verification_status | text | CHECK IN ('pending', 'approved', 'rejected') | For tutors |
| rejection_reason | text | NULL | |
| onboarding_complete | boolean | DEFAULT false | |
| created_at | timestamptz | DEFAULT now() | |
| updated_at | timestamptz | DEFAULT now() | |

**Indexes:**
- `profiles_role_idx` on `(role)`
- `profiles_verification_status_idx` on `(verification_status)` where role = 'tutor'

### 3.2 `student_profiles`

Student-specific data.

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, FK → profiles(id) ON DELETE CASCADE |
| dob | date | NOT NULL |
| gender | text | CHECK IN ('male', 'female', 'prefer-not-to-say') |
| education_level | text | CHECK IN ('primary', 'jhs', 'shs', 'university') |
| school_id | text | NOT NULL |
| school_name | text | NOT NULL |
| grade | text | NOT NULL |
| program_id | text | NULL |
| program_name | text | NULL |
| created_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now() |

### 3.3 `parent_profiles`

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, FK → profiles(id) ON DELETE CASCADE |
| created_at | timestamptz | DEFAULT now() |

### 3.4 `parent_links`

Links a parent to a child. Created via invite flow.

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK DEFAULT gen_random_uuid() |
| parent_id | uuid | FK → profiles(id) ON DELETE CASCADE |
| child_id | uuid | FK → profiles(id) ON DELETE CASCADE, NULL |
| child_phone | text | NOT NULL |
| status | text | CHECK IN ('pending', 'accepted', 'declined', 'revoked') |
| created_at | timestamptz | DEFAULT now() |
| accepted_at | timestamptz | NULL |

**Indexes:**
- `parent_links_parent_idx` on `(parent_id)`
- `parent_links_child_idx` on `(child_id)`

**Unique constraint:** `(parent_id, child_phone)` — a parent can't invite the same child twice.

### 3.5 `tutors`

Tutor-specific profile data.

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, FK → profiles(id) ON DELETE CASCADE |
| bio | text | NULL |
| qualifications | text | NOT NULL |
| subject_ids | text[] | NOT NULL DEFAULT '{}' |
| subject_names | text[] | NOT NULL DEFAULT '{}' |
| rate | integer | NOT NULL, CHECK >= 20 AND <= 500 |
| rating | numeric(2,1) | DEFAULT 0.0, CHECK >= 0 AND <= 5 |
| reviews_count | integer | DEFAULT 0 |
| available | boolean | DEFAULT true |
| location | text | NULL |
| languages | text[] | DEFAULT '{}' |
| created_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now() |

**Indexes:**
- `tutors_verified_idx` on `(id)` where the parent profile is verified
- `tutors_rate_idx` on `(rate)`
- `tutors_rating_idx` on `(rating DESC)`

### 3.6 `tutor_availability`

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK DEFAULT gen_random_uuid() |
| tutor_id | uuid | FK → tutors(id) ON DELETE CASCADE |
| day | text | CHECK IN ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun') |
| enabled | boolean | DEFAULT false |
| start_time | text | NULL — format 'HH:MM' 24h |
| end_time | text | NULL |

**Unique constraint:** `(tutor_id, day)` — one row per day per tutor.

### 3.7 `tutor_documents`

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK DEFAULT gen_random_uuid() |
| tutor_id | uuid | FK → tutors(id) ON DELETE CASCADE |
| document_type | text | CHECK IN ('national_id', 'academic_certificate', 'teaching_certificate') |
| storage_path | text | NOT NULL — path in Storage |
| file_name | text | NOT NULL |
| status | text | CHECK IN ('pending', 'approved', 'rejected') DEFAULT 'pending' |
| rejection_reason | text | NULL |
| uploaded_at | timestamptz | DEFAULT now() |
| reviewed_at | timestamptz | NULL |
| reviewed_by | uuid | FK → profiles(id), NULL |

**Indexes:**
- `tutor_documents_tutor_idx` on `(tutor_id)`
- `tutor_documents_status_idx` on `(status)`

### 3.8 `bookings`

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK DEFAULT gen_random_uuid() |
| student_id | uuid | FK → profiles(id) ON DELETE RESTRICT |
| tutor_id | uuid | FK → profiles(id) ON DELETE RESTRICT |
| subject | text | NOT NULL |
| scheduled_for | timestamptz | NOT NULL |
| duration_minutes | integer | NOT NULL, CHECK IN (30, 45, 60, 90, 120) |
| status | text | NOT NULL, see below |
| rate | integer | NOT NULL |
| fee | integer | NOT NULL DEFAULT 0 |
| total | integer | NOT NULL |
| meet_link | text | NULL |
| payment_reference | text | NULL |
| cancellation_reason | text | NULL |
| created_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now() |

**Status values:**
- `pending` — just created, waiting for student payment (or admin if no payment)
- `pending_payment` — reserved for Phase 2 (Paystack)
- `pending_tutor_acceptance` — reserved for Phase 2
- `accepted` — tutor confirmed, awaiting session
- `confirmed` — payment received, session locked in
- `rejected` — tutor declined
- `completed` — session finished
- `cancelled` — cancelled by either party

**Indexes:**
- `bookings_student_idx` on `(student_id, status)`
- `bookings_tutor_idx` on `(tutor_id, status)`
- `bookings_scheduled_idx` on `(scheduled_for)`

### 3.9 `messages`

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK DEFAULT gen_random_uuid() |
| conversation_id | text | NOT NULL — deterministic: sorted UUIDs joined by underscore |
| sender_id | uuid | FK → profiles(id) ON DELETE CASCADE |
| recipient_id | uuid | FK → profiles(id) ON DELETE CASCADE |
| text | text | NOT NULL |
| read | boolean | DEFAULT false |
| created_at | timestamptz | DEFAULT now() |

**Indexes:**
- `messages_conversation_idx` on `(conversation_id, created_at)`
- `messages_recipient_unread_idx` on `(recipient_id, read)` where read = false

**Conversation ID convention:** `[smaller_uuid]_[larger_uuid]` — so a conversation between A and B always has the same ID regardless of who queries.

### 3.10 `reviews`

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK DEFAULT gen_random_uuid() |
| tutor_id | uuid | FK → profiles(id) ON DELETE CASCADE |
| student_id | uuid | FK → profiles(id) ON DELETE CASCADE |
| booking_id | uuid | FK → bookings(id) ON DELETE CASCADE, UNIQUE |
| rating | integer | CHECK >= 1 AND <= 5 |
| comment | text | NULL |
| created_at | timestamptz | DEFAULT now() |

**Unique constraint:** `(booking_id)` — one review per booking.

### 3.11 `payments`

Phase 2.

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK DEFAULT gen_random_uuid() |
| booking_id | uuid | FK → bookings(id) ON DELETE CASCADE |
| student_id | uuid | FK → profiles(id) |
| amount | integer | NOT NULL |
| method | text | CHECK IN ('mtn_momo', 'vodafone_cash', 'airteltigo') |
| paystack_reference | text | UNIQUE |
| status | text | CHECK IN ('pending', 'success', 'failed', 'refunded') |
| paid_at | timestamptz | NULL |
| created_at | timestamptz | DEFAULT now() |

### 3.12 `withdrawals`

Phase 3.

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK DEFAULT gen_random_uuid() |
| tutor_id | uuid | FK → profiles(id) |
| amount | integer | NOT NULL |
| method | text | CHECK IN ('mtn_momo', 'vodafone_cash', 'airteltigo') |
| destination | text | NOT NULL |
| status | text | CHECK IN ('pending', 'processing', 'completed', 'failed') |
| created_at | timestamptz | DEFAULT now() |
| completed_at | timestamptz | NULL |

---

## 4. Row Level Security (RLS)

**RLS is enabled on every table. No exceptions.**

Default deny. Every policy is explicit.

### 4.1 `profiles`

| Operation | Policy |
|---|---|
| SELECT (self) | `auth.uid() = id` |
| SELECT (tutors, public) | `role = 'tutor'` — but only fields safe to expose (see View below) |
| SELECT (admin) | `EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')` |
| INSERT | `auth.uid() = id` (self only, during signup trigger) |
| UPDATE (self) | `auth.uid() = id` |
| UPDATE (admin) | admin role |

**Public tutor view:** create a view `public_tutors` that joins `profiles` and `tutors` filtering `verified = true`, and only exposes: `id, first_name, last_name, avatar_url, bio, qualifications, subject_names, rate, rating, reviews_count, available, location, languages`.

### 4.2 `student_profiles`

| Operation | Policy |
|---|---|
| SELECT (self) | `auth.uid() = id` |
| SELECT (parent) | `EXISTS (SELECT 1 FROM parent_links WHERE parent_id = auth.uid() AND child_id = id AND status = 'accepted')` |
| SELECT (admin) | admin role |
| INSERT / UPDATE | `auth.uid() = id` |

### 4.3 `parent_profiles`

| Operation | Policy |
|---|---|
| SELECT (self) | `auth.uid() = id` |
| SELECT (admin) | admin role |
| INSERT / UPDATE | `auth.uid() = id` |

### 4.4 `parent_links`

| Operation | Policy |
|---|---|
| SELECT (parent) | `auth.uid() = parent_id` |
| SELECT (child) | `auth.uid() = child_id` |
| INSERT | `auth.uid() = parent_id` |
| UPDATE (parent) | `auth.uid() = parent_id` |
| UPDATE (child) | `auth.uid() = child_id` — to accept/decline |

### 4.5 `tutors`

| Operation | Policy |
|---|---|
| SELECT (self) | `auth.uid() = id` |
| SELECT (verified public) | `verified = true` — but prefer the `public_tutors` view |
| SELECT (admin) | admin role |
| INSERT / UPDATE | `auth.uid() = id` |

### 4.6 `tutor_availability`

| Operation | Policy |
|---|---|
| SELECT (self) | `auth.uid() = tutor_id` |
| SELECT (public) | tutor is verified |
| INSERT / UPDATE / DELETE | `auth.uid() = tutor_id` |

### 4.7 `tutor_documents`

| Operation | Policy |
|---|---|
| SELECT (self) | `auth.uid() = tutor_id` |
| SELECT (admin) | admin role |
| INSERT | `auth.uid() = tutor_id` |
| UPDATE (self) | `auth.uid() = tutor_id` AND `status = 'pending'` |
| UPDATE (admin) | admin role — to approve/reject |

### 4.8 `bookings`

| Operation | Policy |
|---|---|
| SELECT (student) | `auth.uid() = student_id` |
| SELECT (tutor) | `auth.uid() = tutor_id` |
| SELECT (parent) | `EXISTS (SELECT 1 FROM parent_links WHERE parent_id = auth.uid() AND child_id = student_id AND status = 'accepted')` |
| SELECT (admin) | admin role |
| INSERT | `auth.uid() = student_id` |
| UPDATE (student) | `auth.uid() = student_id` — status transitions limited to cancel |
| UPDATE (tutor) | `auth.uid() = tutor_id` — status transitions limited to accept/reject/complete |
| UPDATE (admin) | admin role |

**Status transition enforcement:** implement in a database function `can_transition_booking(from_status, to_status, actor_role)` and call it from the UPDATE policy via a CHECK.

### 4.9 `messages`

| Operation | Policy |
|---|---|
| SELECT | `auth.uid() = sender_id OR auth.uid() = recipient_id` |
| INSERT | `auth.uid() = sender_id` |
| UPDATE (read) | `auth.uid() = recipient_id` |

### 4.10 `reviews`

| Operation | Policy |
|---|---|
| SELECT (public) | `true` — reviews are public |
| INSERT | `auth.uid() = student_id` AND booking is completed AND no review exists for the booking |
| UPDATE / DELETE | `auth.uid() = student_id` within 24 hours of creation |

### 4.11 `payments` and `withdrawals`

Phase 2. Policies documented there.

---

## 5. Storage Buckets

### 5.1 `avatars`

- **Public read** for all files
- **Write:** authenticated users only, path must be `{user_id}/avatar.{ext}`
- **Size limit:** 2 MB
- **Allowed types:** `image/jpeg`, `image/png`, `image/webp`
- **Transform:** use Supabase image transformation to serve thumbnails at `?width=100`

### 5.2 `tutor-documents`

- **Private.** No public read.
- **Read:** owner (self) or admin
- **Write:** tutor only, path must be `{tutor_id}/{document_type}.{ext}`
- **Size limit:** 10 MB
- **Allowed types:** `image/jpeg`, `image/png`, `application/pdf`

---

## 6. API Endpoints

Both frontends consume these. Reads go through PostgREST; writes with custom logic go through Edge Functions.

### 6.1 Auth (Supabase native)

- `POST /auth/v1/signup` — email + password registration
- `POST /auth/v1/token?grant_type=password` — login
- `POST /auth/v1/logout`
- `POST /auth/v1/recover` — password reset via email
- `GET /auth/v1/user` — get current user

**On successful signup:** a trigger creates a `profiles` row with `role` from the signup metadata.

### 6.2 Profiles

- `GET /rest/v1/profiles?id=eq.{userId}&select=*`
- `PATCH /rest/v1/profiles?id=eq.{userId}`
- `GET /rest/v1/student_profiles?id=eq.{userId}`
- `POST /rest/v1/student_profiles`
- `GET /rest/v1/parent_profiles?id=eq.{userId}`
- `POST /rest/v1/parent_profiles`

### 6.3 Tutors

- `GET /rest/v1/public_tutors` — public list, supports query params
  - `?select=*&order=rating.desc`
  - `?subject_names=cs.{Mathematics}`
  - `?rate=lte.100`
  - `?rating=gte.4`
  - `?available=eq.true`
  - `?or=(first_name.ilike.*math*,bio.ilike.*math*)`
- `GET /rest/v1/public_tutors?id=eq.{tutorId}&select=*` — single tutor
- `POST /rest/v1/tutors` — create tutor profile
- `PATCH /rest/v1/tutors?id=eq.{tutorId}` — update tutor profile
- `GET /rest/v1/tutor_availability?tutor_id=eq.{tutorId}`
- `PATCH /rest/v1/tutor_availability?tutor_id=eq.{tutorId}&day=eq.{day}`

**Custom function:** `POST /functions/v1/tutor-submit-verification`
- Validates all required documents are uploaded
- Sets `profiles.verification_status = 'pending'`
- Sends an email to admin (Phase 2)

### 6.4 Bookings

- `POST /rest/v1/bookings` — create booking (student)
- `GET /rest/v1/bookings?student_id=eq.{id}&select=*,tutor:profiles!tutor_id(*)`
- `GET /rest/v1/bookings?tutor_id=eq.{id}&select=*,student:profiles!student_id(*)`
- `PATCH /rest/v1/bookings?id=eq.{id}` — status updates

**Custom function:** `POST /functions/v1/booking-transition`
- Validates the state transition against `can_transition_booking`
- Sends notification (Phase 3)
- Returns the updated booking

### 6.5 Messages

- `GET /rest/v1/messages?conversation_id=eq.{id}&order=created_at.asc`
- `POST /rest/v1/messages`
- `PATCH /rest/v1/messages?conversation_id=eq.{id}&recipient_id=eq.{userId}` — mark all read

### 6.6 Reviews

- `GET /rest/v1/reviews?tutor_id=eq.{id}&order=created_at.desc`
- `POST /rest/v1/reviews`

### 6.7 Waitlist + Contact (website-specific)

**Custom functions:**
- `POST /functions/v1/waitlist` — body `{ email, phone?, role }` — stores in a `waitlist` table and sends a confirmation email
- `POST /functions/v1/contact` — body `{ name, email, subject, message }` — sends email to support

---

## 7. Standard Response Format

Every custom Edge Function returns:

**Success:**
```json
{ "success": true, "message": "Operation successful", "data": { ... } }
Error:

json
{ "success": false, "message": "Description of error", "code": "OPTIONAL_ERROR_CODE" }
HTTP status codes:

200 — success

400 — bad request (validation failed)

401 — unauthenticated

403 — unauthorized (RLS denied)

404 — not found

409 — conflict (e.g. booking already exists)

500 — server error

PostgREST endpoints return raw data or raw error objects. The frontend services layer normalizes them.

8. Auth Flow
Signup
User enters email + password on the frontend

Frontend calls POST /auth/v1/signup with metadata { role, first_name, last_name }

Supabase creates auth.users row

Trigger creates profiles row and (if role = student/tutor/parent) the corresponding sub-profile row

Frontend receives session token

Frontend routes user to onboarding based on role:

Student → student onboarding wizard

Tutor → tutor verification flow

Parent → parent onboarding (invite child)

Login
User enters email + password

Frontend calls POST /auth/v1/token?grant_type=password

Receives JWT + refresh token

Stores in SecureStore (native) or localStorage (web)

Routes based on profiles.role

Session refresh
Supabase client library handles refresh automatically. Both frontends use @supabase/supabase-js for auth.

Logout
Frontend calls POST /auth/v1/logout

Clears local storage

Navigates to / (web) or /(auth)/welcome (mobile)

9. Booking State Machine
text
                  ┌──────────────┐
                  │   pending    │  ← created by student
                  └──────┬───────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
        ┌─────────┐ ┌─────────┐ ┌──────────┐
        │accepted │ │rejected │ │cancelled │
        └────┬────┘ └─────────┘ └──────────┘
             │
             ▼
        ┌──────────┐
        │confirmed │  ← payment received (Phase 2)
        └────┬─────┘
             │
             ▼
        ┌──────────┐
        │completed │
        └──────────┘

Phase 2 states (defined but not yet used):
  - pending_payment
  - pending_tutor_acceptance

Transitions allowed:
  pending → accepted (by tutor)
  pending → rejected (by tutor)
  pending → cancelled (by student)
  accepted → confirmed (system, on payment success)
  accepted → cancelled (by student or tutor)
  confirmed → completed (by tutor, after session)
  confirmed → cancelled (by student or tutor, with reason)
The can_transition_booking function enforces this in the database.

10. Environment Variables
Frontend (mobile + web)
text
EXPO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
EXPO_PUBLIC_API_BASE_URL=https://<project>.supabase.co
EXPO_PUBLIC_USE_MOCKS=false
Supabase Edge Functions
Set via Supabase dashboard or CLI:

text
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
SUPABASE_ANON_KEY=<anon-key>
Phase 2 additions
text
PAYSTACK_SECRET_KEY=<secret>
PAYSTACK_PUBLIC_KEY=<public>
GOOGLE_CLIENT_ID=<oauth-client-id>
GOOGLE_CLIENT_SECRET=<oauth-client-secret>
11. Development Workflow
Option 1: Supabase Cloud (recommended for MVP)
Create project at supabase.com

Copy the URL and keys into .env

Run migrations via Supabase SQL editor or supabase db push with CLI

Seed test data via SQL or the Table Editor

Option 2: Supabase Local (Docker)
Install Supabase CLI: npm i -g supabase

supabase init

supabase start — spins up local Postgres, Auth, Storage

supabase db reset — reapplies migrations

Useful for testing without burning cloud quota; recommended once the schema stabilizes

Migrations
All schema changes go through migrations:

text
supabase/migrations/20260930_initial_schema.sql
supabase/migrations/20261001_add_reviews.sql
...
Never edit the schema directly through the dashboard in production. Always write a migration.

Seeding
Create a supabase/seed.sql with test data — one student, one tutor, one parent, one admin, a few bookings. Run it after migrations.

12. Implementation Plan
Week 1 — Foundation
Day 1: Create Supabase project, write initial migration with profiles, student_profiles, parent_profiles, parent_links, tutors, tutor_availability, tutor_documents, bookings, messages, reviews tables. Enable RLS.

Day 2: Write RLS policies for all tables. Write the public_tutors view. Write the signup trigger that creates profile rows. Test auth flow end-to-end with Postman.

Day 3: Create Storage buckets (avatars, tutor-documents) with policies. Test file upload from the website. Wire the website's tutor discovery + detail pages to public_tutors.

Day 4: Wire auth on the website — signup, login, logout, session persistence. Register and sign in as a real user.

Day 5: Wire the tutor profile creation flow. Register a real tutor, submit documents, mark verification as pending.

Day 6: Wire booking creation, listing, status transitions. Register a student, book a tutor, accept as tutor.

Day 7: Bug fixes. Seed test data. Verify both the website and mobile app can read the same tutor list. Commit, celebrate.

Week 2 — Payments + Meet (Phase 2)
Paystack integration

pending_payment, pending_tutor_acceptance states activated

Google Calendar + Meet link generation

Emails via Supabase (contact, waitlist, booking confirmation)

Week 3 — Messaging + Notifications (Phase 3)
Realtime messages via Supabase Realtime

Push notifications via Expo

Email notifications for bookings

Week 4 — Polish + Launch
Admin dashboard full wiring

Bug fixes

Production project setup

Vercel + EAS deployment

Store submission prep

13. Out of Scope for MVP
Explicitly deferred:

Phone OTP (Phase 4)

Payments via Paystack (Phase 2)

Google Meet integration (Phase 2)

Realtime messaging (Phase 3)

Push notifications (Phase 3)

Emails beyond auth (Phase 2)

Analytics dashboards (Phase 4)

Withdrawals (Phase 3)

Refunds (Phase 3)

Dispute management (Phase 4)

Multi-language support (Phase 4+)

14. Non-Negotiables
RLS on every table. Default deny. No exceptions.

Migrations, not direct edits. Every schema change lives in a file.

Service role key never leaves the server. Never in a frontend env var.

Never trust the client. All business rules enforced in RLS or Edge Functions.

Response format is a contract. Both frontends depend on it.

public_tutors view is the only way to read tutor data publicly. No direct reads of profiles for unauthenticated users.

15. Reference Documents
Tutor Konnect Technical Specification (MVP).pdf — original product spec

Mobile app: tutorkonnect-mobile repo

Website: tutorkonnect-web repo

Figma design: TutoringMarketplaceUIUXDesign repo (frozen archive)

End of specification.