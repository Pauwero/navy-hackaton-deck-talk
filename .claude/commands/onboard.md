---
name: onboard
description: Start or continue a company onboarding session
---

# /onboard — Company Onboarding Command

Invoke the onboarding-agent to guide a company through profile creation on the
Naval Innovation Hub platform.

## Usage

```
/onboard "Company Name or description"
/onboard --from-document <path-to-file>
/onboard --review <pipeline-id>
```

## What happens

1. The onboarding-agent activates with the `data-standards` skill loaded
2. Input is classified as STRUCTURED (form data) or UNSTRUCTURED (documents/free text)
3. Data is validated against defense data standards
4. Clarifying questions are generated for gaps and ambiguities
5. Interactive Q&A session refines the profile
6. Final profile is scored and submitted to the platform

## Pipeline Steps

| Step | Agent | Description |
|------|-------|-------------|
| 1 | onboarding-agent | Parse input & initial validation |
| 2 | onboarding-agent | Generate clarifying questions |
| 3 | onboarding-agent | Process answers & re-validate |
| 4 | onboarding-agent | Final scoring & approval |

## Output

- Validated company profile (JSON)
- Quality score with breakdown
- Pipeline run record in `.claude/pipeline/runs/`
