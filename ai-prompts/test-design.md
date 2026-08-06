# AI Prompts – Test Design

## Entry 1: UI Reconnaissance — PracticeSoftwareTesting Toolshop (Unauthenticated)

**Prompt:**
> You are performing a QA reconnaissance on this ecommerce site: https://practicesoftwaretesting.com/
> Without logging in yet, identify:
> 1. Every user-facing feature visible on the site
> 2. Which features involve server-side state (auth, cart, orders)
> 3. Which flows are highest business risk if broken
> 4. Natural grouping: which tests belong in Smoke vs Regression and why
> 5. Special behaviors worth noting (e.g., double-confirm invoice)
> Output: a numbered feature inventory, risk rank (High/Medium/Low), and Smoke/Regression tag for each.
> Limit scope to what 5–8 UI tests can realistically cover.

**AI Response Summary:**
Unauthenticated site reconnaissance producing a feature inventory, server-state map, risk ranking, smoke/regression grouping, and a scoped 8-test UI plan aligned to assessment ACs.

**Validation Notes:**
Pages fetched: `/`, `/products`, `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/cart`, `/checkout`, `/contact`, `/category/hand-tools`, `/account/invoices`, `/product/{id}`. Angular SPA limits static HTML capture; inventory cross-checked against visible page content and assessment ACs.

---

## 1. User-Facing Feature Inventory (Unauthenticated View)

| # | Feature | Visible Without Login | Server-Side State | Risk | Tag | Notes |
|---|---------|----------------------|-------------------|------|-----|-------|
| 1 | **Product catalog / home listing** | Yes | No (read-only catalog) | Medium | @Regression | Grid of products with images, names, prices |
| 2 | **Product search** | Yes | No | Medium | @Regression | Text search box in filter sidebar |
| 3 | **Sort products** | Yes | No | Low | @Regression | Name A–Z/Z–A, Price high/low, CO₂ rating A–E/E–A |
| 4 | **Price range filter** | Yes | No | Low | @Regression | Slider 0–1100 |
| 5 | **Category filter** | Yes | No | Medium | @Regression | e.g. Hand Tools, Power Tools, etc. |
| 6 | **Brand filter** | Yes | No | Low | @Regression | Filter by manufacturer |
| 7 | **Sustainability filter** | Yes | No | Low | @Regression | "Show only eco-friendly products" toggle |
| 8 | **Category page browse** | Yes | No | Medium | @Regression | `/category/{slug}` — filtered product list |
| 9 | **Product detail page** | Yes | No | High | @Smoke | `/product/{id}` — name, price, description, add-to-cart, related products |
| 10 | **Add to cart (from detail/listing)** | Yes* | **Yes — cart** | **High** | **@Smoke** | *Cart icon visible; cart persisted server-side per session/user |
| 11 | **Cart page** | Yes | **Yes — cart** | **High** | **@Smoke** | `/cart` — view items, quantities, line totals |
| 12 | **Update cart quantity** | Partial* | **Yes — cart** | **High** | **@Regression** | *Requires items in cart; may need login |
| 13 | **Remove from cart** | Partial* | **Yes — cart** | Medium | @Regression | |
| 14 | **Login (email/password)** | Yes | **Yes — auth/session** | **High** | **@Smoke** | `/auth/login` |
| 15 | **Login (Google OAuth)** | Yes | **Yes — auth/session** | Medium | @Regression | "Sign in with Google" button |
| 16 | **User registration** | Yes | **Yes — auth/user record** | **High** | **@Smoke** | `/auth/register` — name, DOB, address (postal+house auto-fill), phone, email, password rules |
| 17 | **Forgot password** | Yes | **Yes — auth/reset token** | Medium | @Regression | `/auth/forgot-password` — email only |
| 18 | **Checkout wizard** | Yes (step 1) | **Yes — cart + order** | **High** | **@Smoke** | `/checkout` — 4 steps: Sign in → Billing Address → Payment → Confirm |
| 19 | **Billing address entry** | No* | **Yes — user/order** | **High** | **@Regression** | *Step 2+ requires authenticated session |
| 20 | **Payment method selection** | No* | **Yes — order/payment** | **High** | **@Smoke** | *Cash on Delivery (assessment AC); bank transfer also available |
| 21 | **Order confirmation / invoice generation** | No* | **Yes — invoice/order** | **High** | **@Smoke** | *Requires completed checkout; **double-confirm quirk** |
| 22 | **My Invoices list** | Redirect* | **Yes — invoices** | **High** | **@Smoke** | `/account/invoices` — assessment AC2 end state |
| 23 | **Invoice detail view** | No* | **Yes — invoices** | **High** | **@Regression** | *Post-purchase authenticated view |
| 24 | **User profile** | No* | **Yes — user profile** | **High** | **@Smoke** | *Assessment AC1 — verify profile after login |
| 25 | **Contact form** | Yes | **Yes — messages** | Low | @Regression | `/contact` — name, email, subject dropdown, message, attachment |
| 26 | **Contact attachment upload** | Yes | **Yes — file storage** | Low | @Regression | **Quirk:** only `.txt` files, must be 0 KB |
| 27 | **Favorites / wishlist** | Icon likely* | **Yes — user favorites** | Medium | @Regression | *Referenced in community test suites; heart icon on products |
| 28 | **Navigation / header links** | Yes | No | Low | — | Home, categories, cart badge, account menu |
| 29 | **Documentation link** | Yes | No | — | — | External docs (out of test scope) |
| 30 | **Testing guide links** | Yes | No | — | — | Black-box testing & bug-hunting guides (out of scope) |

---

## 2. Server-Side State Map

| State Domain | Features That Depend on It | Why It Matters |
|--------------|---------------------------|----------------|
| **Authentication / session** | Login, register, logout, profile, checkout step 1, invoices, favorites | Bearer token / session cookie gates most post-login flows |
| **User profile** | Registration data, billing address, profile verification (AC1) | Persisted user record; address reused at checkout |
| **Shopping cart** | Add to cart, update qty, remove, cart badge count, checkout | Cart ID tied to user/session; stale cart = broken purchase |
| **Orders / checkout** | Billing, payment, order confirmation | Multi-step wizard writes order state server-side |
| **Invoices** | Invoice generation, My Invoices list/detail | **Double-confirm** required before invoice is created |
| **Contact messages** | Contact form submission | Server stores message + optional attachment |
| **Catalog (read-only)** | Products, categories, brands, search, filters | Served from API/DB but no user-specific state |

---

## 3. Highest Business Risk if Broken

| Rank | Flow | Why |
|------|------|-----|
| **1 — Critical** | **Register → Login → Profile verify** | No account = no purchase; blocks entire user journey (AC1) |
| **2 — Critical** | **Add to cart → Checkout → COD payment → Invoice** | Core revenue path; assessment AC2 |
| **3 — Critical** | **Invoice generation (double-confirm)** | Silent failure if confirm clicked once; invoice never created |
| **4 — High** | **Cart quantity update with multiple items** | Wrong totals, checkout errors, AC2 multi-item requirement |
| **5 — High** | **My Invoices — view generated invoice** | AC2 acceptance criterion; proves order completed |
| **6 — Medium** | **Invalid login / registration validation** | Security + UX; password rules enforced client + server |
| **7 — Medium** | **Product search / filter accuracy** | Discovery broken = users can't find products |
| **8 — Low** | **Contact form submission** | Non-revenue; isolated feature |

---

## 4. Smoke vs Regression Grouping

### @Smoke — Must pass on every build (4 tests)

Fast, critical-path checks proving the app is **alive and sellable**.

| Test | Covers Features | Rationale |
|------|----------------|-----------|
| **TC-UI-S01** Register + Login + Profile verify | #16, #14, #24 | AC1 — foundation for all authenticated flows |
| **TC-UI-S02** Browse product + Add to cart | #9, #10, #11 | Proves catalog → cart pipeline works |
| **TC-UI-S03** Checkout COD + Double-confirm invoice | #18, #20, #21, #22 | AC2 — end-to-end purchase; catches confirm quirk |
| **TC-UI-S04** View invoice in My Invoices | #22, #23 | AC2 — proves order persisted and retrievable |

### @Regression — Broader coverage (4 tests)

Deeper validation of edge cases, negative paths, and secondary features.

| Test | Covers Features | Rationale |
|------|----------------|-----------|
| **TC-UI-R01** Multi-item cart + quantity update | #10, #12, #11 | AC2 multi-item + qty change; totals integrity |
| **TC-UI-R02** Invalid login credentials | #14 | Negative auth; error message + no session leak |
| **TC-UI-R03** Registration validation (weak password) | #16 | Password rules: 8+ chars, upper/lower, number, symbol |
| **TC-UI-R04** Product search + category filter | #2, #5, #8 | Catalog discovery; filter combination |

**Total: 8 UI tests** (4 Smoke + 4 Regression) — within assessment 5–8 per-type guidance when combined with manual/API tiers separately.

---

## 5. Special Behaviors Worth Noting

| # | Behavior | Impact on Tests |
|---|----------|-----------------|
| 1 | **Double-confirm for invoice** | Must click Confirm **twice** on checkout/invoice step; single click leaves order unconfirmed |
| 2 | **Password strength rules** | Min 8 chars, upper+lower, number, special symbol; UI shows strength meter |
| 3 | **Address auto-fill** | Registration: enter country + postal code + house number → street/city/state auto-populated |
| 4 | **Checkout is a 4-step wizard** | Sign in → Billing Address → Payment → Confirm; cannot skip steps |
| 5 | **Cash on Delivery** | Assessment mandates COD payment method for AC2 |
| 6 | **Contact attachment quirk** | Only `.txt` files allowed, must be exactly 0 KB — likely intentional test trap |
| 7 | **Angular SPA** | Page content loads via API calls; need proper waits for product grid, cart badge |
| 8 | **Cart badge** | Header shows item count; useful assertion point |
| 9 | **Related products** | Shown on product detail page — optional assertion |
| 10 | **Google OAuth login** | Alternative auth path; out of scope for 8-test limit unless time permits |

---

## 6. Scoped 8-Test UI Plan (Final)

```
#  | ID          | Title                                      | Risk  | Tag
---|-------------|--------------------------------------------|-------|------------
1  | TC-UI-S01   | Register, login, verify profile (AC1)      | High  | @Smoke
2  | TC-UI-S02   | Add product to cart from detail page       | High  | @Smoke
3  | TC-UI-S03   | Complete COD checkout with double-confirm    | High  | @Smoke
4  | TC-UI-S04   | View generated invoice in My Invoices      | High  | @Smoke
5  | TC-UI-R01   | Add multiple items and update quantities   | High  | @Regression
6  | TC-UI-R02   | Reject login with invalid credentials      | Medium| @Regression
7  | TC-UI-R03   | Reject registration with weak password     | Medium| @Regression
8  | TC-UI-R04   | Search product and filter by category      | Medium| @Regression
```

### Features intentionally deferred (out of 8-test scope)

- Forgot password flow
- Google OAuth login
- Contact form + attachment quirk
- Favorites/wishlist
- Brand/sustainability/price-range filters
- Sort order permutations (6 options)
- Bank transfer payment method
- Invoice detail drill-down (covered partially by S04)

---

## 7. Traceability to Assessment ACs

| Assessment AC | UI Tests Covering It |
|---------------|---------------------|
| **AC1:** Registration & Login & Profile | TC-UI-S01, TC-UI-R02, TC-UI-R03 |
| **AC2:** E2E Purchase Flow (browse → cart → qty → COD → invoice) | TC-UI-S02, TC-UI-S03, TC-UI-S04, TC-UI-R01 |

---

## Entry 2: QA Risk Register — Practice Software Testing Toolshop

**Prompt:**
> Build a QA risk register for Practice Software Testing Toolshop.
> Structure each row as: Flow | What Could Go Wrong | Business Impact | Test Priority | Coverage Type | Tag
> Flows to cover: registration, login, product search, cart management, quantity update, checkout, invoice confirmation (double-confirm), invoice retrieval.
> For each risk: explain WHY it's a risk, not just that it exists.
> End with a 3-sentence test strategy summary.

**AI Response Summary:**
Risk register with 20 rows across 8 flows, each with causal risk explanation, priority, coverage type, and smoke/regression tag. Closes with a 3-sentence test strategy.

**Validation Notes:**
Risks derived from reconnaissance (Entry 1), assessment ACs, and known Toolshop quirks (double-confirm, password rules, address auto-fill, 4-step checkout).

---

### QA Risk Register

| Flow | What Could Go Wrong | Business Impact | Test Priority | Coverage Type | Tag |
|------|---------------------|-----------------|---------------|---------------|-----|
| **Registration** | Duplicate email accepted without clear error | A second account may be created or the user gets a generic failure with no guidance to log in instead — because email is the primary identity key, this causes support churn and blocks the user from reaching checkout under the account they intended to use | P1 | Manual + UI | @Regression |
| **Registration** | Password rules pass on UI but fail on server (or vice versa) | The form shows a green strength meter but submission is rejected — because registration has 4 independent rules (length, case, number, symbol), a mismatch between client and server validation leaves users in a retry loop with no path to account creation, blocking the entire purchase funnel | P1 | Manual + UI | @Regression |
| **Registration** | Address auto-fill populates wrong street/city from postal code + house number | Billing data saved to the user profile is incorrect — because checkout reuses registration address and the auto-fill depends on an external lookup, a wrong address means invoices ship to invalid locations and COD orders cannot be fulfilled | P2 | Manual + UI | @Regression |
| **Registration** | Required fields (DOB, phone, country) accept invalid or empty values | A user record is created with incomplete data — because downstream checkout and invoice generation require valid billing details, partial registration appears to succeed but causes failures two steps later in the wizard | P2 | Manual | @Regression |
| **Login** | Valid credentials rejected after successful registration | User cannot access cart, checkout, or invoices — because the auth token/session is the gate for every server-side state operation, a login failure immediately after registration means the registration investment is wasted and no purchase is possible | P1 | UI + API | @Smoke |
| **Login** | Invalid credentials do not show a clear error message | User cannot distinguish between wrong password, unregistered email, or server error — because without actionable feedback, users retry indefinitely or abandon the site, directly reducing conversion on every subsequent visit | P2 | UI | @Regression |
| **Login** | Session expires mid-checkout without warning | User completes billing and payment steps but submission fails silently — because the 4-step checkout wizard spans multiple pages and session timeout is not surfaced, the user loses cart and form data and must restart, increasing abandonment at the highest-friction point | P1 | UI | @Regression |
| **Product Search** | Search returns zero results for a known existing product | User cannot find products to purchase — because search is the primary discovery path when users know what they want, a broken index or case-sensitivity bug makes the catalog appear empty even when products exist | P2 | UI | @Regression |
| **Product Search** | Search results include products outside the query scope | User adds wrong item to cart — because imprecise matching (partial token, category bleed) leads to incorrect product selection, which propagates through cart totals, checkout, and invoice line items | P3 | UI | @Regression |
| **Product Search** | Search combined with category filter returns stale/unfiltered results | User sees products from the wrong category — because Angular SPA re-renders asynchronously, a race between filter application and search query can show a mixed result set, causing the user to add unintended items | P3 | UI | @Regression |
| **Cart Management** | Add-to-cart succeeds on UI but cart badge count does not update | User believes the cart is empty and abandons purchase — because the header badge is the only persistent cart indicator across pages, a desync between API response and UI state causes the user to re-add items or leave | P1 | UI + API | @Smoke |
| **Cart Management** | Cart contents lost after login (guest cart not merged) | Items added before login disappear — because cart is server-side and tied to session/user ID, failure to merge anonymous cart into authenticated cart means the user must re-browse, adding friction at the login → checkout transition | P1 | UI | @Smoke |
| **Cart Management** | Remove item does not update line totals or cart is not empty after last item removed | Checkout blocked with phantom items or wrong total — because the checkout wizard reads cart state server-side, stale line items cause payment amount mismatches or prevent proceeding to billing | P2 | UI | @Regression |
| **Quantity Update** | Increasing quantity does not recalculate line total or cart total | User pays wrong amount at checkout — because quantity × unit price is computed server-side and displayed in the cart, a failure to update totals means the invoice amount does not match what the user saw, creating a trust and reconciliation issue | P1 | UI + API | @Regression |
| **Quantity Update** | Quantity set to 0 or negative is accepted | Order placed for zero items or system error at checkout — because quantity validation is a boundary check, accepting invalid values either creates empty orders or crashes the checkout API, blocking invoice generation entirely | P2 | UI | @Regression |
| **Quantity Update** | Quantity exceeds available stock without warning | Order confirmed for unavailable inventory — because the Toolshop does not always surface stock limits in the UI, over-ordering leads to invoice generation for items that cannot be fulfilled, breaking the order-to-delivery chain | P3 | Manual + UI | @Regression |
| **Checkout** | User can skip checkout steps (billing or payment) via direct URL | Order created without valid billing or payment method — because the wizard enforces a 4-step sequence (Sign in → Billing → Payment → Confirm), bypassing a step via URL navigation creates incomplete orders that fail at invoice generation | P1 | UI | @Smoke |
| **Checkout** | Cash on Delivery option missing or not persisted | User cannot complete purchase per assessment AC2 — because COD is the mandated payment method in the assessment acceptance criteria, its absence or failure to save blocks the entire E2E purchase flow | P1 | UI | @Smoke |
| **Checkout** | Billing address not pre-filled from registration profile | User must re-enter address manually, increasing abandonment — because the registration form captures full address with auto-fill, failure to propagate this data to checkout step 2 adds redundant data entry at the highest drop-off point | P2 | UI | @Regression |
| **Invoice Confirmation** | Single Confirm click does not generate invoice (double-confirm required) | User believes order is complete but no invoice exists — because the application requires **two consecutive Confirm clicks** (undocumented in UI, only in assessment guide), testers and real users who click once leave the order in an unconfirmed state with no invoice, no error, and no recovery path | P1 | Manual + UI | @Smoke |
| **Invoice Confirmation** | Double-confirm creates duplicate invoices for the same order | User sees two invoices for one purchase — because the confirm endpoint may not be idempotent, rapid double-clicking or retry logic could fire twice, causing accounting discrepancies and customer confusion | P2 | UI + API | @Regression |
| **Invoice Confirmation** | Confirm step shows success but invoice ID is null or missing | User cannot reference or retrieve the order — because the invoice ID is the key used in My Invoices and API lookups, a success message without a valid ID makes the purchase untraceable | P1 | UI + API | @Smoke |
| **Invoice Retrieval** | Completed invoice not visible in My Invoices list | User cannot verify purchase was successful — because My Invoices is the only post-purchase confirmation surface in the UI (no email receipt), a missing entry means the user has no proof of order and cannot dispute or track delivery | P1 | UI + API | @Smoke |
| **Invoice Retrieval** | Invoice detail page shows wrong items, quantities, or totals vs cart | User disputes order accuracy — because the invoice is the legal record of the transaction, any mismatch between cart contents and invoice line items indicates a data integrity bug in the order-to-invoice pipeline | P1 | UI + API | @Regression |
| **Invoice Retrieval** | Invoice list accessible without authentication | Customer order history exposed to unauthorized users — because invoices contain PII (billing address, order details), missing auth guard on `/account/invoices` is a security vulnerability with regulatory implications | P1 | UI + API | @Regression |

---

### Test Strategy Summary

Prioritize **P1 risks on the critical purchase path** — registration, login, add-to-cart, COD checkout, double-confirm invoice, and invoice retrieval — as @Smoke tests that run on every build, because failures here block revenue and both assessment ACs entirely. Layer **P2 regression tests** for negative paths (invalid login, weak password, quantity boundaries, billing pre-fill) and the double-confirm edge cases, because these catch the silent failures and data-integrity bugs that pass smoke but break real user sessions. Defer **P3 risks** (search precision, stock limits) unless capacity allows, since they affect discovery and edge cases but do not block the core register → purchase → invoice journey that the assessment evaluates.
