# Agentic SDLC Workflow Guide

This document outlines the complete Agentic SDLC workflow using Claude Code and the Confluence MCP integration.

## Overview

The Agentic SDLC Pipeline automates the entire software development lifecycle from requirements gathering to PR creation, with Claude Code as the AI agent driving each phase.

## Workflow Phases

### Phase 1: Requirements Gathering

**Goal**: Read user stories from Confluence and create detailed requirements documentation

**Steps**:
1. Use Claude Code to read user story from Confluence
   ```
   Get the page titled "US-001: Requirements Gathering and Documentation" from Confluence
   ```

2. Claude analyzes the user story and asks clarifying questions:
   - What are the key functional requirements?
   - What are the non-functional requirements (performance, security, etc.)?
   - What are the acceptance criteria?
   - What are the edge cases to consider?

3. Human responds to clarifying questions

4. Claude creates `docs/requirements/requirements.md` with:
   - Functional requirements
   - Non-functional requirements
   - Success criteria
   - Out of scope items
   - Assumptions and constraints

5. Commit the requirements document

**Commands**:
```bash
git add docs/requirements/requirements.md
git commit -m "docs: add requirements documentation for [feature name]

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Phase 2: Architecture Design

**Goal**: Design high-level system architecture based on requirements

**Steps**:
1. Ask Claude to design architecture:
   ```
   Based on requirements.md, design a system architecture for this feature
   ```

2. Claude proposes:
   - Component diagram (text or Mermaid)
   - Technology stack recommendations
   - Data flow between components
   - Key interfaces and APIs
   - Integration points

3. Review and provide feedback

4. Claude creates `docs/architecture/architecture.md`

5. Commit the architecture document

**Key Considerations**:
- Scalability
- Security
- Performance
- Maintainability
- Testability

---

### Phase 3: Design Review

**Goal**: Identify risks and gaps before implementation

**Steps**:
1. Ask Claude to review the architecture:
   ```
   Review architecture.md and identify risks, gaps, and improvement opportunities
   ```

2. Claude evaluates:
   - **Single Responsibility**: Are components focused?
   - **Scalability**: Can it handle growth?
   - **Security**: Are vulnerabilities addressed?
   - **Data Flow**: Is it efficient and clear?
   - **Error Handling**: Are failure modes covered?
   - **Testing Strategy**: Is it testable?
   - **Deployment**: Is it deployable?

3. Claude creates `docs/design-review/design-review.md` with:
   - Identified risks
   - Gaps and missing considerations
   - Recommendations
   - Approved decisions

4. If issues found, update architecture.md

5. Commit both documents

---

### Phase 4: Implementation Planning

**Goal**: Break down architecture into actionable tasks

**Steps**:
1. Ask Claude to create implementation plan:
   ```
   Create a task breakdown from architecture.md with dependencies and priorities
   ```

2. Claude generates:
   - Ordered list of tasks
   - Dependencies between tasks
   - Estimated complexity
   - Blocked items with reasons
   - Critical path identification

3. Claude creates `docs/implementation-plan/impl-plan.md`

4. Review and adjust priorities if needed

5. Commit the implementation plan

**Task Categories**:
- Infrastructure setup
- Core component implementation
- Integration points
- Testing
- Documentation

---

### Phase 5: Implementation

**Goal**: Write production-ready code following the plan

**Steps**:
1. Work through tasks in dependency order

2. For each task, ask Claude:
   ```
   Implement [task name] according to impl-plan.md
   ```

3. Claude:
   - Creates necessary files and directories
   - Implements the functionality
   - Adds inline documentation where needed
   - Follows best practices and patterns

4. Review the implementation

5. Iterate as needed

**GitHub Copilot Features to Use**:
- Code completion
- Agent mode for complex implementations
- Chat for explanations
- Inline suggestions

---

### Phase 6: Code Review

**Goal**: Ensure code quality before creating PR

**Steps**:
1. Ask Claude to review the code:
   ```
   Review the implemented code using the code review checklist
   ```

2. Claude evaluates:

| Review Area | Review Question |
|-------------|----------------|
| **Correctness** | Does each component behave as specified? |
| **Security** | Are secrets excluded? Is input validated? |
| **Error Handling** | Are failures handled gracefully? |
| **Test Coverage** | Are happy path AND edge cases covered? |
| **Code Clarity** | Are names self-explanatory? |
| **DRY Principle** | Is there duplicated logic to refactor? |
| **Dependency Safety** | Any vulnerable package versions? |

3. Claude provides findings and suggestions

4. Address any issues found

5. Iterate until review passes

---

### Phase 7: Verification

**Goal**: Comprehensive testing of implementation

**Steps**:
1. Ask Claude to generate tests:
   ```
   Generate unit and integration tests for the implemented features
   ```

2. Run the tests:
   ```bash
   npm test
   ```

3. If tests fail:
   - Analyze failures
   - Fix issues
   - Re-run tests

4. Verify test coverage is adequate

5. Document test results

---

### Phase 8: Pull Request Creation

**Goal**: Create comprehensive PR to complete the SDLC cycle

**Steps**:
1. Ask Claude to create the PR:
   ```
   Create a pull request for this implementation with complete documentation
   ```

2. Claude generates PR with required sections:

   **Summary**
   - 2-3 sentence overview of what was built and why

   **Changes Made**
   - Bulleted list of all files added/modified
   - Reason for each change

   **Test Evidence**
   - Test run output
   - CI results link
   - Coverage metrics

   **Known Limitations**
   - Items marked as out of scope
   - Future improvements needed

   **Reviewer Checklist**
   - [ ] Code follows project conventions
   - [ ] Tests pass locally
   - [ ] No security vulnerabilities
   - [ ] Documentation is updated
   - [ ] Acceptance criteria are met

3. Claude creates the PR:
   ```bash
   git checkout -b feature/[feature-name]
   git add .
   git commit -m "feat: implement [feature name]

   Co-Authored-By: Claude Code <noreply@anthropic.com>"
   git push origin feature/[feature-name]
   gh pr create --title "[Feature Name]" --body "[PR Description]"
   ```

4. Review the PR description

5. Submit for team review

---

## Best Practices

### Working with Claude Code

1. **Be Specific**: Provide clear, detailed instructions
2. **Reference Documents**: Always reference requirements.md, architecture.md, etc.
3. **Iterate**: Don't expect perfection on first attempt
4. **Review Everything**: Claude is a tool, not a replacement for human judgment
5. **Ask Questions**: If something is unclear, ask Claude to explain

### Documentation

- Keep all documents in sync
- Update documents when decisions change
- Use clear, concise language
- Include diagrams where helpful
- Version control everything

### Code Quality

- Follow the project's coding standards
- Write meaningful commit messages
- Test thoroughly before creating PR
- Address all review comments
- Keep PRs focused and reviewable

### Collaboration

- Share insights with the team
- Document lessons learned
- Update user stories in Confluence
- Keep stakeholders informed
- Celebrate wins!

---

## Example Commands for Each Phase

### Requirements
```
Read user story US-001 from Confluence and ask me clarifying questions
```

### Architecture
```
Design a system architecture for the requirements in docs/requirements/requirements.md
```

### Design Review
```
Review the architecture in docs/architecture/architecture.md for risks and gaps
```

### Implementation Planning
```
Break down docs/architecture/architecture.md into a dependency-ordered task list
```

### Implementation
```
Implement the first task in docs/implementation-plan/impl-plan.md
```

### Code Review
```
Review the code I just implemented using the code review checklist
```

### Verification
```
Generate comprehensive tests for the implemented features
```

### PR Creation
```
Create a pull request with all required sections for this feature
```

---

## Metrics and Success Criteria

### Efficiency Metrics
- Time from requirements to PR creation
- Number of review iterations needed
- Test coverage percentage
- Defects found in review vs production

### Quality Metrics
- Code review score
- Security vulnerabilities found (should be 0)
- Test pass rate
- Documentation completeness

### Process Metrics
- Adherence to SDLC phases
- Completeness of documentation
- Stakeholder satisfaction
- Team velocity improvement

---

## Troubleshooting

### Claude doesn't have context
- Reference the specific document: "According to requirements.md..."
- Paste relevant sections if needed
- Keep conversation focused on current phase

### Implementation differs from architecture
- Review architecture.md and impl-plan.md
- Update documents if requirements changed
- Get approval for architectural changes

### Tests are failing
- Ask Claude to help debug: "Help me understand why this test is failing"
- Check if implementation matches specifications
- Verify test assumptions are correct

### PR is too large
- Consider breaking into smaller PRs
- Focus on one user story at a time
- Use feature flags for incremental delivery

---

## Next Steps

1. Complete the setup in SETUP.md
2. Read the first user story from Confluence
3. Start with Phase 1: Requirements Gathering
4. Work through each phase systematically
5. Document lessons learned
6. Iterate and improve the process

## Resources

- [Project README](../README.md)
- [Setup Guide](../SETUP.md)
- [Confluence Space](https://bahuddurshashaik.atlassian.net/wiki/spaces/ClaudeCpas/overview)
- [User Stories Template](requirements/user-stories-template.md)
