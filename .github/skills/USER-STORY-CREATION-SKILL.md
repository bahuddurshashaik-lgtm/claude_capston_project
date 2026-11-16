# User Story Creation Skill

## Purpose
This skill provides a structured approach for AI agents to create well-formed user stories that meet professional standards. It ensures stories are clear, actionable, and testable while maintaining consistency across different projects and domains.

## Usage
Invoke this skill whenever you need to:
- Create new user stories from requirements or feature requests
- Transform rough ideas into structured user story format
- Validate existing user stories against best practices
- Break down epics into smaller, implementable stories

This skill is project-independent and can be applied across any technology stack, framework, or business domain.

---

## Core Rules

### 1. Clear Requirement
Follow the format: **As a [user], I want [feature], so that [benefit].**

- **user**: Clearly identify the persona or role (e.g., "hotel guest", "admin user", "API consumer")
- **feature**: Describe what functionality or capability is needed
- **benefit**: Explain the value or outcome this provides

**Example:**
> As a hotel guest, I want to filter search results by amenities, so that I can find hotels that meet my specific needs.

### 2. Acceptance Criteria
Define clear, measurable, and testable acceptance criteria.

- Write criteria in Given-When-Then format or as a bulleted checklist
- Each criterion must be objectively verifiable
- Cover happy paths, edge cases, and error scenarios
- Specify expected behavior for all user interactions
- Include performance requirements where applicable

**Example:**
```
Given a user on the search results page
When they select "Pool" and "WiFi" from amenity filters
Then only hotels with both amenities are displayed
And the filter count shows the number of active filters
```

### 3. INVEST Principle
Ensure stories are **Independent, Negotiable, Valuable, Estimable, Small, and Testable.**

- **Independent**: Story can be developed without blocking on other stories
- **Negotiable**: Details can be refined during implementation discussions
- **Valuable**: Delivers clear value to end users or stakeholders
- **Estimable**: Team can reasonably estimate effort required
- **Small**: Can be completed within one iteration/sprint
- **Testable**: Success can be objectively verified

**Validation Questions:**
- Can this story be implemented in any order?
- Does it deliver standalone value?
- Can the team estimate it within reasonable confidence?
- Is the scope small enough to complete in 1-2 weeks?

### 4. Scope & Dependencies
Identify business rules, assumptions, dependencies, and limitations. **Never invent missing requirements.**

- **Business Rules**: Document any constraints or policies that apply
- **Assumptions**: List what you're assuming to be true
- **Dependencies**: Note required systems, APIs, data, or other stories
- **Technical Constraints**: Identify platform, performance, or integration limits
- **Out of Scope**: Explicitly state what is NOT included

**If information is missing:**
- Ask clarifying questions instead of making assumptions
- Document what needs to be decided
- Flag ambiguities that could impact implementation

**Example:**
```
Dependencies:
- Requires hotel amenities database to be populated
- Depends on search API endpoint being available

Assumptions:
- Amenity list is predefined and managed by admin
- Filters use AND logic (not OR)

Out of Scope:
- Custom amenity creation by users
- Saving filter preferences
```

### 5. Review Before Creation
Validate ambiguity, duplication, completeness, and consistency with the original requirement before creating a Jira story.

**Pre-Creation Checklist:**
- [ ] Is the user story format correct (As a...I want...so that...)?
- [ ] Are acceptance criteria clear, complete, and testable?
- [ ] Does the story follow INVEST principles?
- [ ] Have all dependencies and assumptions been documented?
- [ ] Is there any ambiguity that needs clarification?
- [ ] Does this duplicate or overlap with existing stories?
- [ ] Does this accurately reflect the original requirement?
- [ ] Are there any missing edge cases or error scenarios?
- [ ] Have stakeholders been identified?
- [ ] Is the priority and size appropriately estimated?

**If any checklist item fails:** Request clarification or additional information before proceeding.

---

## Expected Output

When using this skill, produce a user story in the following structure:

```markdown
## Story Title
[Concise, action-oriented title]

### User Story
As a [user role]
I want [feature/capability]
So that [business value/benefit]

### Acceptance Criteria
1. [Testable criterion 1]
2. [Testable criterion 2]
3. [Testable criterion 3]
...

### Business Rules
- [Rule 1]
- [Rule 2]

### Dependencies
- [Dependency 1]
- [Dependency 2]

### Assumptions
- [Assumption 1]
- [Assumption 2]

### Out of Scope
- [Item 1]
- [Item 2]

### Technical Notes
[Optional: Any technical considerations or constraints]

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Unit tests written and passing
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] Feature tested in staging environment
```

---

## Validation Checklist

Before finalizing any user story, verify:

1. **Clarity**: Can a developer understand what to build without additional context?
2. **Completeness**: Are all necessary details captured?
3. **Consistency**: Does this align with other stories and project goals?
4. **Testability**: Can QA verify this objectively?
5. **Value**: Does this deliver meaningful benefit to users?
6. **Feasibility**: Can this be implemented with available resources?
7. **Traceability**: Is the original requirement clearly linked?

**If essential information is missing:** Ask stakeholders for clarification. Do not proceed with incomplete or ambiguous information.

---

## Best Practices

- Keep user stories focused on user value, not technical implementation
- Write from the user's perspective, not the system's
- Use clear, non-technical language in the story description
- Save technical details for acceptance criteria and technical notes
- Update stories as new information emerges during development
- Link related stories to maintain traceability
- Include visual mockups or examples when helpful

---

## Common Pitfalls to Avoid

- Writing stories that are too large (epics disguised as stories)
- Omitting the "so that" clause (missing the "why")
- Making acceptance criteria vague or non-testable
- Inventing requirements not provided by stakeholders
- Skipping dependency identification
- Creating stories without validation against INVEST principles
- Duplicating existing stories without checking first

---

## Agent Instructions

When using this skill:

1. **Parse the requirement** carefully to understand user needs
2. **Ask questions** if any aspect is unclear or ambiguous
3. **Apply all five core rules** systematically
4. **Use the validation checklist** before creating the story
5. **Format output** according to the expected structure
6. **Document uncertainties** rather than making assumptions
7. **Seek confirmation** from stakeholders when needed

This skill is designed to be reusable across projects. Apply these principles consistently regardless of the technical domain or project context.
