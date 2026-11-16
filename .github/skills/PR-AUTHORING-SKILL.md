# Pull Request Authoring Skill

## Purpose
This skill guides AI agents through creating high-quality pull requests that are clear, complete, and ready for review. It ensures PRs are traceable to requirements, properly tested, and follow best practices for collaborative software development.

## Usage
Invoke this skill whenever you need to:
- Create a new pull request from completed work
- Validate a PR before submission
- Ensure code changes meet quality standards
- Link implementation work to requirements or tickets
- Prepare code for team review

This skill is project-independent and applies across any version control workflow, technology stack, or development process.

---

## Core Rules

### 1. Requirement Traceability
Link the PR to the relevant Jira story and verify implementation against acceptance criteria.

- **Link to Issue**: Include Jira ticket ID in PR title and description
- **Reference Format**: Use conventional formats (e.g., "Fixes #123", "Resolves JIRA-456")
- **Verify Acceptance Criteria**: Confirm each criterion from the story is met
- **Document Coverage**: Note which acceptance criteria are addressed
- **Flag Gaps**: Clearly identify any criteria not yet implemented

**Example:**
```markdown
## Related Issue
Closes JIRA-123: Add hotel search filtering by amenities

## Acceptance Criteria Coverage
✅ Users can filter by multiple amenities
✅ Filter count displays number of active filters
✅ Results update dynamically without page reload
⚠️  Save filter preferences - deferred to JIRA-124
```

**If traceability is unclear:** Ask for the ticket number or requirement document before proceeding.

### 2. Clear PR Description
Include purpose, summary of changes, implementation details, and related Jira issue.

**Required Sections:**

- **Purpose**: Why this change is needed (business context)
- **Summary**: What was changed at a high level
- **Implementation Details**: How the solution works
- **Technical Decisions**: Key design choices and rationale
- **Breaking Changes**: Any backwards-incompatible changes
- **Related Issues**: Links to tickets, stories, or discussions

**Structure:**
```markdown
## Purpose
[Why this change is needed - the business value]

## Summary of Changes
- [High-level change 1]
- [High-level change 2]
- [High-level change 3]

## Implementation Details
[Explain the approach, architecture, or design decisions]

### Key Changes
- **Component/File**: [What changed and why]
- **Component/File**: [What changed and why]

## Breaking Changes
[List any breaking changes, or "None"]

## Migration Notes
[If applicable, how to migrate existing code/data]
```

**Keep it concise but complete**: Reviewers should understand the change without reading every line of code.

### 3. Code Quality
Follow project coding standards, maintain readability, and avoid unnecessary changes.

- **Style Consistency**: Match existing code formatting and conventions
- **Naming Conventions**: Use clear, descriptive names following project patterns
- **Documentation**: Add comments for complex logic, update existing docs
- **Error Handling**: Implement appropriate error handling and validation
- **No Scope Creep**: Only include changes related to the PR objective
- **Clean Commits**: Logical, well-organized commit history
- **No Debug Code**: Remove console.logs, commented code, debug flags

**Pre-Submission Checks:**
- [ ] Code follows project style guide
- [ ] All functions/classes have appropriate documentation
- [ ] Complex logic includes explanatory comments
- [ ] No unnecessary formatting changes
- [ ] No commented-out code blocks
- [ ] Error handling is appropriate and consistent
- [ ] Variable and function names are clear and descriptive

**If project standards are unclear:** Check existing code patterns or ask for the style guide before implementing.

### 4. Testing & Validation
Run relevant tests, validate results, and document test coverage and known failures.

- **Run All Tests**: Execute unit, integration, and E2E tests as applicable
- **Document Test Results**: Include test output or summary
- **Test Coverage**: Note coverage percentage and critical paths tested
- **Manual Testing**: Document manual testing performed
- **Known Issues**: Flag any failing tests or known limitations
- **Test Additions**: Highlight new tests added

**Testing Checklist:**
- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Edge cases are tested
- [ ] Error scenarios are tested
- [ ] Integration points are tested
- [ ] Performance impact is acceptable
- [ ] Manual testing completed for UI changes

**Test Documentation Format:**
```markdown
## Testing

### Automated Tests
- Unit tests: ✅ 45/45 passing
- Integration tests: ✅ 12/12 passing
- E2E tests: ✅ 8/8 passing
- Coverage: 92% (up from 89%)

### Manual Testing
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Verified mobile responsive behavior
- [ ] Tested with sample production data
- [ ] Verified error messages display correctly

### Known Issues
- None
```

**If tests fail:** Fix the failures or document why they're acceptable before creating the PR.

### 5. Review Before Raising
Check for accidental files, secrets, debugging code, merge conflicts, and correct source and target branches before creating the PR.

**Pre-Creation Checklist:**

**Security & Secrets:**
- [ ] No API keys, passwords, or credentials in code
- [ ] No `.env` files or local config files committed
- [ ] No tokens or sensitive data in comments or logs
- [ ] No internal URLs or infrastructure details exposed

**Code Cleanliness:**
- [ ] No debug statements (console.log, print, etc.)
- [ ] No commented-out code blocks
- [ ] No TODO comments without ticket references
- [ ] No temporary/test files committed
- [ ] No unnecessary console output

**Git Hygiene:**
- [ ] No merge conflicts present
- [ ] Commit messages are clear and descriptive
- [ ] Branch is up to date with target branch
- [ ] No accidental file deletions
- [ ] `.gitignore` properly excludes build artifacts

**Branch Validation:**
- [ ] Source branch is correct
- [ ] Target branch is correct (usually `main`, `develop`, or `master`)
- [ ] Branch name follows convention (e.g., `feature/JIRA-123-description`)
- [ ] No unrelated commits included

**File Validation:**
- [ ] Only relevant files are included
- [ ] No `node_modules`, `dist`, or build output
- [ ] No IDE-specific files (.idea, .vscode, etc.)
- [ ] No OS-specific files (.DS_Store, Thumbs.db)

**If any validation fails:** Fix the issue before creating the PR. Do not proceed with a PR that contains secrets, conflicts, or unnecessary files.

---

## Expected Output

When using this skill, create a pull request with the following structure:

```markdown
# [JIRA-123] Brief description of the change

## Related Issue
Closes JIRA-123: [Full ticket title]

## Purpose
[Why this change is needed - business context and value]

## Summary of Changes
- [Key change 1]
- [Key change 2]
- [Key change 3]

## Implementation Details

### Architecture/Design Decisions
[Explain the approach and why this solution was chosen]

### Key Changes
- **src/components/SearchFilter.js**: Added multi-select amenity filtering
- **src/api/hotels.js**: Updated search endpoint to accept amenity filters
- **tests/SearchFilter.test.js**: Added comprehensive test coverage

### Breaking Changes
[List any breaking changes, or "None"]

## Acceptance Criteria Coverage
✅ Criterion 1: [Brief description]
✅ Criterion 2: [Brief description]
✅ Criterion 3: [Brief description]

## Testing

### Automated Tests
- Unit tests: ✅ [X/X passing]
- Integration tests: ✅ [X/X passing]
- Coverage: [X%]

### Manual Testing
- [ ] Feature tested in development environment
- [ ] Edge cases verified
- [ ] Error scenarios handled correctly

## Screenshots/Demo
[If applicable, include screenshots or GIF demonstrating the change]

## Reviewer Notes
[Any specific areas you'd like reviewers to focus on]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No sensitive data committed
- [ ] No merge conflicts
- [ ] Branch up to date with target

---

[PR attribution as configured in project]
```

---

## Validation Checklist

Before creating any pull request, verify:

1. **Traceability**: Is the PR linked to a ticket/story?
2. **Completeness**: Are all acceptance criteria addressed?
3. **Clarity**: Can reviewers understand the change without asking questions?
4. **Quality**: Does code meet project standards?
5. **Testing**: Have tests been run and results documented?
6. **Security**: Are there no secrets or sensitive data?
7. **Cleanliness**: Is debugging code removed?
8. **Branch**: Are source and target branches correct?
9. **Conflicts**: Are there no merge conflicts?
10. **Scope**: Does the PR only include relevant changes?

**If any validation fails:** Address the issue before proceeding with PR creation.

---

## Best Practices

- Keep PRs focused and reasonably sized (under 400 lines when possible)
- Write descriptive commit messages that explain the "why"
- Break large features into multiple smaller PRs
- Request reviews from appropriate team members
- Respond promptly to review feedback
- Use draft PRs for work-in-progress that needs early feedback
- Add labels and assignees as per project conventions
- Update the PR description if scope changes during review

---

## Common Pitfalls to Avoid

- Creating PRs without linking to requirements
- Vague or missing PR descriptions
- Including unrelated changes or scope creep
- Skipping test execution or documentation
- Committing secrets, credentials, or sensitive data
- Creating PRs with merge conflicts
- Targeting the wrong branch
- Leaving debug code or commented blocks
- Massive PRs that are difficult to review
- Missing breaking change documentation

---

## Agent Instructions

When using this skill:

1. **Verify traceability** to requirements/tickets first
2. **Review the diff** carefully before creating PR
3. **Run all tests** and document results
4. **Apply all five core rules** systematically
5. **Use the validation checklist** thoroughly
6. **Format PR description** according to expected structure
7. **Check for security issues** - never commit secrets
8. **Validate branch settings** before submission
9. **Request specific reviewers** if you know who should review
10. **Ask for guidance** if any requirement is unclear

**Remember:** A well-crafted PR saves time for reviewers and speeds up the merge process. Quality over speed.

---

## Integration with Git Workflows

This skill adapts to different workflows:

- **GitHub**: Use `Closes #123` or `Fixes #123` in description
- **GitLab**: Use `Closes JIRA-123` or project-specific format
- **Bitbucket**: Follow project conventions for issue linking
- **Azure DevOps**: Use `Resolves #123` or work item linking

**Always check project-specific conventions** for:
- Branch naming patterns
- Commit message format
- PR title format
- Required labels or tags
- Review approval requirements

This skill is designed to be reusable across projects. Apply these principles consistently regardless of the platform or project context.
