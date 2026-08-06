# PrismStructure — Playwright JavaScript (Prism Pattern)

Adapted from the [TO THE NEW Prism framework blog](https://www.tothenew.com/blog/exploring-prism-web-automation-testing-framework-on-java-selenium/) (Java + Selenium + TestNG). This project uses **Playwright JS** per assessment requirements while preserving Prism naming and layering conventions.

---

## Folder Layout

```
PrismStructure/
├── base/                   # BaseLib, BrowserFactory equivalents (setup/teardown)
├── pageObjects/            # UI business logic only — classes end with *Page.js
├── apiClients/             # API business logic — classes end with *Api.js
├── seleniumUtils/          # Web interaction helpers (PlaywrightHelper.js)
├── utils/                  # Shared: CSV reader, env reader, data providers, screenshots
├── fixtures/               # Playwright custom fixtures (test-scoped setup)
├── test-data/              # JSON/CSV test inputs
├── tests/
│   ├── ui/                 # UI specs — files end with *.spec.js
│   └── api/                # API specs — files end with *.spec.js
├── reports/                # HTML / JSON execution output (gitignored at runtime)
├── playwright.config.js    # Root config — `projects` separate UI vs API
├── playwright.ui.config.js # Optional UI-only overrides (viewport, baseURL)
├── playwright.api.config.js# Optional API-only overrides (baseURL, extraHTTPHeaders)
└── package.json
```

---

## Q6 — How UI and API Tests Are Separated

### What the Prism blog explicitly describes (web / UI only)

The [Prism Java-Selenium blog](https://www.tothenew.com/blog/exploring-prism-web-automation-testing-framework-on-java-selenium/) documents **web UI automation only**:

| Layer | Java-Selenium Prism | Purpose |
|-------|---------------------|---------|
| **Base Package** | `BaseLib`, `BrowserFactory`, `ExtentManager` | Driver lifecycle, suite/method hooks, reporting init |
| **pageObjects** | `*Page.java` | Reusable UI business logic (not raw clicks in tests) |
| **Test** | `*Test.java` extending `BaseLib` | Test scripts that call page object methods and assert |
| **seleniumUtils** | `SeleniumHelper`, `CommonUtility` | Low-level web actions with logging |
| **utils** | `DataProviderSource`, CSV/Excel/property readers | Test data injection |
| **Execution** | `testng.xml`, `pom.xml` (surefire) | Run UI tests, parallel config, ReportPortal |

The blog introduction states Prism supports **"web, mobile, and APIs"**, but **this article does not show API folder structure, API client classes, or a separate API config file**. That is a gap in the source material.

### How this project separates UI and API (Playwright + Prism pattern)

Because the blog does not define API layout, this repo applies Prism's **layering principle** with explicit physical separation:

| Concern | UI | API |
|---------|----|-----|
| **Test location** | `tests/ui/*.spec.js` | `tests/api/*.spec.js` |
| **Business logic** | `pageObjects/*Page.js` | `apiClients/*Api.js` |
| **Low-level helpers** | `seleniumUtils/PlaywrightHelper.js` | `apiClients/ApiHelper.js` (request wrapper + logging) |
| **Browser required** | Yes (`BrowserFactory` / Playwright `page`) | No (`request` fixture only) |
| **Config** | `playwright.config.js` → project `ui-chromium` | Same file → project `api-tests` with `testDir: tests/api` |
| **Optional split config** | `playwright.ui.config.js` | `playwright.api.config.js` |
| **Reporting** | Shared HTML reporter → `reports/html/` | Same reporter output (combined or per-project) |
| **Test data** | Shared `utils/DataProvider.js` reading `test-data/` + `FunctionalTestCase.csv` | Same utils; API payloads in `test-data/api/` |

**Config mechanism:** Playwright **`projects`** array in `playwright.config.js` — not separate repos, not TestNG XML. UI project sets `testDir: './tests/ui'` and launches a browser; API project sets `testDir: './tests/api'` and uses `request` without browser launch.

**Run commands (planned):**

```bash
npx playwright test --project=ui-chromium          # UI only
npx playwright test --project=api-tests            # API only
npx playwright test --grep @smoke                  # Tagged subset (UI + API)
```

### Tagging (cross-cutting UI + API)

Tags use Playwright **`tag` annotation** in spec files (e.g. `tag: ['@smoke']`), filtered via `--grep @smoke` / `--grep @regression` in config or CLI. Defined in `playwright.config.js` under each project.

---

## Related Answers (from Prism blog + Playwright mapping)

| # | Topic | Source | This project |
|---|-------|--------|--------------|
| 1 | Page objects | `pageObjects/*Page.java` | `pageObjects/*Page.js` |
| 2 | Fixtures / setup | `BaseLib` TestNG hooks (`@BeforeMethod`, etc.) | `base/BaseTest.js` + `fixtures/customFixtures.js` |
| 3 | Test data | `utils/DataProviderSource`, Excel/CSV/property readers | `utils/DataProvider.js`, `test-data/`, `.env` for secrets |
| 4 | Tags | TestNG `testng.xml` groups / priority | Playwright `tag` + `--grep` |
| 5 | HTML report | ExtentReports via `ExtentManager` | Playwright `html` reporter → `reports/html/` |

---

## Status

**Scaffold only** — folder structure and conventions documented. Test specs, page objects, and configs to be implemented in subsequent prompts.
