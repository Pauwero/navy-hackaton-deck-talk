---
name: challenge-standards
description: >
  Data standards specific to naval/defense challenge specifications. Defines
  operational context requirements, requirement structuring rules, priority
  frameworks, and validation criteria for challenge submissions. Different
  from company data standards — focused on operational needs rather than
  capability descriptions.
---

# Naval Innovation Hub — Challenge Data Standards v1.0

## 1. Operational Domain Taxonomy

Challenges must be classified into an operational domain (different from company
defense domains — these describe WHERE the problem occurs, not WHAT technology solves it):

| Code | Domain | Description | Example Scenarios |
|------|--------|-------------|-------------------|
| SRF | Surface Warfare | Surface vessel operations, anti-surface warfare, naval gunfire | Threat detection on patrol, fleet coordination |
| SUB | Submarine Operations | Submarine warfare, underwater communications, stealth | Covert surveillance, torpedo defense |
| MCM | Mine Countermeasures | Mine detection, classification, neutralization, route survey | Harbor clearance, sea lane reopening |
| AMP | Amphibious Operations | Ship-to-shore, beach landing, littoral operations | Beach reconnaissance, landing craft ops |
| MAS | Maritime Security | Port security, maritime law enforcement, VBSS, piracy | Harbor patrol, vessel boarding, smuggling detection |
| LOG | Naval Logistics | Supply chain, replenishment at sea, fleet sustainment | RAS operations, spare parts prediction |
| HYD | Hydrography & Oceanography | Charting, ocean survey, environmental monitoring | Depth survey, current mapping, ice detection |
| C2 | Command & Control | Tactical decision-making, COP, battle management | Tactical picture, decision support |
| ISR | Intelligence, Surveillance & Recon | SIGINT, IMINT, OSINT, persistent surveillance | Pattern of life analysis, early warning |
| CYB | Cyber Operations | Network defense, offensive cyber, resilience | Shipboard network protection, incident response |
| TRN | Training & Readiness | Simulation, exercises, crew qualification | Bridge simulator, damage control training |
| MNT | Maintenance & Sustainment | Predictive maintenance, repair, fleet readiness | Equipment failure prediction, condition monitoring |

## 2. Challenge Classification Framework

### Capability Gap Types
- **OPERATIONAL** — Current operations cannot be performed effectively
- **EFFICIENCY** — Operations work but are too slow, costly, or resource-intensive
- **SAFETY** — Current methods pose risks to personnel or equipment
- **EMERGING_THREAT** — New threat requires new countermeasure capability
- **INTEROPERABILITY** — Systems don't work together (allied, joint, or internal)
- **OBSOLESCENCE** — Existing systems reaching end-of-life with no replacement

### Priority Definitions

| Level | Definition | Response Expectation |
|-------|------------|---------------------|
| Critical | Directly impacts safety of life or mission success in active operations | Immediate — solutions needed within 6 months |
| High | Significant operational capability gap affecting readiness | Urgent — solutions needed within 12 months |
| Medium | Meaningful improvement to operational effectiveness | Standard — solutions within 1-3 years |
| Low | Enhancement or efficiency improvement, not mission-critical | Exploratory — solutions within 3-5 years |

### Priority Justification Rules
- **Critical** requires: specific operational impact statement + named affected platform/unit type
- **High** requires: capability gap description + measurable impact (time, cost, readiness %)
- **Medium** requires: general operational benefit description
- **Low** requires: basic description of desired improvement

## 3. Requirement Specification Standards

### Requirement Categories

Every challenge MUST have at least one requirement from each of the first three categories:

#### Functional Requirements (What must it DO?)
Format: "The solution SHALL [verb] [object] [condition]"
- GOOD: "The solution shall detect underwater objects larger than 0.5m within a 500m radius"
- BAD: "The solution should improve detection" (no specifics)

#### Performance Requirements (How WELL must it do it?)
Format: "The solution SHALL achieve [metric] of [value] under [conditions]"
- GOOD: "The solution shall achieve a detection probability of >90% in sea state 3 or below"
- BAD: "The solution should work reliably" (no metric)

#### Environmental Requirements (What CONDITIONS must it work in?)
Format: "The solution SHALL operate in [environment] with [constraints]"
- GOOD: "The solution shall operate in sea states 0-5, at temperatures from -10°C to +45°C"
- BAD: "The solution should work at sea" (insufficient)

#### Integration Requirements (What must it CONNECT to?)
Format: "The solution SHALL interface with [system/standard] via [protocol]"
- GOOD: "The solution shall provide data output compatible with NATO STANAG 4586 for UAS interoperability"
- BAD: "Must integrate with existing systems" (which systems?)

#### Operational Requirements (How must it FIT into operations?)
Format: "The solution SHALL be [deployable/operable] by [user] within [constraint]"
- GOOD: "The solution shall be deployable by a 2-person team within 30 minutes without special tools"
- BAD: "Easy to use" (subjective, unmeasurable)

### Requirement Quality Checks
- Each requirement should have ONE clear "shall" statement
- Avoid combining multiple requirements in one statement
- Avoid subjective terms: "easy", "fast", "reliable", "intuitive", "robust"
- Include measurable thresholds where possible
- Flag classified technical parameters — generalize for UNCLASSIFIED context

## 4. Challenge Field Specifications

### Critical Fields (Required)

| Field | Type | Constraints | Validation |
|-------|------|-------------|------------|
| title | string | 10-150 chars | Clear, descriptive, starts with action verb or capability noun |
| domain | enum | from operational domain taxonomy | Must match approved codes |
| gap_type | enum | from capability gap types | Drives matching priority |
| description | string | 100-2000 chars | Must describe the problem, not prescribe the solution |
| operational_context | string | 50-1000 chars | Real operational scenario where gap occurs |
| requirements | string[] | 3-15 items | At least 1 functional, 1 performance, 1 environmental |
| desired_trl | integer | 1-9 | Must align with timeline |
| timeline | enum | quick-win / short-term / medium-term / long-term | Must align with TRL |
| priority | enum | critical / high / medium / low | With justification |
| priority_justification | string | 30-500 chars | Why this priority level |
| classification | enum | unclassified / restricted | Content classification marking |
| tags | string[] | 2-10 items | For discoverability |

### Quality Fields (Recommended)

| Field | Type | Constraints | Validation |
|-------|------|-------------|------------|
| current_workaround | string | 30-500 chars | How the need is handled today |
| impact_description | string | 30-500 chars | What happens if unsolved |
| affected_platforms | string[] | 1-10 items | Ship classes, unit types affected |
| user_profile | string | 20-200 chars | Who will operate the solution |
| environment_conditions | string | 30-300 chars | Operational environment details |
| budget_indication | enum | <100K / 100K-500K / 500K-1M / 1M-5M / >5M | Indicative budget range |
| success_criteria | string[] | 1-5 items | How success will be measured |
| constraints | string[] | 0-10 items | Technical/operational constraints |
| related_challenges | string[] | 0-5 items | IDs of related challenges |
| stakeholder_unit | string | 5-100 chars | Sponsoring unit/command |

## 5. TRL-Timeline Alignment Matrix

| Timeline | Expected TRL Range | Rationale |
|----------|--------------------|-----------|
| Quick win (0-6 months) | TRL 7-9 | Need proven, deployable solutions |
| Short-term (6-18 months) | TRL 5-7 | Demonstrated tech, needs naval integration |
| Medium-term (1-3 years) | TRL 3-6 | Proven concept, needs development for naval use |
| Long-term (3+ years) | TRL 1-4 | Research and early development |

### Misalignment Rules
- TRL 1-3 with "quick-win" timeline → ERROR: "Research-phase technology cannot be deployed in 6 months"
- TRL 8-9 with "long-term" timeline → WARNING: "If proven technology exists, consider shorter timeline"
- Critical priority with TRL 1-3 → WARNING: "Critical needs typically require higher TRL solutions"
- Low priority with "quick-win" → WARNING: "Quick-win implies urgency; reconsider priority"

## 6. Operational Context Quality Criteria

### Excellent Context (90-100 score)
- Names the specific operation type or scenario
- Describes the sequence of events where the gap appears
- Mentions the current workaround and its limitations
- Includes environmental conditions
- References affected platform types or unit roles

### Good Context (75-89 score)
- Describes the general operational situation
- Explains when the problem occurs
- Mentions some environmental or platform details

### Acceptable Context (60-74 score)
- Basic description of the problem domain
- Some operational relevance but vague
- Missing specifics about when/where/who

### Poor Context (< 60 score)
- Generic problem statement without operational grounding
- Could apply to any domain (not naval-specific)
- No mention of current workaround or impact

## 7. Content Red Flags

- **Solution Prescriptive:** "We need a drone that..." instead of describing the capability gap
- **Classified Indicators:** Specific system designations, performance parameters of classified systems, intelligence sources
- **Too Broad:** "Improve maritime domain awareness" (this is a program, not a challenge)
- **Too Narrow:** "Build an adapter for connector type X on system Y" (this is a procurement, not innovation)
- **Missing Operational Link:** Technology request without explaining the operational need
- **Unrealistic Expectations:** TRL 1 to deployment in 3 months

## 8. Scoring Algorithm

```
quality_score = (
  critical_completeness * 0.45 +       // All required fields present and valid
  requirement_quality * 0.25 +          // Requirements are specific and measurable
  operational_context_quality * 0.20 +  // Context is detailed and realistic
  consistency_check * 0.10              // TRL/timeline/priority alignment
) * 100
```

### Score Thresholds
- **>= 85:** APPROVED — Challenge is well-structured and matchable
- **75-84:** APPROVED_WITH_SUGGESTIONS — Good challenge, minor improvements possible
- **60-74:** NEEDS_IMPROVEMENT — Key gaps reduce match quality
- **< 60:** NEEDS_REVISION — Critical gaps prevent meaningful matching
