# AI Prompts – Test Data Strategy

## Entry 1: Test Data Architecture for Toolshop Automation

**Prompt I sent:**
> Scaffold minimum Playwright structure with separate test-data file, .env for secrets, no hardcoded values in specs. How should registration emails, demo users, and API payloads be organized?

**What AI returned:**
Proposed `test-data/toolshop.json` for static UI strings and checkout defaults, `.env` for demo user passwords, `utils/registrationFactory.js` for unique API registration emails, and `utils/credentialsResolver.js` for purchase-flow user lookup via `TEST_USER3_PASSWORD`.

**What I validated:**
Confirmed specs read data through `DataProvider`, `env.js`, and factories — no raw passwords in `tests/**/*.spec.js`. Ran API lifecycle and purchase journey against live SUT.

**What I changed and why:**
- Kept **registration password pattern** in `toolshop.json` (`ShopTest1!`) because it is a public validation rule, not a user secret.
- Moved **runtime demo passwords** to local `.env` only; redacted `PrismStructure/.env.example` to `<your-demo-password>` placeholders.
- Updated manual CSV `TestData` column to reference `.env` keys instead of literal passwords.

---

## Entry 2: Invoice and Checkout Payload Data

**Prompt I sent:**
> (From assessment AC2 example) What billing payload should API invoice tests use?

**What AI returned:**
Referenced assessment example billing block (`billing_street`, `billing_city`, `billing_state`, `billing_country`, `billing_postal_code`, `payment_method: cash-on-delivery`, `payment_details: {}`).

**What I validated:**
Compared `toolshop.json` `invoice` and `checkout` sections to live API probe and `order-lifecycle.spec.js` assertions (201 + invoice number).

**What I changed and why:**
Stored billing defaults in `toolshop.json` under `invoice` and `checkout` sections. Used `payment_method` enum value `cash-on-delivery` (API) vs label `Cash on Delivery` (UI) — two keys to avoid UI/API mismatch.

---

## Entry 3: Negative and Edge Test Data

**Prompt I sent:**
> Add negative API tests and search-no-results UI test. What data should drive invalid login, malformed token, and empty search?

**What AI returned:**
`toolshop.json` → `negative.invalidPassword`, `search.invalidKeyword`, `messages.invalidLoginCredentials`, `messages.noProductsFound`, `messages.emptyCartMessage`.

**What I validated:**
Live API returned 401 for wrong password; UI showed exact alert `Invalid email or password`; search `zzxnonexistent999` returned `There are no products found.`

**What I changed and why:**
Used `WrongPass99!` as **invalid** password only (not a real account secret). Kept keyword `zzxnonexistent999` stable so empty-state test is deterministic.

---

## Test Data File Map

| Source | Purpose | Secrets? |
|--------|---------|----------|
| `PrismStructure/.env` (gitignored) | Demo user passwords | Yes — local only |
| `PrismStructure/.env.example` | Variable names + placeholders | No passwords |
| `PrismStructure/test-data/toolshop.json` | UI messages, billing, search keywords | No live passwords |
| `utils/registrationFactory.js` | Unique API registration emails | Generated at runtime |
| `FunctionalTestCase.csv` | Manual case preconditions and steps | References `.env`, no literals |
