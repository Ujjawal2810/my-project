# AI Prompts – Requirements and Planning

## Entry 1: Assessment Onboarding — Mandatory Deliverables Extraction

**Prompt:**
> You are a senior QA engineer onboarding to a new assessment.
> Document attached: QA AI Capability Exercise — Participant Guide.
> Your job:
> - List every deliverable that MUST be submitted (no maybes)
> - Pull out UI acceptance criteria and API acceptance criteria separately
> - Note the hard limit on test count per type
> - List the exact tools and framework mandated
> - Draw the required folder/file tree
> - Flag any instruction that contradicts another, or is vague enough to cause confusion
> Format as numbered sections. No code yet.

**AI Response Summary:**
Structured extraction of all mandatory deliverables, acceptance criteria, limits, tools, folder tree, and conflicting/vague instructions from the Participant Guide.

**Validation Notes:**
Cross-checked against `QA Practical Assessment.pdf` pages 1–15. Numbering gaps in source doc (items 5, 9 missing in Common QA Requirements) noted as source ambiguity, not omission.

---

## 1. Mandatory Deliverables (No Maybes)

### Part A — AI Workflow Foundation (30%)

1. **`project-info.md`** — must cover all 11 topics:
   - What the project is about
   - Primary AI tool(s) used
   - How project/SUT context is provided to AI
   - How AI is used for requirement analysis
   - How AI is used for test planning and strategy (UI vs API, smoke vs regression)
   - How AI is used for manual test case design (functional, edge, negative, non-functional)
   - How AI is used for automation design (framework, structure, data, utilities)
   - How AI-generated test cases and scripts are validated and refined
   - How AI is used for test data generation, environment assumptions, and API payloads
   - How AI is used for debugging failing tests and interpreting logs
   - What information is avoided sharing with AI tools
   - How this QA workflow would be reused in a real project

   **Also required inside `project-info.md` (template fields):**
   - Primary AI Tool(s) Used
   - Application Under Test
   - Assessment Start Date / Submission Date
   - Project Summary (1–3 sentences)
   - Tools Used (browsers, automation, API, AI, utilities)
   - Setup Summary (items 1–10 above, repeated in template)

### Part B — QA Mini Project (70%)

2. **Requirement and risk analysis** — specific to PracticeSoftwareTesting application
3. **`FunctionalTestCase` file (.csv)** — manual/functional test suite for key flows
4. **UI automation tier** — Playwright, covering smoke AND E2E/regression flows
5. **API automation tier** — Playwright, covering core lifecycle APIs
6. **`PrismStructure` folder** — Playwright framework for API + UI + execution reports
7. **Test data strategy** — documented (design/generation approach, including AI)
8. **Evidence of test execution** — logs, reports, screenshots, or API collections
9. **`readme.md`** — setup, execution instructions, smoke/regression commands, report locations, test data location
10. **Full prompt history** in `ai-prompts/` folder (5 files — see Section 5)
11. **Execution reports** — all test case statuses must be **Passed**
12. **Public git repository URL** — submitted for review
13. **Iterative git commits** — not a single commit
14. **`.cursor/` configuration** (Rules; Skills; agent/mcp optional)
15. **All lifecycle artifacts** — planning, design, testing, debugging, review, reflection in clear repo structure

### Core Acceptance Criteria Evidence (must demonstrate)

16. Clear test objectives and scope derived from application
17. Traceable mapping: requirements/state machine → test scenarios → test cases
18. Valid and invalid status transitions covered (manual + API automation)
19. UI tests: create, list, view, update, comment, search, error handling
20. API tests: create, list, view, update, comment, search, error handling
21. Well-planned test data (priorities, statuses, edge cases)
22. At least one automation suite runnable from README (beyond env setup)
23. Prompt history showing thoughtful AI use (not unreviewed copy-paste)

---

## 2. UI Acceptance Criteria

**System Under Test:** https://practicesoftwaretesting.com/

**Stated example ACs (must use AC-style format):**

| ID | Acceptance Criteria |
|----|---------------------|
| **AC1** | User Registration & Login — User can register with valid details, log in with registered credentials, and verify profile information successfully. |
| **AC2** | End-to-End Purchase Flow — User can browse products, add multiple items to cart (including updating quantity), complete checkout using Cash on Delivery, and view the generated invoice under My Invoices. |

**UI-specific behavioral rules from guide:**
- Include all possible testable ecommerce flows; categorize as **sanity** or **regression**
- **Press Confirm twice** to generate invoice (application quirk — must be reflected in tests)
- **Press Confirm button twice** for Invoice ID generation

**Core QA perspective — UI flows that must be verified:**
- Create, list, view, update, comment, search, error handling

---

## 3. API Acceptance Criteria

**System Under Test:** https://api.practicesoftwaretesting.com/api/documentation

**Stated example ACs:**

| ID | Acceptance Criteria |
|----|---------------------|
| **AC1** | User Authentication & Cart Creation — New user registers via API, logs in, obtains valid bearer token, creates new cart successfully. |
| **AC2** | Product Selection & Invoice Generation — Using bearer token: retrieve products, add to cart, verify cart contents, generate invoice with required customer and order details. |

**Example invoice POST body (reference payload):**
```json
{
  "billing_street": "Zoey Shore",
  "billing_city": "Hesselbury",
  "billing_state": "Florida",
  "billing_country": "TG",
  "billing_postal_code": "1234AA",
  "payment_method": "cash-on-delivery",
  "cart_id": "01kx0dctdxxg6sm4wtt1t0nf9r",
  "payment_details": {}
}
```

**Core QA perspective — API flows that must be verified:**
- Create, list, view, update, comment, search, error handling

---

## 4. Hard Limit on Test Count

> **"There should not be more than 5–8 test cases of each type (manual + UI + API) which includes @Smoke, @regression"**

| Test Type | Min | Max | Tags Required |
|-----------|-----|-----|---------------|
| Manual (FunctionalTestCase.csv) | 5 | 8 | @Smoke, @Regression |
| UI automation | 5 | 8 | @Smoke, @Regression |
| API automation | 5 | 8 | @Smoke, @Regression |

**Total ceiling:** up to 24 test cases across all three tiers (8 each), all must show **Passed** in execution reports.

---

## 5. Mandated Tools and Framework

| Category | Mandated |
|----------|----------|
| **Automation framework** | Playwright |
| **Internal framework pattern** | Prism Framework |
| **AI IDE** | Cursor AI |
| **PrismStructure stack** | Playwright (for API + UI + execution reports) |
| **AI token budget** | Must stay within Cursor monthly limit |
| **Version control** | Public git repository |
| **`.cursor/` tooling** | Rules (required); Skills (required); agent/mcp (optional) |

**Explicitly NOT mandated** (listed as examples only): Selenium, Cypress, REST Assured, Postman, Karate — guide says "e.g." for automation tier but Tool-Specific Expectations locks to **Playwright (Prism Framework) and Cursor**.

**Model guidance (Quick Tips — operational, not graded):**
- Auto / Composer 2.5 for planning, docs, CSV (~70% of work)
- Sonnet 4.6 for automation code and hard debugging

---

## 6. Required Folder / File Tree

```
qa-ai-practical-assessment/          # (repo root — name illustrative; your repo: my-project)
├── FunctionalTestCase.csv           # manual test suite
├── PrismStructure/                  # Playwright API + UI + execution reports
│   └── (framework code, specs, reports)
├── project-info.md
├── readme.md
├── ai-prompts/
│   ├── requirements-and-planning.md
│   ├── test-design.md
│   ├── test-data.md                  # listed in AI Prompts section (missing from tree on p.8)
│   ├── automation-and-debugging.md
│   └── documentation-and-summary.md
├── .cursor/
│   ├── rules/                        # Rules
│   └── skills/                       # Skills
│   └── (agent/mcp — optional)
└── QA Practical Assessment.pdf       # source doc (optional, not listed as deliverable)
```

**Execution evidence** (logs, screenshots, reports) — location not specified; must exist somewhere in repo (likely inside `PrismStructure/` or a dedicated `execution-evidence/` folder).

---

## 7. Contradictions, Ambiguities, and Confusion Flags

### Contradictions

| # | Conflict | Details |
|---|----------|---------|
| C1 | **Repo structure tree vs ai-prompts file list** | Page 8 tree shows 4 files under `ai-prompts/` (no `test-data.md`). Pages 10–11 mandate **5 files** including `test-data.md`. **Resolution:** include all 5 files. |
| C2 | **PrismStructure tooling** | Tree says `PrismStructure(Playwright/Selenium For API+UI+ Execution Report)` but Tool-Specific Expectations says **Playwright (Prism Framework) only**. Selenium should be ignored. |
| C3 | **Sanity vs Smoke terminology** | Part B SUT says categorize as **"sanity or regression"**; everywhere else uses **@Smoke / @Regression**. Treat sanity = smoke unless evaluator clarifies. |
| C4 | **"All possible flows" vs 5–8 test limit** | Guide says include all possible ecommerce flows but caps each type at 5–8 cases. **Resolution:** prioritize highest-risk flows; document scope trade-off in project-info.md. |
| C5 | **Core AC flows vs SUT example ACs** | Core AC lists create/list/view/update/**comment**/search/error for UI and API. PracticeSoftwareTesting ecommerce app may not have a literal "comment" feature. Unclear if this is boilerplate from another project or a required flow to find. |
| C6 | **Part count** | Section 5 table says "three parts" but only Part A and Part B are defined. Third part is unnamed/missing. |
| C7 | **Numbering in Common QA Requirements** | Items jump 4→6, 8→10, 11→12 (missing 5 and 9). Likely editorial error in source PDF. |

### Vague / Underspecified Instructions

| # | Issue | Risk |
|---|-------|------|
| V1 | **"Stretch" vs "Core"** | Stretch goals mentioned but never defined; only Core AC listed. |
| V2 | **Requirement and risk analysis format** | Mandatory deliverable with no file name or template specified. |
| V3 | **FunctionalTestCase.csv schema** | No column definitions provided. |
| V4 | **Prism Framework** | Referenced but no repo URL, version, or setup doc in guide. Must be sourced externally. |
| V5 | **Execution report format** | Must exist and show Passed — format/location/tool not specified. |
| V6 | **"Valid and invalid status transitions"** | Sounds like state-machine testing; ecommerce SUT may not map cleanly. |
| V7 | **project-info.md duplicate numbering** | Part A lists items 1, 2, 2, 3… (two item 2s). Content is clear; numbering is broken. |
| V8 | **readme.md vs readme.md casing** | Tree shows `readme.md` (lowercase); common convention is `README.md`. Follow tree literally unless evaluator says otherwise. |
| V9 | **Iterative development** | Required for git and prompting but no minimum commit count defined. |
| V10 | **Public git URL submission** | Must share URL but no submission channel named (email, portal, etc.). |

---

## 8. Quick Reference — Submission Checklist

- [ ] `project-info.md` (all 11 AI workflow topics + template fields)
- [ ] `readme.md` (framework, run commands, smoke/regression, reports, test data)
- [ ] `FunctionalTestCase.csv` (5–8 manual cases, @Smoke/@Regression)
- [ ] `PrismStructure/` — UI automation (5–8 cases, smoke + regression)
- [ ] `PrismStructure/` — API automation (5–8 cases, core lifecycle)
- [ ] Execution reports — all **Passed**
- [ ] Test data strategy documented
- [ ] Requirement and risk analysis
- [ ] `ai-prompts/` — all 5 markdown files with prompt history
- [ ] `.cursor/` — Rules + Skills
- [ ] Public git repo with iterative commits
- [ ] Public URL shared with evaluator
