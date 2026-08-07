# Execution Evidence — Full Suite

| Field | Value |
|-------|--------|
| **Command** | `npm run test:all` (from `PrismStructure/`) |
| **Date** | 6 August 2026 |
| **Result** | **13 passed**, 0 failed |
| **Duration** | ~40s |
| **Workers** | 8 parallel |

## UI (7 tests) — all Passed

| Spec | Test | Tags |
|------|------|------|
| `auth-login-invalid.spec.js` | rejects login with wrong password | @regression |
| `auth-register.spec.js` | registers, logs in, shows account name | @smoke |
| `cart-remove-item.spec.js` | removes line item; blocks empty checkout | @regression |
| `home.spec.js` | loads home page | @smoke |
| `home.spec.js` | search returns results | @regression |
| `purchase-journey.spec.js` | end-to-end COD purchase + invoice | @smoke @regression |
| `search-no-results.spec.js` | empty state for invalid keyword | @regression |

## API (6 tests) — all Passed

| Spec | Test | Tags |
|------|------|------|
| `api-negative.spec.js` | wrong password login | @regression |
| `api-negative.spec.js` | malformed bearer token | @regression |
| `api-negative.spec.js` | missing billing field | @regression |
| `auth.spec.js` | login returns access token | @smoke |
| `order-lifecycle.spec.js` | register → cart smoke | @smoke |
| `order-lifecycle.spec.js` | full lifecycle through invoice | @regression |

## Artifacts in this folder

- `full-suite-run.log` — terminal output from the passing run
- `results.json` — Playwright JSON reporter output (all `status: passed`)
- `execution-report.html` — human-readable summary (open in browser)
- `test-run-summary.png` — screenshot of the HTML summary
- `automation-ui-run.webm` — headed UI run recording (all UI specs, sequential)
- `videos/` — per-spec `.webm` clips from the latest recording

Record locally:

```bash
cd PrismStructure
npm run test:ui:record
npm run evidence:collect-videos
```
