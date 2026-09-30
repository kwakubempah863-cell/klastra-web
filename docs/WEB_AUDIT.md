# TutorKonnect Web — Working Audit

## Summary
- Dead buttons: 45 control instances across the unique page states audited. Repeated mapped controls are counted individually; the shared auth submit control is counted once.
- Dead links: 4 (three `#` footer placeholders and one placeholder App Store listing).
- Stub pages: 0 pages that render only placeholder/empty UI. Several pages use mock data; auth and other demo workflows are covered below.
- Missing pages: 6 Admin navigation destinations do not open their intended view. No direct `<Link>` or `useNavigate()` URL points outside the route tree.
- Form issues: 7 workflows or form-like areas lack submission or meaningful completion behavior.
- Console warnings: 0 `console.log`/`console.warn` calls or TODO/FIXME markers found in `src/`. The most recent recorded Vite build did emit a config deprecation warning for `__dirname` in `vite.config.ts`.

## A. Dead buttons

The total includes inert controls in the intentionally unrouted mobile-only page files, because this audit covers all of `src/`. For mapped controls, every rendered label is listed.

| File | Line | Label | Current | Should do |
|---|---:|---|---|---|
| [AdminDashboard.tsx](../src/pages/AdminDashboard.tsx#L30) | 30 | Export Report | Button has no handler. | Download or generate an admin report, or show an unavailable state. |
| [AdminDashboard.tsx](../src/pages/AdminDashboard.tsx#L179) | 179 | Export | Button has no handler. | Export the visible user list. |
| [AdminDashboard.tsx](../src/pages/AdminDashboard.tsx#L220) | 220 | View | Button has no handler. | Open the selected user's detail view. |
| [AdminDashboard.tsx](../src/pages/AdminDashboard.tsx#L221) | 221 | Suspend | Button has no handler. | Confirm and apply a user suspension. |
| [AdminDashboard.tsx](../src/pages/AdminDashboard.tsx#L270) | 270 | Reject | Button has no handler. | Reject the tutor verification request with confirmation/reason. |
| [AdminDashboard.tsx](../src/pages/AdminDashboard.tsx#L271) | 271 | Request Changes | Button has no handler. | Send a correction request to the tutor. |
| [AdminDashboard.tsx](../src/pages/AdminDashboard.tsx#L272) | 272 | Approve Tutor | Button has no handler. | Approve the tutor and update verification status. |
| [AdminDashboard.tsx](../src/pages/AdminDashboard.tsx#L317) | 317 | View Details | Button has no handler. | Open the selected dispute. |
| [AdminDashboard.tsx](../src/pages/AdminDashboard.tsx#L318) | 318 | Contact Student | Button has no handler. | Open a message/contact action for the student. |
| [AdminDashboard.tsx](../src/pages/AdminDashboard.tsx#L319) | 319 | Contact Tutor | Button has no handler. | Open a message/contact action for the tutor. |
| [AdminDashboard.tsx](../src/pages/AdminDashboard.tsx#L320) | 320 | Issue Refund | Button has no handler. | Confirm and issue the refund. |
| [AuthForm.tsx](../src/pages/AuthForm.tsx#L62) | 62 | Sign In / Create Account | Shared button has no handler and is not a form submit button. | Validate and submit credentials/registration to the auth service. |
| [BookingFlow.tsx](../src/pages/BookingFlow.tsx#L203) | 203 | MTN MoMo, Vodafone Cash, AirtelTigo | Three mapped payment-method buttons have no handlers; the styling is hard-coded to the first option. | Store and visibly update the selected payment method. |
| [Landing.tsx](../src/pages/Landing.tsx#L28) | 28 | How it Works | Button has no handler. | Scroll to the How it Works section or navigate to its content. |
| [Landing.tsx](../src/pages/Landing.tsx#L189) | 189 | Browse Tutors | Button has no handler. | Navigate to `/tutors`. |
| [Layout.tsx](../src/components/Layout.tsx#L159) | 159 | Student, Parent, Tutor | The dev role-switcher handler only navigates for Public and Admin; these three options do nothing. | Route to implemented role pages, or remove/disable unsupported options. |
| [Layout.tsx](../src/components/Layout.tsx#L172) | 172 | Notification bell | Button has no handler. | Open notifications or render it as non-interactive decoration. |
| [MessagingPage.tsx](../src/pages/MessagingPage.tsx#L78) | 78 | Calendar icon | Button has no handler. | Open the relevant scheduling action or remove button semantics. |
| [MessagingPage.tsx](../src/pages/MessagingPage.tsx#L79) | 79 | Info icon | Button has no handler. | Open conversation/contact details or remove button semantics. |
| [MessagingPage.tsx](../src/pages/MessagingPage.tsx#L106) | 106 | Attachment icon | Button has no handler. | Open a file picker and attach a file, or remove button semantics. |
| [StudentDashboard.tsx](../src/pages/StudentDashboard.tsx#L76) | 76 | Join | `onClick` is an empty function. | Join the session using its meeting link. |
| [TutorDashboard.tsx](../src/pages/TutorDashboard.tsx#L72) | 72 | Start Lesson | Button has no handler. | Open the lesson/session. |
| [TutorDashboard.tsx](../src/pages/TutorDashboard.tsx#L92) | 92 | Reject | Button has no handler. | Reject the booking request and update its status. |
| [TutorDashboard.tsx](../src/pages/TutorDashboard.tsx#L93) | 93 | Accept | Button has no handler. | Accept the booking request and update its status. |
| [TutorDashboard.tsx](../src/pages/TutorDashboard.tsx#L122) | 122 | Withdraw Funds | Button has no handler. | Start a validated withdrawal workflow. |
| [TutorDashboard.tsx](../src/pages/TutorDashboard.tsx#L184) | 184 | Reject | Button has no handler. | Reject the booking and update its status. |
| [TutorDashboard.tsx](../src/pages/TutorDashboard.tsx#L185) | 185 | Accept | Button has no handler. | Accept the booking and update its status. |
| [TutorDashboard.tsx](../src/pages/TutorDashboard.tsx#L188) | 188 | Start Lesson | Button has no handler. | Open the lesson/session. |
| [TutorDashboard.tsx](../src/pages/TutorDashboard.tsx#L246) | 246 | MTN MoMo, Vodafone, AirtelTigo | Three mapped payout-method buttons have no handlers; the first is only styled as selected. | Store and visibly update the payout method. |
| [TutorDashboard.tsx](../src/pages/TutorDashboard.tsx#L252) | 252 | Withdraw Funds | Button has no handler. | Validate amount/destination and submit a withdrawal. |
| [TutorDashboard.tsx](../src/pages/TutorDashboard.tsx#L267) | 267 | Edit photo (pencil icon) | Button has no handler. | Open a profile-photo picker/editor. |
| [TutorDashboard.tsx](../src/pages/TutorDashboard.tsx#L293) | 293 | Save Changes | Button has no handler. | Validate and persist profile edits. |
| [TutorDashboard.tsx](../src/pages/TutorDashboard.tsx#L304) | 304 | Mon, Tue, Wed, Thu, Fri, Sat, Sun | Seven mapped availability buttons have no handlers. | Toggle each day's availability and save it. |

Buttons in `ui.tsx` are reusable primitives; their behavior depends on caller props. The shared `Button`, `SectionHeader`, `TutorCard`, and `ActionButton` implementations conditionally forward/provide handlers and are not counted as dead by themselves.

## B. Dead links

| File | Line | Destination | Current behavior |
|---|---:|---|---|
| [Landing.tsx](../src/pages/Landing.tsx#L204) | 204 | `href="#"` — Privacy | Jumps to the current document fragment; no privacy page. |
| [Landing.tsx](../src/pages/Landing.tsx#L205) | 205 | `href="#"` — Terms | Jumps to the current document fragment; no terms page. |
| [Landing.tsx](../src/pages/Landing.tsx#L206) | 206 | `href="#"` — Support | Jumps to the current document fragment; no support destination. |
| [AppDownloadModal.tsx](../src/components/AppDownloadModal.tsx#L60) | 60 | App Store URL `https://apps.apple.com/app/id0000000000` | The configured App Store product ID is a placeholder, not a published TutorKonnect listing. |

No `javascript:void(0)` links were found. The Play Store URL is an external store link, not an internal route.

## C. Stub pages

None of the files under `src/pages/` render only placeholder or empty UI. Routed pages have visible page content. Several pages use sample/mock data, and Login/Register are visual form shells without working authentication; those are recorded under H rather than counted as stub pages. The dashboards, BookingFlow, and MessagingPage are retained mobile/demo surfaces and are not routed on web.

## D. Missing pages

No direct `<Link to>` or `useNavigate()` URL target was found that fails to match the route tree in [App.tsx](../src/App.tsx). The wildcard route handles unknown URLs.

The legacy `onNavigate('...')` page IDs inside unrouted mobile-only components are not URL targets and do not create web routes. They remain out of the web route tree by design. Admin query-string nav items technically match `/admin`, but do not select their requested content; see G.

## E. Broken conditional rendering

| File | Line | Finding |
|---|---:|---|
| [TutorDiscovery.tsx](../src/pages/TutorDiscovery.tsx#L14) | 14 | `loading` is initialized to `false` with no setter. The skeleton branch at line 92 can never render; either wire loading to a real request or remove the dead branch. |

Other conditional empty returns found in Admin verification filters are intentional filtering behavior. NotFound and unknown-tutor states render explicit content. The download modal's conditional mount is intentional.

## F. Inconsistent navigation

No internal navigation uses a raw `<a href="/...")` instead of React Router. The three raw anchors are `#` placeholders listed in B, not valid internal navigation. Store-card anchors intentionally point to external stores and open in new tabs.

## G. Missing pages for existing nav

Public navigation has working destinations: Home (`/`), Find Tutors (`/tutors`), Subjects (`/subjects`), and Sign In (`/login`). Register is reachable from the auth form at `/register`. Admin Dashboard (`/admin`) and Analytics (`/admin/analytics`) also have routes.

Six Admin sidebar items do not open their named views. `Layout.getPath()` sends them to `/admin?nav=...`, which matches the `/admin` route, but `AdminDashboard` does not read that query parameter and starts on its Overview tab:

| Nav item | Current destination/result | Gap |
|---|---|---|
| Users | `/admin?nav=admin-users` shows Overview | Users tab is only reachable by the dashboard's in-page tab; URL does not select it. |
| Tutors | `/admin?nav=admin-tutors` shows Overview | No tutor-management tab/page. |
| Verification | `/admin?nav=admin-verification` shows Overview | Verification tab exists but is not selected from the nav URL. |
| Bookings | `/admin?nav=admin-bookings` shows Overview | Bookings tab exists but is not selected from the nav URL. |
| Payments | `/admin?nav=admin-payments` shows Overview | No admin payments tab/page. |
| Disputes | `/admin?nav=admin-disputes` shows Overview | Disputes tab exists but is not selected from the nav URL. |

The dev role-switcher also exposes Student, Parent, and Tutor choices, but their click handlers do nothing and those role dashboards have no web routes.

## H. Form submissions

There are no HTML `<form>` elements or `onSubmit` handlers in `src/`.

| File | Issue |
|---|---|
| [AuthForm.tsx](../src/pages/AuthForm.tsx#L38) | Login and Register inputs are presentation-only. Sign In/Create Account has no click handler, validation, or API submission. |
| [Landing.tsx](../src/pages/Landing.tsx#L76) | Search text and subject selector are not bound to state. Search Tutors only navigates to `/tutors`; entered filters are discarded. |
| [AdminDashboard.tsx](../src/pages/AdminDashboard.tsx#L178) | User search is an uncontrolled input with no filtering behavior. |
| [BookingFlow.tsx](../src/pages/BookingFlow.tsx#L23) | The payment handler advances to a local success state after a timeout; it does not contact a payment provider. Payment method controls are inert. This page is not routed on web. |
| [TutorDashboard.tsx](../src/pages/TutorDashboard.tsx#L250) | Withdrawal method/amount/phone fields are not submitted; Withdraw Funds has no handler. This page is not routed on web. |
| [TutorDashboard.tsx](../src/pages/TutorDashboard.tsx#L281) | Profile fields are editable only in local DOM state; Save Changes has no handler or persistence. This page is not routed on web. |

Count: 7 workflows/form-like areas when Login and Register are counted separately, plus Landing search, Admin user search, BookingFlow payment, Tutor withdrawal, and Tutor profile editing.

Tutor Discovery's search/filter controls do update local state and filter mock tutors, but they do not submit to a backend.

## I. "How it Works" button

The button at [Landing.tsx](../src/pages/Landing.tsx#L28) has no `onClick`, `Link`, anchor, or scroll target. It does nothing. A How it Works section exists farther down the same page, but has no target ID or scroll behavior.

## J. Console warnings and TODOs

No `TODO`, `FIXME`, `console.log`, or `console.warn` occurrences were found in `src/`. A previous Vite build did print a config deprecation warning: `vite.config.ts` uses `__dirname` with Vite's native config loader. This is not an explicit `console.warn` call, but should be addressed separately from page behavior.

## Triage recommendation

- **P0 — must fix now:** None identified for the currently routed public pages. Direct routing, tutor details, and the download modal are present.
- **P1 — fix in this pass:** Make How it Works scroll to its section; wire Browse Tutors; replace Privacy/Terms/Support hashes; make Admin sidebar destinations select real content or remove unsupported entries; make visible Admin actions produce feedback instead of silently doing nothing.
- **P2 — defer to backend:** Login/Register validation and API submission; persistent user/tutor/admin mutations; real booking/payment/refund/withdrawal processing; real search data submission; replace the placeholder App Store product ID after publication.
- **P3 — out of scope:** Dead controls inside `StudentDashboard`, `ParentDashboard`, `TutorDashboard`, `BookingFlow`, and `MessagingPage` are in retained mobile-only/demo screens and should stay unrouted on web unless those experiences are explicitly brought into scope.