# AI Prompts – Documentation and Summary

## Entry 1: Assessment project-info.md

**Prompt I sent:**
> Write project-info.md for the Toolshop QA assessment submission. Reflect ONLY work that exists in the repository. Sections: summary, URLs, tools, scope, AI usage per phase, validation, sensitive data policy, real-project paragraph.

**What AI returned:**
Draft `project-info.md` with test counts, tool versions, in/out scope, honest gaps (empty CSV status, login flake, missing `.cursor/`), and AI examples per phase.

**What I validated:**
Cross-checked every count against `git ls-files` and `package.json`. Committed as `1387f55`.

**What I changed and why:**
Edited for first-person tone and removed any coverage claims not backed by files. Updated after subsequent fixes (this submission pass).

---

## Entry 2: Root readme.md / README

**Prompt I sent:**
> Write README from actual repository content. Prerequisites, install, .env template with placeholders, test commands table cross-checked to package.json, reports, structure, double-confirm quirk, troubleshooting.

**What AI returned:**
Root `README.md` with verified npm scripts, Node/Playwright versions, placeholder `.env` block, and troubleshooting from real `ui-run.log` failure.

**What I validated:**
Compared each command to `PrismStructure/package.json` lines 6–12. Renamed to `readme.md` to match assessment folder tree.

**What I changed and why:**
Replaced `.env.example` literal passwords in README template with `<your-demo-password>`. Renamed file to lowercase `readme.md` per participant guide tree.

---

## Entry 3: Evaluator Audit Remediation

**Prompt I sent:**
> Audit repository as evaluator; mark pass/fail on folder structure, CSV, test counts, assertions, traceability, execution evidence, ai-prompts (5 files), credentials, git history. Fix all failures.

**What AI returned:**
Checklist with 6 pass, 2 needs evidence, 5 fail — including missing `test-data.md`, `documentation-and-summary.md`, `.cursor/rules`, empty CSV Status, UI test failure in `ui-run.log`, passwords in committed files.

**What I validated:**
Re-read `git ls-files`, `FunctionalTestCase.csv`, and `PrismStructure/reports/ui-run.log` before applying fixes.

**What I changed and why:**
- Added `.cursor/rules/toolshop-qa.mdc`, `ai-prompts/test-data.md`, this file.
- Fixed `LoginPage.goto` (`domcontentloaded`), strengthened `auth.spec.js`, AC headers in specs, traceability table in `project-info.md`.
- Filled CSV `ActualResult`/`Status`; redacted `.env.example` passwords.
- Re-ran full suite and refreshed `PrismStructure/reports/`.

---

## Submission Summary (current repository state)

| Deliverable | Location | Status |
|-------------|----------|--------|
| Manual tests (8) | `FunctionalTestCase.csv` | Complete with execution status |
| UI automation (7) | `PrismStructure/tests/ui/` | @smoke + @regression |
| API automation (6) | `PrismStructure/tests/api/` | @smoke + @regression |
| Framework | `PrismStructure/` | Prism-style Playwright JS |
| Project info | `project-info.md` | Complete |
| Setup guide | `readme.md` | Complete |
| AI prompt history | `ai-prompts/` (5 files) | Complete |
| Cursor rules | `.cursor/rules/` | Present |
| Execution evidence | `PrismStructure/reports/` | Logs + JSON + HTML |

**Known residual risk:** UI tests may be sensitive to parallel workers on slow networks; use `--workers=1` if `purchase-journey` flakes on login.
