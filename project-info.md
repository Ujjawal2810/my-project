# Project Info — Toolshop QA Assessment

| Field | Value |
|-------|--------|
| **Primary AI tool** | Cursor (Agent / Composer) |
| **Application under test** | Practice Software Testing — Toolshop (UI v2.3) |
| **Repository** | https://github.com/Ujjawal2810/my-project |
| **Assessment start date** | August 2026 |
| **Submission date** | 6 August 2026 |

---

## 1. Project Summary

I tested the Practice Software Testing Toolshop application using a Prism-style Playwright framework (`PrismStructure/`) with separate UI and API tiers. UI automation covers registration, login validation, product search, cart management, and a Cash on Delivery purchase through invoice verification; API automation covers register → login → products → cart → invoice plus three negative auth/validation cases. Manual coverage is documented in `FunctionalTestCase.csv` (eight cases, TC-M01–TC-M08).

---

## 2. Application Under Test + Base URLs

| Layer | URL | Notes |
|-------|-----|--------|
| **UI** | `https://practicesoftwaretesting.com` | Default `BASE_URL` in `PrismStructure/.env.example` |
| **API** | `https://api.practicesoftwaretesting.com` | Default `API_BASE_URL`; OpenAPI served at `/docs?api-docs.json` |
| **API docs (Swagger UI)** | `https://api.practicesoftwaretesting.com/api/documentation` | Used for endpoint/schema reference during API test design |

Credentials for the public demo users (`customer@`, `customer2@`, `customer3@`) are loaded from a local `.env` file (not committed). Registration and API lifecycle tests generate unique emails at runtime via `utils/registrationFactory.js`.

---

## 3. Tools Used

| Category | Tool / version |
|----------|----------------|
| **Automation** | Playwright `@playwright/test` **^1.50.0** (`PrismStructure/package.json`) |
| **Runtime** | Node.js **v26.1.0** (local execution environment) |
| **Browser** | Chromium (Desktop Chrome profile via Playwright `devices`) |
| **Language** | JavaScript (CommonJS) |
| **Config / env** | `dotenv` ^16.4.7, `playwright.config.js` with `ui-chromium` and `api-tests` projects |
| **Reporting** | Playwright HTML reporter → `PrismStructure/reports/html/`; JSON → `PrismStructure/reports/results.json` |
| **Manual tests** | `FunctionalTestCase.csv` at repository root |
| **AI** | **Cursor** (planning, test design, code generation, debugging, documentation drafts) |
| **Version control** | Git + GitHub (`main` branch, iterative commits) |

---

## 4. Test Scope

### In scope (implemented in this repository)

**Manual (8 cases)** — `FunctionalTestCase.csv`

| ID | Focus | Tag |
|----|--------|-----|
| TC-M01 | Registration | @smoke |
| TC-M02 | Login + profile | @smoke |
| TC-M03 | Invalid login | @regression |
| TC-M04 | Search — no results | @regression |
| TC-M05 | Search + multi-product cart | @smoke |
| TC-M06 | Cart quantity totals | @regression |
| TC-M07 | COD checkout + double confirm | @smoke |
| TC-M08 | My Invoices verification | @smoke |

**UI automation (7 tests)** — `PrismStructure/tests/ui/`

| Spec | What it covers | Tag |
|------|----------------|-----|
| `home.spec.js` | Home page load; positive search | @smoke, @regression |
| `auth-register.spec.js` | Register + login + nav account name | @smoke |
| `auth-login-invalid.spec.js` | Wrong password error message | @regression |
| `search-no-results.spec.js` | Empty search state | @regression |
| `cart-remove-item.spec.js` | Remove line item; empty cart blocks checkout | @regression |
| `purchase-journey.spec.js` | Login → two products → cart qty → COD → double confirm → invoice | @smoke, @regression |

**API automation (6 tests)** — `PrismStructure/tests/api/`

| Spec | What it covers | Tag |
|------|----------------|-----|
| `auth.spec.js` | Login returns bearer token | @smoke |
| `order-lifecycle.spec.js` | Register → login → products → cart (smoke); full lifecycle through invoice (regression) | @smoke, @regression |
| `api-negative.spec.js` | Wrong password (401); malformed token (401); missing billing field (422) | @regression |

**Framework assets:** page objects (`pageObjects/`), API clients (`apiClients/`), shared test data (`test-data/toolshop.json`), env helper (`utils/env.js`).

### Deliberately out of scope

- **Contact form**, forgot-password, Google OAuth, favorites/wishlist, admin flows, and non-COD payment methods in UI automation (purchase journey uses Cash on Delivery only).
- **Guest checkout API** (`POST /invoices/guest`) and catalog CRUD (brands, categories, products POST).
- **Cross-user cart isolation** — probed on live API; `GET /carts/{id}` returns 200 for another user’s cart, so a 403 test was not implemented.
- **Selenium / Java Prism** — assessment requires Playwright JS; only Prism *naming/layering* was adopted (`PrismStructure/README.md`).
- **Assessment items not yet in repo:** root `readme.md`, `.cursor/` rules/skills, and two additional `ai-prompts/` files referenced in the participant guide (three prompt logs exist today: `requirements-and-planning.md`, `test-design.md`, `automation-and-debugging.md`).

---

## 5. How AI Was Used at Each Phase

| Phase | How I used AI | Concrete example |
|-------|----------------|------------------|
| **Planning** | Fed the participant guide into Cursor and asked for a structured deliverables extraction with limits and conflicts flagged. | Output became `ai-prompts/requirements-and-planning.md` (8-test cap per tier, AC1/AC2 mapping, folder tree). |
| **Test design** | Asked for a gap analysis of existing UI specs against planned manual cases and to add only the top two missing regression scenarios. | Added `search-no-results.spec.js` (TC-M04) and `cart-remove-item.spec.js` after comparing coverage to `FunctionalTestCase.csv`. |
| **Automation** | Described acceptance criteria and asked for Playwright specs using existing page objects/API clients, with tags and no hardcoded tokens. | `order-lifecycle.spec.js` and `api-negative.spec.js` were generated against `AuthApi`, `CartApi`, `InvoiceApi`, and `registrationFactory.js`. |
| **Debugging** | Pasted failure context and asked for root-cause analysis with minimal fixes; used AI to interpret OpenAPI vs live API behavior. | Cart add-item path was corrected from `/carts/{id}/items` (404) to `/carts/{id}` after live probing; checkout **double Confirm** on Payment step was confirmed before encoding it in `purchase-journey.spec.js`. |
| **Documentation** | Asked AI to extract API lifecycle fields from Swagger/OpenAPI and to draft this `project-info.md` from repository facts only. | OpenAPI JSON from `/docs?api-docs.json` drove endpoint/path notes; invoice `payment_method` omission in responses was flagged rather than assumed. |

---

## 6. How AI Output Was Validated Before Use

I did not copy AI-generated tests or locators without running them against the live Toolshop UI and API.

| Check | What I did | Example change |
|-------|------------|----------------|
| **Execute tests** | Ran `npm run test:smoke`, `test:regression`, `test:ui`, and `test:api` after each major addition. | Fixed `CartApi.addItem` when `/items` returned 404 on the real API. |
| **Probe the SUT** | Used short live API calls and UI navigation to confirm status codes, response shapes, and locators. | Invoice creation returns **201** (not 200 per stale OpenAPI); assertion updated accordingly. |
| **Cross-check docs** | Compared AI’s API summary to OpenAPI JSON and to assessment AC payloads in `toolshop.json`. | Billing payload for invoices matches the example in `requirements-and-planning.md`. |
| **Review locators** | Updated page objects when scaffold selectors did not match the live app (e.g. `[data-test="add-to-cart"]`, `[data-test="nav-cart"]`, invoice fields as textboxes). | Changes in `ProductPage.js`, `CartPage.js`, `InvoicePage.js`, `LoginPage.js`. |
| **Reject invalid scenarios** | Dropped AI-suggested cross-user cart 403 test after live API returned 200 for another user’s cart ID. | Documented in `api-negative.spec.js` design rationale. |
| **Secrets hygiene** | Kept `.env` gitignored; verified run logs and HTML reports do not print bearer tokens. | `ApiHelper` logs HTTP paths only, not request bodies. |

**Known residual risk:** `purchase-journey.spec.js` can time out on `/auth/login` under full parallel UI runs (`LoginPage.goto`); smoke/regression grep runs usually pass. A `domcontentloaded` navigation change is identified but not yet committed.

---

## 7. Sensitive Data Policy

**Never shared with AI**

- Contents of my local `.env` file (actual passwords in use on my machine).
- Any personal API keys, tokens, or credentials outside the Toolshop public demo accounts.
- Private or employer-specific systems unrelated to this assessment.

**Shared with AI (intentionally, for this public practice app)**

- Public Toolshop demo account *names* (e.g. `customer@practicesoftwaretesting.com`) — these are documented by the application vendor.
- Structural test data in `toolshop.json` and `FunctionalTestCase.csv` (including the public registration password pattern `ShopTest1!` and demo passwords listed in `.env.example`).

**Repository policy**

- `.env` is listed in `PrismStructure/.gitignore` and is not committed.
- `.env.example` contains placeholder/demo values for setup only.
- Bearer tokens are obtained at runtime from login responses and passed via `ApiHelper.authHeaders(token)` — never hardcoded in specs.

---

## 8. How This Workflow Applies to a Real Project

On this assessment I treated AI as a **drafting and analysis assistant**, not an oracle: I anchored every automation artifact in runnable code under `PrismStructure/`, kept manual and automated cases traceable to AC1/AC2 via IDs and tags, and used short live probes to overturn wrong assumptions (cart URL, double-confirm checkout, invoice status code). In a production team I would reuse the same pattern—requirements and risk notes in `ai-prompts/`, a bounded smoke/regression split in Playwright projects, secrets in CI env vars, and a hard rule that no AI-generated locator or API path merges without a green local run plus peer review on anything touching payments or auth. The main gap I would close before calling this submission-complete is finishing root `readme.md`, `.cursor/` rules, filling `ActualResult`/`Status` in `FunctionalTestCase.csv` after a full manual pass, and stabilizing the login navigation flake before relying on `test:ui` in CI.
