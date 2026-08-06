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
