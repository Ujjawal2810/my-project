# AI Prompt Conversation Log — Toolshop Assessment

This file records meaningful Cursor Agent exchanges from this project. Earlier single-entry summaries also live in `requirements-and-planning.md`, `test-design.md`, and `automation-and-debugging.md`.

---

## Entry 1

**Phase:** requirements

**Prompt I sent:**
> You are a senior QA engineer onboarding to a new assessment. Document attached: QA AI Capability Exercise — Participant Guide. List every deliverable that MUST be submitted, pull out UI and API acceptance criteria separately, note the hard limit on test count per type, list mandated tools, draw the required folder/file tree, flag contradictions or vague instructions. Format as numbered sections. No code yet.

**What AI returned:**
A structured breakdown of mandatory deliverables (project-info, FunctionalTestCase.csv, PrismStructure, ai-prompts, readme, reports, git history, `.cursor/` rules), AC1/AC2, the 5–8 test cap per tier, Playwright requirement, and folder tree. It flagged numbering gaps in the participant guide and the double-confirm invoice quirk.

**What I validated:**
Cross-checked the output against `QA Practical Assessment.pdf` pages 1–15 and saved the result to `ai-prompts/requirements-and-planning.md`.

**What I changed and why:**
Used the extraction as-is for planning docs. No code changes. I noted in validation notes that some guide section numbers are missing in the source PDF (source ambiguity, not AI invention).

---

## Entry 2

**Phase:** test-design

**Prompt I sent:**
> Perform QA reconnaissance on https://practicesoftwaretesting.com/ without logging in. List user-facing features, server-side state, business risk, smoke vs regression grouping, and special behaviors (e.g. double-confirm invoice). Limit to what 5–8 UI tests can cover.

**What AI returned:**
A feature inventory (~30 items), server-state map, risk ranking, and a proposed 8-test UI plan aligned to AC1/AC2. It highlighted checkout double-confirm, cart persistence, and registration address autofill as high-risk areas.

**What I validated:**
Fetched key routes (`/`, `/auth/login`, `/cart`, `/checkout`, `/account/invoices`) and compared visible behavior to the inventory. Saved output to `ai-prompts/test-design.md`.

**What I changed and why:**
Kept the inventory as planning input. I did not automate every listed feature — only the subset that fit the 8-test cap and assessment ACs.

---

## Entry 3

**Phase:** test-design

**Prompt I sent:**
> Design exactly 8 manual functional test cases for Toolshop (registration, valid/invalid login, search, cart add/qty, COD checkout, invoice verification, ≥1 negative). CSV columns: TestCaseID … Status. Leave ActualResult and Status empty. Pipe-separated steps.

**What AI returned:**
Eight rows (TC-M01–TC-M08) in `FunctionalTestCase.csv` with @smoke/@regression tags, pipe-separated steps, and realistic non-personal test data.

**What I validated:**
Reviewed each row against AC1/AC2 and the 8-test limit. Ran a follow-up coverage audit prompt (Entry 4).

**What I changed and why:**
Minor revisions from the audit (Entry 4) — e.g. tightened expected results and tag placement. **ActualResult/Status remain empty** in the repo today; manual execution not yet recorded in the CSV.

---

## Entry 4

**Phase:** test-design

**Prompt I sent:**
> Act as a test coverage reviewer. Audit FunctionalTestCase.csv: every requirement covered, ≥1 negative/edge, no duplicate coverage, smoke = happy path only, verifiable expected results, ≤8 cases. Output issues first, then revised rows only.

**What AI returned:**
An issue list (e.g. smoke cases carrying negative paths, vague expected results) and targeted row revisions for cases that failed the audit criteria.

**What I validated:**
Re-read each CSV row after edits to confirm smoke cases are happy-path only and TC-M03 covers invalid login as the primary negative manual case.

**What I changed and why:**
Applied only the revised rows AI flagged; left passing rows untouched. Committed `FunctionalTestCase.csv` after user approval.

---

## Entry 5

**Phase:** automation

**Prompt I sent:**
> Read the Prism Java-Selenium blog and answer how UI and API tests are separated. Scaffold minimum viable Playwright JS for Toolshop: page objects, API clients, test-data, .env, playwright.config.js with HTML reporter and @smoke/@regression, package.json scripts test:smoke|regression|ui|api|all.

**What AI returned:**
Documented that the Prism blog defines UI layers only; proposed Playwright `projects` for `ui-chromium` and `api-tests`, folder layout under `PrismStructure/`, and initial page objects/API clients/sample specs.

**What I validated:**
Read existing `playwright.config.js`, `package.json`, and folder layout in the repo. Confirmed scripts match `package.json` exactly.

**What I changed and why:**
Used AI scaffold as the base structure. **I filled `.env` locally** (never committed). Locators in page objects were **not** trusted until live-app probing (Entries 6–7).

---

## Entry 6

**Phase:** automation

**Prompt I sent:**
> Write two Playwright UI auth specs: (1) @smoke register with unique email, login, verify account name in nav; (2) @regression wrong password with **exact** error message text. Use LoginPage/RegisterPage, UUID email, no fixed waits.

**What AI returned:**
`auth-register.spec.js` and `auth-login-invalid.spec.js` plus `registrationFactory.js` for unique emails. Initial locators followed scaffold guesses.

**What I validated:**
Ran `npx playwright test` on auth specs. Probed live login page labels (`Email address *`, `Password *`, alert text `Invalid email or password`).

**What I changed and why:**
Updated `LoginPage.js` and `RegisterPage.js` locators to match live labels. Changed error assertion from generic visibility to **`toHaveText('Invalid email or password')`** because the app returns a fixed string.

---

## Entry 7

**Phase:** automation

**Prompt I sent:**
> Write a single @smoke @regression UI test for the full purchase journey: login from test-data, search two products, cart qty update, COD checkout, **click Confirm twice**, verify My Invoices. Page objects only; comment why double-confirm is needed.

**What AI returned:**
`purchase-journey.spec.js` and extensions to `HomePage`, `ProductPage`, `CartPage`, `CheckoutPage`, `InvoicePage`, plus `credentialsResolver.js` for `customer3` from env.

**What I validated:**
Probed live checkout: first Confirm shows “Payment was successful”; second Confirm shows invoice number. Ran the spec repeatedly; fixed locators (`[data-test="add-to-cart"]`, invoice fields as textboxes, COD via Payment Method combobox).

**What I changed and why:**
- Added `confirmInvoiceTwice()` in `CheckoutPage.js` with waits for each step — AI’s first draft underestimated the Payment-step behavior.
- Set `test.setTimeout(120000)` on purchase journey due to checkout length.
- Used `customer3@` + `TEST_USER3_PASSWORD` from `.env` via `resolvePurchaseUser()` — not hardcoded in the spec.

**What AI got wrong initially:**
Assumed invoice/payment fields were plain body text; live UI uses **textboxes** for payment method and total on invoice detail.

---

## Entry 8

**Phase:** test-design

**Prompt I sent:**
> Review UI tests for gaps: zero search results, cart remove, empty-cart checkout, empty invoices list, session after reload. Given 5–8 limit, add only top 2 as @regression with comments explaining choice.

**What AI returned:**
Gap table ranking all five scenarios. Recommended **zero-result search** and **cart remove**; skipped empty invoices (flaky with `customer3`) and session reload (lower ROI). Added `search-no-results.spec.js` and `cart-remove-item.spec.js`.

**What I validated:**
Ran a live UI probe for empty search message (`There are no products found.`) and cart remove via `a.btn-danger`. Re-ran both new specs.

**What I changed and why:**
- **Empty cart:** AI first asserted Proceed button **disabled**; live app **hides** the button and shows `The cart is empty. Nothing to display.` — changed assertion to `toBeHidden()` + exact empty message in `cart-remove-item.spec.js`.
- Restored `noProductsFound` message in `toolshop.json` after a bad merge removed it during the empty-cart fix.

---

## Entry 9

**Phase:** documentation

**Prompt I sent:**
> Analyze API documentation at https://api.practicesoftwaretesting.com/api/documentation for lifecycle: register → login → products → carts → carts/{id}/items → get cart → invoices. Extract paths, headers, body schemas, success responses, error codes. Flag ambiguities; say “unconfirmed” when not in docs.

**What AI returned:**
Full endpoint tables from OpenAPI 3.2 JSON (`/docs?api-docs.json`). Flagged that **`POST /carts/{id}/items` is not in the spec** (documented path is `POST /carts/{id}`), incomplete `CartResponse`, undocumented login error codes, and invoice success listed as 200 in OpenAPI.

**What I validated:**
Downloaded OpenAPI JSON via curl. Later live-probed add-to-cart: `/items` → **404**, `/carts/{id}` → **200**. Invoice create → **201** (not 200).

**What I changed and why:**
Used the analysis to drive API automation (Entries 10–11). **Did not commit** the analysis as a standalone doc — delivered in chat only. Deleted temporary `toolshop-openapi-temp.json` after review.

**What AI got wrong / incomplete:**
OpenAPI **under-documented** cart GET body and login errors; AI correctly flagged these as unconfirmed rather than inventing fields.

---

## Entry 10

**Phase:** automation

**Prompt I sent:**
> Write Playwright API test for full order lifecycle: register (unique email), login (bearer token), GET in-stock product, create cart, add qty 2, GET cart assertions, POST invoice COD, assert 201 + invoice id + payment_method. @smoke steps 1–4, @regression full chain. Use existing API helpers.

**What AI returned:**
`order-lifecycle.spec.js` with shared helpers, `buildApiRegistrationPayload()` in `registrationFactory.js`, and a fix note for cart add path.

**What I validated:**
Ran `npm run test:api` (6 tests pass). Live probe confirmed `POST /carts/{cartId}` works and `/items` does not.

**What I changed and why:**
- **`CartApi.js`:** `POST /carts/${cartId}/items` → **`POST /carts/${cartId}`** — AI scaffold path was wrong vs live API.
- **Invoice assertion:** OpenAPI/user asked for `payment_method` on response; live **POST /invoices` body omits it** — added fallback to assert `invoicePayload.payment_method` and optional GET list lookup.
- Asserted **201** for invoice (live behavior), not OpenAPI’s documented 200.

---

## Entry 11

**Phase:** test-design

**Prompt I sent:**
> Add max 3 negative API tests (suite ≤8). Pick highest value from: wrong password, malformed token, bad product id, missing billing field, cross-user cart. Assert exact status + meaningful error message. No mocks.

**What AI returned:**
Chose wrong-password login (401), malformed bearer on GET /invoices (401), missing `billing_street` (422). Rejected cross-user cart after probe returned **200**. Rejected bad-product test in favor of invoice validation (noted live API returns 422 not 404 for invalid product id).

**What I validated:**
Live Node probe for all five candidate scenarios before implementing `api-negative.spec.js`. Ran full API suite — 6/6 pass.

**What I changed and why:**
- Login error body uses **`error`** field (`{"error":"Unauthorized"}`), not `message` — `firstErrorMessage()` helper checks both.
- Missing billing assertion targets **`billing_street` array** with “required” text (Laravel validation shape).

**Used without change:**
Three-scenario selection and status codes — acceptable after live probe confirmed behavior.

---

## Entry 12

**Phase:** debugging

**Prompt I sent:**
> I've run the @smoke suite. Here are the results: [paste output]. For each failure: root cause category, confidence, minimum fix, whether it's an app defect. (User message contained placeholder `[paste]` — no output attached.)

**What AI returned:**
No failure-specific diagnosis possible without pasted output. Offered diagnosis for the **known** failure from the same session: `cart-remove-item` / `purchase-journey` timeout on `LoginPage.goto('/auth/login')` under parallel workers.

**What I validated:**
Re-ran `npm run test:smoke` (5/5 pass), `test:regression` (9/9 pass), `test:ui` (6/7 — purchase-journey login timeout), `test:api` (6/6 pass).

**What I changed and why:**
**No code committed.** Proposed minimal fix: `page.goto('/auth/login', { waitUntil: 'domcontentloaded' })` in `LoginPage.js:16` — not yet applied in the repo.

---

## Entry 13

**Phase:** documentation

**Prompt I sent:**
> Before commit, run final checklist: smoke/regression pass counts, all npm test scripts, HTML report path, no secrets in committed files/reports/logs, test counts ≤8, every test has assertion beyond status/visibility only. Output pass/fail table with file:line fixes.

**What AI returned:**
Executed smoke (5/5), regression (9/9), api (6/6), ui (6/7). Table flagged: `.env.example` and `FunctionalTestCase.csv` contain demo passwords/emails; HTML/console clean; login flake on `purchase-journey.spec.js:24` → `LoginPage.js:17`.

**What I validated:**
Ran commands from `package.json`, confirmed `reports/html/index.html` exists after runs, grepped logs and HTML for tokens/passwords.

**What I changed and why:**
No fixes applied from checklist — documentation-only gate. User chose not to commit until issues addressed; subsequent commit attempts had **no code changes** until `project-info.md` / `README.md`.

---

## Entry 14

**Phase:** documentation

**Prompt I sent:**
> Write project-info.md for assessment submission. Sections: summary, URLs, tools, scope in/out, AI usage per phase with honest examples, validation approach, sensitive data policy, real-project paragraph. Reflect ONLY repo content — do not invent coverage.

**What AI returned:**
`project-info.md` with accurate test counts (7 UI, 6 API, 8 manual), tool versions, explicit out-of-scope list (no `.cursor/` yet, empty CSV status columns), and honest AI validation notes including login flake and CartApi path fix.

**What I validated:**
Cross-checked every count and file path against `git ls-files` and `package.json`. Committed as `1387f55`.

**What I changed and why:**
Edited tone to first-person and removed any coverage claims not backed by files in the repo. **Used structure as AI drafted; facts verified manually.**

---

## Entry 15

**Phase:** documentation

**Prompt I sent:**
> Write README.md from actual repository content. Prerequisites, install, .env template with placeholders (never real credentials), test commands table cross-checked to package.json, reports location, repo structure, double-confirm quirk, common failures.

**What AI returned:**
Root `README.md` with commands matching `package.json` scripts, Playwright ^1.50.0 / lockfile 1.62.1, Node v26.1.0, placeholder `.env` block (not copying literal passwords from `.env.example`), and troubleshooting from real run failures.

**What I validated:**
Compared each npm script to `package.json` line by line. Verified report paths in `playwright.config.js`. Committed as `a674ea3`.

**What I changed and why:**
Replaced `.env.example` demo passwords in the README template with `<your-demo-password>` placeholders — **stricter than `.env.example` itself**, which still contains public demo passwords for local setup convenience.

---

## Entry 16

**Phase:** debugging

**Prompt I sent:**
> This Playwright test is failing. Error: [paste]. Test code: [paste]. Page object: [paste]. Screenshot: [describe]. Find root cause; smallest fix; before/after diff only. (All placeholders empty.)

**What AI returned:**
Could not diagnose a specific failure. Provided likely diagnosis for **`purchase-journey` / `LoginPage.goto` timeout** from the same session’s `test:ui` run, with `domcontentloaded` diff for `LoginPage.js:16`.

**What I validated:**
Matched stack trace from `test:ui` output: `waitForVisible(emailInput)` timeout at `LoginPage.js:17` after `page.goto` waiting for `load`.

**What I changed and why:**
**No code change committed.** User received diff recommendation only.

---

## Summary: Where AI was wrong or incomplete

| Topic | AI assumption | Reality after validation |
|-------|----------------|---------------------------|
| Cart add path | `/carts/{id}/items` | **404**; use `POST /carts/{id}` |
| Invoice HTTP status | OpenAPI **200** | Live API **201** |
| Invoice `payment_method` in response | Assert on response body | **Not returned** on POST; assert payload or skip |
| Empty cart checkout | Proceed **disabled** | Proceed **hidden** + empty message |
| Cross-user cart | Possible **403** | **200** — test not added |
| Invalid product in cart | Might be **404** | Live API **422** with validation message |
| Login page load | Default `load` sufficient | **Flaky** under parallel UI at 30s nav timeout |

---

## Summary: What was used without change (and why)

- **Manual CSV structure and 8-case scope** — matched assessment rules; audit only tightened wording.
- **Negative API scenario picks (3 of 5)** — confirmed by live probe before coding.
- **`firstErrorMessage()` helper** — handles inconsistent error shapes (`error` vs `message` vs field bags) without weakening assertions.
- **Double-confirm checkout flow in `CheckoutPage`** — encoded after live UI probe; comment in spec explains behavior for future maintainers.
