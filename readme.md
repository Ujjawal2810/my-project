# Toolshop QA Automation

Playwright UI and API test automation for the [Practice Software Testing Toolshop](https://practicesoftwaretesting.com), using a Prism-style layout in `PrismStructure/`.

---

## Prerequisites

| Tool | Version |
|------|---------|
| **Node.js** | **v26.1.0** (verified locally; `package.json` does not pin an engine — use Node 18+ LTS or newer) |
| **npm** | **11.13.0** (verified locally) |
| **Playwright** | **`@playwright/test` ^1.50.0** in `package.json`; **`1.62.1`** resolved in `package-lock.json` |
| **Browser** | Chromium (install via Playwright CLI — see Installation) |

All npm commands below are run from **`PrismStructure/`** (where `package.json` lives).

---

## Installation

```bash
git clone https://github.com/Ujjawal2810/my-project.git
cd my-project/PrismStructure
npm install
npx playwright install chromium
```

### Environment setup

1. Copy the example env file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set values for the demo users you will use. **Do not commit `.env`** (it is listed in `PrismStructure/.gitignore`).

See the template in the next section. The purchase journey UI test (`purchase-journey.spec.js`) reads `customer3@practicesoftwaretesting.com` from `test-data/toolshop.json` and resolves its password from `TEST_USER3_PASSWORD` via `utils/credentialsResolver.js`.

---

## `.env` template (placeholders only)

```dotenv
# UI base URL
BASE_URL=https://practicesoftwaretesting.com

# API base URL
API_BASE_URL=https://api.practicesoftwaretesting.com

# Primary customer (auth smoke, cart-remove, invalid-login tests)
TEST_USER_EMAIL=<your-demo-email@example.com>
TEST_USER_PASSWORD=<your-demo-password>

# Secondary customer (manual TC-M06; optional for automation)
TEST_USER2_EMAIL=<your-demo2-email@example.com>
TEST_USER2_PASSWORD=<your-demo2-password>

# Purchase journey user (customer3 — required for purchase-journey.spec.js)
TEST_USER3_EMAIL=<your-demo3-email@example.com>
TEST_USER3_PASSWORD=<your-demo3-password>

# Registration tests — must meet Toolshop password rules
REGISTRATION_PASSWORD=<registration-password-meeting-toolshop-rules>

# Negative login tests — must not match TEST_USER_EMAIL
INVALID_TEST_PASSWORD=<wrong-password-for-negative-tests>
```

Use the public Toolshop demo account credentials from the application documentation, or your own registered users. Never commit real passwords to the repository.

---

## Test commands

Commands are defined in `PrismStructure/package.json`. Both Playwright projects (`ui-chromium`, `api-tests`) only run specs tagged `@smoke` or `@regression` (see `playwright.config.js`).

| Command | What it runs |
|---------|----------------|
| `npm run test:all` | All UI + API tests in both projects (`playwright test`) — **13 tests** (7 UI + 6 API) |
| `npm run test:smoke` | Tests tagged `@smoke` in UI and API (`playwright test --grep @smoke`) — **5 tests** |
| `npm run test:regression` | Tests tagged `@regression` in UI and API (`playwright test --grep @regression`) — **9 tests** |
| `npm run test:ui` | UI project only (`playwright test --project=ui-chromium`) — **7 tests** |
| `npm run test:api` | API project only (`playwright test --project=api-tests`) — **6 tests** |

Additional scripts:

| Command | What it runs |
|---------|----------------|
| `npm test` | Same as `npm run test:all` |
| `npm run report` | Opens the HTML report (`playwright show-report reports/html`) |

**Manual tests:** `FunctionalTestCase.csv` at the repository root (8 cases, TC-M01–TC-M08) — executed outside Playwright.

---

## Reports

After any Playwright run, reports are written under `PrismStructure/`:

| Output | Path | Config reference |
|--------|------|------------------|
| **HTML report** | `PrismStructure/reports/html/` | `playwright.config.js` → `reporter` `html` |
| **JSON results** | `PrismStructure/reports/results.json` | `playwright.config.js` → `reporter` `json` |
| **Committed evidence** | `PrismStructure/reports/evidence/` | Summary, log, JSON copy, HTML + PNG after green `test:all` |
| **Failure screenshots** | `PrismStructure/test-results/` | `screenshot: 'only-on-failure'` |
| **Traces (on retry)** | `PrismStructure/test-results/` | `trace: 'on-first-retry'` |

Open the HTML report:

```bash
cd PrismStructure
npm run report
```

`reports/html/` and root `reports/results.json` are gitignored; committed pass evidence lives in `reports/evidence/` after a green `npm run test:all`.

---

## Repository structure

```
my-project/
├── readme.md                    # This file
├── project-info.md              # Assessment submission: scope, AI workflow, tools
├── FunctionalTestCase.csv       # Manual test cases (TC-M01–TC-M08)
├── ai-prompts/                  # Prompt history (planning, design, automation)
│   ├── requirements-and-planning.md
│   ├── test-design.md
│   ├── test-data.md
│   └── documentation-and-summary.md
├── .cursor/
│   ├── rules/                   # toolshop-qa.mdc
│   └── skills/                  # toolshop-qa skill
└── PrismStructure/              # Playwright framework (run npm commands here)
    ├── playwright.config.js     # UI + API projects, reporters, tags
    ├── package.json
    ├── .env.example             # Env variable names (copy to .env)
    ├── base/                    # BaseTest (UI fixture entry)
    ├── fixtures/                # customFixtures.js
    ├── pageObjects/             # UI page objects (*Page.js)
    ├── apiClients/              # API clients (*Api.js) + ApiHelper.js
    ├── seleniumUtils/           # PlaywrightHelper.js
    ├── utils/                   # env, DataProvider, registrationFactory, etc.
    ├── test-data/
    │   └── toolshop.json        # Shared UI/API test data
    ├── tests/
    │   ├── ui/                  # 7 UI specs (*.spec.js)
    │   └── api/                 # 6 API specs (*.spec.js)
    └── reports/                 # Generated at runtime (html/, results.json)
```

---

## Known application quirks

### Double Confirm on checkout (Cash on Delivery)

On the **Payment** step of checkout, after selecting **Cash on Delivery**, you must click **Confirm twice**:

1. **First Confirm** — shows a “Payment was successful” message.
2. **Second Confirm** — completes the order and displays “Thanks for your order! Your invoice number is INV-…”.

A single Confirm leaves the order **unconfirmed** with **no invoice**. This is implemented in `pageObjects/CheckoutPage.js` (`confirmInvoiceTwice()`) and exercised in `tests/ui/purchase-journey.spec.js`.

### Other behaviors reflected in tests

- **Billing address autofill:** postal code + house number populate street/city/state on register and checkout (`RegisterPage.js`, `CheckoutPage.js`).
- **Cart remove:** line items use `a.btn-danger` (no `data-test` on remove link) — `CartPage.js`.
- **API add-to-cart path:** `POST /carts/{cartId}` (not `/carts/{cartId}/items`) — `apiClients/CartApi.js`.
- **Invoice API:** successful create returns **201**; `payment_method` is not always echoed in the response body — `order-lifecycle.spec.js` handles this.

---

## Common failures and fixes

| Symptom | Likely cause | Fix |
|---------|----------------|-----|
| `Executable doesn't exist` / browser not found | Chromium not installed for Playwright | From `PrismStructure/`: `npx playwright install chromium` |
| `Purchase flow user email/password missing` | `.env` not created or `TEST_USER3_PASSWORD` empty | Copy `.env.example` → `.env` and set `TEST_USER3_*` (required for `purchase-journey.spec.js`) |
| Login API / auth smoke fails | `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` missing or wrong | Set primary user vars in `.env` to valid Toolshop demo credentials |
| Timeout on `/auth/login` (email field not visible) | Slow navigation under parallel UI workers (`navigationTimeout` 30s) | Re-run `npm run test:ui`; if persistent, reduce workers (`npx playwright test --project=ui-chromium --workers=1`) or apply `waitUntil: 'domcontentloaded'` on `LoginPage.goto()` |
| `npm run test:smoke` passes but `test:ui` fails on same spec | Parallel load flake on `purchase-journey` login step | Run smoke/regression grep runs for CI signal; stabilize login navigation before gating on full `test:ui` |
| API cart add returns 404 | Wrong path `/carts/{id}/items` | Use current `CartApi.addItem` → `POST /carts/{cartId}` |
| Empty product search results | Keyword matches no in-stock products | `toolshop.json` defines fallbacks in `purchaseFlow.productSearchFallbacks`; adjust keywords if catalog changes |
| HTML report missing | Reports are gitignored; tests not run yet | Run any `npm run test:*` command, then `npm run report` |

---

## Related documentation

- **`project-info.md`** — assessment scope, AI usage, validation approach, sensitive data policy.
- **`PrismStructure/README.md`** — Prism pattern mapping (UI vs API separation, folder layout).
- **API docs:** https://api.practicesoftwaretesting.com/api/documentation
