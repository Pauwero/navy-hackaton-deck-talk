---
name: data-standards
description: >
  Defense-grade data standards for the Naval Innovation Hub platform. Defines
  required fields, taxonomies, validation rules, and quality criteria for all
  entity profiles. Used by the onboarding agent to validate and standardize
  company submissions.
---

# Naval Innovation Hub — Data Standards v1.0

## 1. Defense Domain Taxonomy

All entities must be classified into one or more approved defense domains:

| Code | Domain | Description |
|------|--------|-------------|
| MAR | Maritime Systems | Surface vessels, submarines, underwater systems, port infrastructure |
| CYB | Cyber & IT | Cybersecurity, network defense, secure communications, IT infrastructure |
| AUT | Autonomous Systems | UAS, USV, UUV, autonomous navigation, swarm systems, robotics |
| SEW | Sensing & EW | Sensors, radar, sonar, electronic warfare, signal processing |
| WPN | Weapons & Protection | Weapons systems, armor, CBRN protection, countermeasures |
| LOG | Logistics & Sustainment | Supply chain, predictive maintenance, fleet readiness, sustainment |
| C4I | C4ISR | Command, control, communications, computers, intelligence, surveillance, reconnaissance |
| SPC | Space & Satellite | Satellite communications, space situational awareness, PNT |
| ENR | Energy & Propulsion | Alternative energy, propulsion systems, power management |
| HFI | Human Factors & Training | Training systems, simulation, human-machine interface, crew optimization |

## 2. Capability Categories

Capabilities must be mapped to standardized categories for AI matching:

### Technical Capabilities
- Autonomous Navigation & Control
- Sensor Integration & Fusion
- Data Analytics & AI/ML
- Cybersecurity & Network Defense
- Signal Processing & Communications
- Robotics & Mechatronics
- Software Development & Integration
- Systems Engineering
- Simulation & Modeling
- Edge Computing & IoT

### Operational Capabilities
- Maritime Domain Awareness
- Underwater Operations
- Mine Countermeasures
- Port & Harbor Security
- Anti-Submarine Warfare
- Surface Warfare Systems
- Logistics Optimization
- Predictive Maintenance
- Training & Simulation
- Intelligence Analysis

### Cross-Cutting Capabilities
- Rapid Prototyping
- Technology Transfer
- Dual-Use Technology Development
- International Collaboration
- Certification & Compliance
- Program Management
- Test & Evaluation
- Integration & Interoperability

## 3. Technology Readiness Levels (Defense Context)

| TRL | Title | Defense Interpretation | Evidence Required |
|-----|-------|----------------------|-------------------|
| 1 | Basic Principles | Fundamental research published, no defense application identified | Published papers or patents |
| 2 | Technology Concept | Defense application conceptualized, feasibility assessed | Concept paper, feasibility study |
| 3 | Proof of Concept | Laboratory demonstration of key defense-relevant functions | Lab reports, demo videos |
| 4 | Lab Validation | Component tested in laboratory with defense-representative conditions | Test reports, validated models |
| 5 | Relevant Environment | Component tested in simulated defense environment | Test results from simulated ops |
| 6 | Demo in Relevant Env | System prototype demonstrated in defense-relevant environment | Demo reports, stakeholder reviews |
| 7 | Demo in Operational Env | System prototype demonstrated in actual operational environment | Operational test reports |
| 8 | System Complete | System qualified through test and demonstration in operational env | Qualification test reports |
| 9 | Proven in Operations | System proven through successful mission operations | Deployment records, after-action reviews |

### TRL Validation Rules
- TRL 1-3: No evidence of operational testing required
- TRL 4-5: Must describe testing conditions and results
- TRL 6-7: Must specify the relevant/operational environment
- TRL 8-9: Must provide reference to actual deployment or qualification program
- Claims of TRL 6+ without defense customer references trigger a WARNING
- Claims of TRL 8+ without named program/contract trigger an ERROR

## 4. Company Profile Field Specifications

### Critical Fields (Required)

| Field | Type | Constraints | Validation |
|-------|------|-------------|------------|
| name | string | 2-200 chars | Must be legal entity name |
| defense_domain | enum[] | 1-3 from taxonomy | Must match approved codes |
| sector | string | 2-100 chars | Industry classification |
| description | string | 100-2000 chars | Must include: what you do, for whom, value proposition |
| capabilities | string[] | 3-15 items | Should map to capability categories |
| technologies | string[] | 2-20 items | Specific technology names |
| trl_level | integer | 1-9 | Must be consistent with description |
| contact_email | string | valid email | Must be corporate email (warning for generic providers) |

### Quality Fields (Recommended)

| Field | Type | Constraints | Validation |
|-------|------|-------------|------------|
| cage_code | string | 5 chars (CAGE) or alphanumeric (NCAGE) | Format validation only |
| nato_entity_code | string | alphanumeric | Format validation only |
| certifications | string[] | from approved list | ISO 27001, ISO 9001, AQAP, etc. |
| clearance_level | enum | unclassified, restricted, confidential, secret | Declaration only |
| past_defense_experience | string | 50-500 chars | Description of relevant contracts |
| use_cases | string[] | 1-10 items | Specific defense application scenarios |
| team_size | enum | 1-10, 11-50, 51-200, 201-500, 500+ | Self-reported |
| founded_year | integer | 1800-current | Plausibility check |
| country | string | ISO 3166-1 alpha-2 | Must be valid country code |
| website | string | valid URL | Must be accessible |
| partnership_interest | string[] | from list | Types of partnerships sought |

### Partnership Interest Types
- Joint Development
- Technology Licensing
- Subcontracting
- Research Collaboration
- System Integration
- Testing & Evaluation
- Training & Support
- Investment / Funding

## 5. Compliance & Security Framework

### Classification Handling
- Platform operates at UNCLASSIFIED level only
- All submitted content must be UNCLASSIFIED
- Companies should NOT submit controlled technical data
- ITAR/EAR controlled items should be described in general terms only

### Compliance Declarations
Companies must declare (yes/no/not-applicable):
- ITAR registration status
- EAR compliance awareness
- EU dual-use regulation awareness
- National security clearance status
- NATO clearance status
- Data protection compliance (GDPR if EU-based)

## 6. Content Quality Criteria

### Description Quality Scoring
- **Excellent (90-100):** Clear value proposition, specific defense applications mentioned,
  quantified capabilities, named reference environments
- **Good (75-89):** Clear description with defense relevance, some specifics but room
  for more detail
- **Acceptable (60-74):** Basic description present but vague or generic, defense
  relevance implied but not explicit
- **Poor (< 60):** Missing key information, no defense relevance, marketing-only
  language without substance

### Content Red Flags
- Buzzword-heavy with no specifics ("leveraging AI to disrupt...")
- No mention of defense/naval/maritime context
- Contradictory TRL claims vs. description maturity
- Missing technical depth for claimed capabilities
- Generic descriptions that could apply to any company

## 7. Scoring Algorithm

```
quality_score = (
  critical_completeness * 0.60 +    // All required fields present and valid
  quality_completeness * 0.20 +      // Recommended fields filled
  content_quality * 0.15 +           // Description depth and specificity
  consistency_check * 0.05           // TRL/capabilities/description alignment
) * 100

// Where each component is 0.0 - 1.0
// critical_completeness: fields_valid / fields_required
// quality_completeness: quality_fields_filled / quality_fields_total
// content_quality: automated text analysis score
// consistency_check: cross-field validation score
```

### Score Thresholds
- **>= 85:** APPROVED — Profile is AI-ready, high match quality expected
- **75-84:** APPROVED_WITH_WARNINGS — Profile is acceptable, suggestions provided
- **60-74:** NEEDS_IMPROVEMENT — Profile can be submitted but match quality will be low
- **< 60:** NEEDS_REVISION — Critical gaps prevent meaningful AI matching
