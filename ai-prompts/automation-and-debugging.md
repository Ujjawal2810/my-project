# AI Prompts – Automation and Debugging

## Entry 1: Prism Framework Research — UI vs API Separation (Q6)

**Prompt:**
> Read Prism framework blog (TO THE NEW, Java-Selenium) and answer: How UI and API tests are separated — different folders, different config files? Make changes and commit.

**Source:** https://www.tothenew.com/blog/exploring-prism-web-automation-testing-framework-on-java-selenium/

**AI Response Summary:**
Blog documents web UI layers only (`pageObjects`, `Test`, `BaseLib`, `seleniumUtils`, `utils`). API is mentioned in intro but not structurally defined. Scaffolded `PrismStructure/` with Playwright `projects` separating `tests/ui/` and `tests/api/`, plus `pageObjects/` vs `apiClients/`.

**Validation Notes:**
Prism Java blog uses ExtentReports + TestNG XML; Playwright equivalent uses HTML reporter + config projects. No API folder pattern exists in source blog — separation is project-defined.

---

## Q6 Answer (from blog + Playwright adaptation)

### What the blog defines (UI only)

| Package | Role |
|---------|------|
| `BaseLib` / `BrowserFactory` / `ExtentManager` | Setup, driver, reporting |
| `pageObjects` (`*Page.java`) | UI business logic |
| `Test` (`*Test.java`) | Test scripts extending BaseLib |
| `seleniumUtils` | SeleniumHelper — click, type, scroll |
| `utils` | DataProviderSource, CSV/Excel/property readers |
| `testng.xml` | Test execution / parallel |

### What the blog does NOT define

- **No API test folder**, API client package, or API-specific config is shown.
- Intro line: Prism covers "web, mobile, and APIs" — API structure is **not documented in this article**.

### What we implemented in `PrismStructure/`

| Separation | UI | API |
|------------|----|----|
| Tests | `tests/ui/*.spec.js` | `tests/api/*.spec.js` |
| Logic | `pageObjects/*Page.js` | `apiClients/*Api.js` |
| Config | Playwright project `ui-chromium` | Playwright project `api-tests` |
| Browser | Required | Not required (`request` only) |
| Reports | Shared `reports/html/` | Shared `reports/html/` |

**Config file:** Single `playwright.config.js` with two `projects` entries (not TestNG XML). Optional split configs noted in README for future use.

**Debugging Outcome:** Blog is Java/Selenium-specific; assessment requires Playwright JS — structural principles (page objects, base lib, utils, separated test packages) mapped, not copied verbatim.

---

## Entry 2: MVP Playwright Scaffold — Toolshop

**Prompt:**
> Scaffold minimum viable Playwright JS structure mirroring Prism conventions: page objects, API clients, test-data, .env, config with HTML reporter, tags, 30s timeout, npm scripts.

**AI Response Summary:**
Created full PrismStructure MVP: 6 page objects, 4 API clients + ApiHelper, DataProvider, env utils, sample specs, playwright.config.js, package.json.

**Validation Notes:**
API endpoint paths and UI locators are best-effort; must be verified against live app and Swagger docs before execution.
