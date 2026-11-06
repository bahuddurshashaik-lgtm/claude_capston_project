# SDLC Orchestration Guide

## 🎯 Overview

This guide ensures the **SDLC Orchestrator** properly coordinates all 9 agents to deliver a complete user story from requirements to PR with no gaps.

---

## 🤖 The 9 SDLC Agents

### Agent Pipeline (Sequential Order)

```
User Story Request
       ↓
1. Requirements Analyst    → Extracts requirements
       ↓
2. Solution Architect      → Designs architecture
       ↓
3. Design Reviewer         → Reviews & validates design
       ↓
4. Implementation Planner  → Creates implementation plan
       ↓
5. Implementer            → Writes code & tests
       ↓
6. Code Reviewer          → Reviews code quality
       ↓
7. Verifier               → Runs tests & validates
       ↓
8. PR Author              → Creates PR documentation
       ↓
  Pull Request Ready
```

---

## 📋 Agent Responsibilities Checklist

### 1️⃣ Requirements Analyst

**Input:**
- User story ID (e.g., HB-001, HB-002)
- User story description
- Confluence/documentation links (optional)

**Outputs:**
- ✅ `docs/sdlc/{story-id}-requirements.md`

**What it must deliver:**
- [ ] User story details (As a... I want... So that...)
- [ ] Acceptance criteria (testable conditions)
- [ ] Functional requirements
- [ ] Non-functional requirements
- [ ] Technical constraints
- [ ] Dependencies on other stories
- [ ] Success metrics

**Validation:**
- File exists at correct path
- Contains all required sections
- Acceptance criteria are testable
- Requirements are clear and unambiguous

---

### 2️⃣ Solution Architect

**Input:**
- Story ID
- `docs/sdlc/{story-id}-requirements.md`

**Outputs:**
- ✅ `docs/sdlc/{story-id}-architecture.md`

**What it must deliver:**
- [ ] High-level architecture design
- [ ] Component breakdown (Models, Services, Controllers)
- [ ] Data models and schemas
- [ ] API endpoints (if applicable)
- [ ] Integration points
- [ ] Technology choices with rationale
- [ ] Architecture diagrams (ASCII/Mermaid)
- [ ] Security considerations
- [ ] Performance considerations

**Validation:**
- File exists with complete architecture
- All components identified
- Data models defined
- Integration points clear
- Technology choices justified

---

### 3️⃣ Design Reviewer

**Input:**
- Story ID
- `docs/sdlc/{story-id}-requirements.md`
- `docs/sdlc/{story-id}-architecture.md`

**Outputs:**
- ✅ `docs/sdlc/{story-id}-design-review.md`
- ✅ Updates to `docs/sdlc/{story-id}-architecture.md` (if needed)

**What it must deliver:**
- [ ] Design approval or concerns
- [ ] Architecture validation
- [ ] Identified risks
- [ ] Scalability assessment
- [ ] Maintainability assessment
- [ ] Security review
- [ ] Performance considerations
- [ ] Recommended improvements
- [ ] Final approval status

**Validation:**
- Review is thorough
- All concerns addressed
- Architecture updated if needed
- Clear approval/rejection decision

---

### 4️⃣ Implementation Planner

**Input:**
- Story ID
- `docs/sdlc/{story-id}-requirements.md`
- `docs/sdlc/{story-id}-architecture.md`
- `docs/sdlc/{story-id}-design-review.md`

**Outputs:**
- ✅ `docs/sdlc/{story-id}-impl-plan.md`

**What it must deliver:**
- [ ] Step-by-step implementation tasks
- [ ] File-by-file breakdown
- [ ] What to create/modify in each file
- [ ] Implementation order (dependencies)
- [ ] Test plan for each component
- [ ] Estimated complexity
- [ ] Risk areas
- [ ] Checklist for implementer

**Validation:**
- Plan is detailed and actionable
- All files identified
- Implementation order logical
- Test plan comprehensive
- No ambiguous steps

---

### 5️⃣ Implementer

**Input:**
- Story ID
- `docs/sdlc/{story-id}-impl-plan.md`
- All previous artifacts

**Outputs:**
- ✅ Code in `src/models/`
- ✅ Code in `src/services/`
- ✅ Tests in `tests/unit/`
- ✅ Tests in `tests/integration/`
- ✅ Updates to `src/app.js` (if needed)

**What it must deliver:**
- [ ] All models implemented
- [ ] All services implemented
- [ ] All business logic complete
- [ ] Input validation included
- [ ] Error handling included
- [ ] Unit tests for all models (>80% coverage)
- [ ] Unit tests for all services (>80% coverage)
- [ ] Integration tests for workflows
- [ ] Code follows project conventions
- [ ] All acceptance criteria met

**Validation:**
- All planned files created/modified
- Code compiles/runs without errors
- Tests written and passing
- Coverage meets threshold (80%+)
- Follows coding standards
- No console errors

---

### 6️⃣ Code Reviewer

**Input:**
- Story ID
- All implementation files
- `docs/sdlc/{story-id}-impl-plan.md`

**Outputs:**
- ✅ `docs/sdlc/{story-id}-code-review.md`

**What it must deliver:**
- [ ] Code quality assessment
- [ ] Adherence to coding standards
- [ ] Security issues identified
- [ ] Performance concerns
- [ ] Test coverage validation
- [ ] Bug identification
- [ ] Code smells and anti-patterns
- [ ] Suggested improvements
- [ ] Approval/rejection decision

**Validation:**
- Review covers all files
- Issues are specific (file:line)
- Severity levels assigned
- Actionable feedback provided
- Clear approval criteria

**If defects found:**
- Send back to Implementer with issues
- Re-run Code Reviewer after fixes

---

### 7️⃣ Verifier

**Input:**
- Story ID
- All implementation files
- All test files
- `docs/sdlc/{story-id}-code-review.md`

**Outputs:**
- ✅ `docs/sdlc/{story-id}-verification.md`

**What it must deliver:**
- [ ] Test execution results
- [ ] Coverage report analysis
- [ ] All tests passing confirmation
- [ ] Acceptance criteria validation
- [ ] Integration test results
- [ ] Edge cases tested
- [ ] Performance benchmarks (if applicable)
- [ ] Security validation
- [ ] Final verification status

**Validation:**
- All tests executed
- npm test passes (100%)
- Coverage meets threshold (>80%)
- All acceptance criteria met
- No blocking issues
- Integration tests pass

**If verification fails:**
- Send back to Implementer with failures
- Re-run Code Reviewer and Verifier after fixes

---

### 8️⃣ PR Author

**Input:**
- Story ID
- All implementation files
- All SDLC artifacts
- `docs/sdlc/{story-id}-verification.md`

**Outputs:**
- ✅ `docs/sdlc/{story-id}-pr-description.md`
- ✅ Updates to `CHANGELOG.md`

**What it must deliver:**
- [ ] PR title (clear, concise)
- [ ] Summary of changes
- [ ] What was implemented
- [ ] How it works
- [ ] Testing performed
- [ ] Screenshots/demos (if UI)
- [ ] Breaking changes (if any)
- [ ] Migration guide (if needed)
- [ ] Checklist for reviewers
- [ ] Links to user story and artifacts
- [ ] CHANGELOG entry

**Validation:**
- PR description complete
- CHANGELOG updated
- All links working
- Clear testing instructions
- No sensitive data included

---

## 🔄 Orchestrator Workflow

### How to Run

```bash
# Invoke the orchestrator agent
@sdlc-orchestrator Implement user story HB-006
```

### Orchestrator Responsibilities

The orchestrator must:

1. **Ask for Story ID**
   - Confirm which user story to implement
   - Validate story ID exists

2. **Execute Pipeline Sequentially**
   - Delegate one agent at a time
   - Pass story ID to every agent
   - Provide paths to previous artifacts
   - Never skip agents

3. **Verify After Each Step**
   - Read the expected artifact
   - Confirm it exists and is complete
   - If missing/incomplete, re-delegate

4. **Human-in-the-Loop**
   - Summarize each step (5 lines max)
   - Link to artifact
   - Ask user to approve before next step
   - If user rejects, address concerns

5. **Handle Agent Questions**
   - Agents can't talk to user directly
   - If agent has questions, ask user
   - Re-delegate with answers

6. **Iterate on Failures**
   - If code review finds issues → back to Implementer
   - If verification fails → back to Implementer
   - Re-run Code Reviewer and Verifier after fixes

7. **Never Do Work Itself**
   - Orchestrator coordinates only
   - Never writes code/docs itself
   - Always delegates to specialists

---

## ✅ Complete Checklist for Each User Story

### Pre-Implementation
- [ ] User story ID confirmed
- [ ] Requirements clear and complete
- [ ] No blocking dependencies

### Phase 1: Analysis & Design
- [ ] Requirements Analyst completed
- [ ] `docs/sdlc/{story-id}-requirements.md` exists
- [ ] Solution Architect completed
- [ ] `docs/sdlc/{story-id}-architecture.md` exists
- [ ] Design Reviewer completed
- [ ] `docs/sdlc/{story-id}-design-review.md` exists
- [ ] Design approved

### Phase 2: Planning
- [ ] Implementation Planner completed
- [ ] `docs/sdlc/{story-id}-impl-plan.md` exists
- [ ] Plan is detailed and actionable

### Phase 3: Implementation
- [ ] Implementer completed
- [ ] All models created/updated
- [ ] All services created/updated
- [ ] All tests written
- [ ] Code runs without errors
- [ ] Tests pass locally

### Phase 4: Quality Assurance
- [ ] Code Reviewer completed
- [ ] `docs/sdlc/{story-id}-code-review.md` exists
- [ ] No blocking issues found
- [ ] Verifier completed
- [ ] `docs/sdlc/{story-id}-verification.md` exists
- [ ] All tests passing (npm test = 100%)
- [ ] Coverage threshold met (>80%)
- [ ] All acceptance criteria validated

### Phase 5: Documentation
- [ ] PR Author completed
- [ ] `docs/sdlc/{story-id}-pr-description.md` exists
- [ ] CHANGELOG.md updated
- [ ] All documentation complete

### Final Validation
- [ ] All 8 agents completed successfully
- [ ] All 8 artifacts generated
- [ ] Code integrated into main codebase
- [ ] Tests pass in CI/CD (if configured)
- [ ] Ready for PR creation

---

## 🚨 Gap Prevention

### Common Gaps to Avoid

1. **Missing Artifacts**
   - ❌ Agent completes but doesn't create file
   - ✅ Orchestrator must verify file exists after each step

2. **Incomplete Requirements**
   - ❌ Vague acceptance criteria
   - ✅ Requirements Analyst must make them testable

3. **Architecture Without Rationale**
   - ❌ "Use Express" with no explanation
   - ✅ Solution Architect must justify all choices

4. **Implementation Without Tests**
   - ❌ Code written but tests missing
   - ✅ Implementer must write tests alongside code

5. **Shallow Code Review**
   - ❌ "Looks good" without specifics
   - ✅ Code Reviewer must cite specific issues/files

6. **Verification Without Evidence**
   - ❌ "Tests pass" with no proof
   - ✅ Verifier must include test output and coverage

7. **PR Without Context**
   - ❌ "Implemented HB-006"
   - ✅ PR Author must explain what, how, and why

8. **Skipping Iteration**
   - ❌ Moving forward despite failures
   - ✅ Orchestrator must iterate until quality met

---

## 📊 Success Metrics

After orchestration, you should have:

| Metric | Target | Validation |
|--------|--------|------------|
| Artifacts Generated | 8 | All exist in docs/sdlc/ |
| Code Files Created/Updated | 2-6 | Models + Services |
| Test Files | 2-4 | Unit + Integration |
| Test Pass Rate | 100% | npm test succeeds |
| Code Coverage | >80% | npm run test:coverage |
| Requirements Met | 100% | All acceptance criteria pass |
| Code Review Issues | 0 blocking | Review approved |
| Documentation | Complete | All sections filled |

---

## 🎯 Example Orchestration Run

```
User: @sdlc-orchestrator Implement HB-006

Orchestrator: 
Starting SDLC for HB-006...

Step 1/8: Requirements Analysis
→ Delegating to requirements-analyst...
→ Artifact created: docs/sdlc/hb-006-requirements.md
→ Summary: Requirements extracted for payment validation
   Acceptance Criteria: 5 criteria defined
   Dependencies: None
→ Approve to continue? [y/n]

User: y

Step 2/8: Architecture Design
→ Delegating to solution-architect...
→ Artifact created: docs/sdlc/hb-006-architecture.md
→ Summary: Designed PaymentValidator service
   Components: 1 model, 1 service
   Integration: Links to PaymentService
→ Approve to continue? [y/n]

User: y

... continues through all 8 steps ...

Step 8/8: PR Documentation
→ Delegating to pr-author...
→ Artifacts created: 
   - docs/sdlc/hb-006-pr-description.md
   - CHANGELOG.md (updated)
→ Summary: PR documentation complete
   Changes: +150 lines, 3 files
   Tests: 15 new tests, 100% passing
→ Ready to create PR

✅ SDLC Complete for HB-006
```

---

## 🔍 Validation Command

Run this after orchestration to verify everything:

```bash
# Verify all artifacts exist
ls docs/sdlc/hb-006-*.md

# Verify tests pass
npm test

# Verify coverage
npm run test:coverage

# Verify code quality
npm run lint  # if configured

# Verify files created
git status
```

---

## 📝 Troubleshooting

### Issue: Agent doesn't create artifact
**Solution:** Orchestrator re-delegates with explicit file path

### Issue: Tests don't pass
**Solution:** Back to Implementer, then re-run Code Reviewer + Verifier

### Issue: Coverage below threshold
**Solution:** Back to Implementer to add tests

### Issue: Design concerns raised
**Solution:** Back to Solution Architect to address, then re-review

### Issue: Agent asks questions
**Solution:** Orchestrator asks user, re-delegates with answers

---

## 🎓 Best Practices

1. **Always Run Full Pipeline**
   - Don't skip agents
   - Don't merge without all 8 steps

2. **Iterate Until Quality**
   - Code review fails → fix and re-review
   - Tests fail → fix and re-verify

3. **Keep User Informed**
   - Summary after each step
   - Ask for approval
   - Show progress

4. **Verify Artifacts**
   - Read each artifact after creation
   - Ensure completeness
   - Check for empty files

5. **Document Everything**
   - All decisions in artifacts
   - All changes in CHANGELOG
   - All context in PR

---

## ✅ Final Validation

Before considering a story "done":

- [ ] All 8 agents completed
- [ ] All 8 artifacts exist
- [ ] npm test passes (100%)
- [ ] Coverage >80%
- [ ] Code reviewed and approved
- [ ] All acceptance criteria met
- [ ] PR documentation complete
- [ ] CHANGELOG updated
- [ ] No gaps in implementation
- [ ] Ready for human PR review

---

**Status:** Ready for Orchestration  
**Last Updated:** 2026-11-06  
**Version:** 1.0
