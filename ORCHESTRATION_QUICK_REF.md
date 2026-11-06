# Orchestration Quick Reference Card

## 🚀 How to Run Orchestration

```bash
# 1. Validate everything is ready
./validate-agents.sh

# 2. Start orchestration (in Claude Code)
@sdlc-orchestrator Implement user story HB-006

# 3. Follow the prompts and approve each step
```

---

## 📊 The 8-Step Pipeline

| Step | Agent | Output | Approval? |
|------|-------|--------|-----------|
| 1 | Requirements Analyst | `docs/sdlc/{story-id}-requirements.md` | ✅ Yes |
| 2 | Solution Architect | `docs/sdlc/{story-id}-architecture.md` | ✅ Yes |
| 3 | Design Reviewer | `docs/sdlc/{story-id}-design-review.md` | ✅ Yes |
| 4 | Implementation Planner | `docs/sdlc/{story-id}-impl-plan.md` | ✅ Yes |
| 5 | Implementer | Code + Tests in `src/`, `tests/` | ✅ Yes |
| 6 | Code Reviewer | `docs/sdlc/{story-id}-code-review.md` | ✅ Yes |
| 7 | Verifier | `docs/sdlc/{story-id}-verification.md` | ✅ Yes |
| 8 | PR Author | `docs/sdlc/{story-id}-pr-description.md` | ✅ Yes |

---

## ✅ What to Check at Each Step

### After Requirements Analyst
- [ ] File exists: `docs/sdlc/{story-id}-requirements.md`
- [ ] Has acceptance criteria (testable)
- [ ] Dependencies identified
- [ ] Requirements are clear

### After Solution Architect
- [ ] File exists: `docs/sdlc/{story-id}-architecture.md`
- [ ] Components identified (models, services)
- [ ] Data models defined
- [ ] Technology choices justified

### After Design Reviewer
- [ ] File exists: `docs/sdlc/{story-id}-design-review.md`
- [ ] Design approved or concerns raised
- [ ] Architecture updated if needed
- [ ] No blocking issues

### After Implementation Planner
- [ ] File exists: `docs/sdlc/{story-id}-impl-plan.md`
- [ ] Step-by-step tasks defined
- [ ] Files to create/modify listed
- [ ] Test plan included

### After Implementer
- [ ] Code files created in `src/models/`, `src/services/`
- [ ] Test files created in `tests/unit/`, `tests/integration/`
- [ ] Code compiles without errors
- [ ] Tests pass locally: `npm test`

### After Code Reviewer
- [ ] File exists: `docs/sdlc/{story-id}-code-review.md`
- [ ] Issues documented with file:line
- [ ] Severity levels assigned
- [ ] Approval or rejection clear

### After Verifier
- [ ] File exists: `docs/sdlc/{story-id}-verification.md`
- [ ] All tests pass: `npm test` = 100%
- [ ] Coverage >80%: `npm run test:coverage`
- [ ] All acceptance criteria validated

### After PR Author
- [ ] File exists: `docs/sdlc/{story-id}-pr-description.md`
- [ ] CHANGELOG.md updated
- [ ] Clear summary of changes
- [ ] Testing instructions included

---

## 🔄 Iteration Rules

### If Code Review Fails
```
Code Reviewer finds issues
    ↓
Back to Implementer (fix issues)
    ↓
Re-run Code Reviewer
    ↓
Re-run Verifier
```

### If Verification Fails
```
Verifier finds test failures
    ↓
Back to Implementer (fix tests)
    ↓
Re-run Code Reviewer
    ↓
Re-run Verifier
```

### If Design Review Has Concerns
```
Design Reviewer raises concerns
    ↓
Back to Solution Architect (address concerns)
    ↓
Re-run Design Reviewer
    ↓
Continue to Implementation Planner
```

---

## 🚨 Red Flags

Stop and investigate if:

- ❌ Agent doesn't create expected file
- ❌ File is empty or incomplete
- ❌ Tests don't pass after Implementer
- ❌ Coverage below 80%
- ❌ Agent asks questions (orchestrator must relay to user)
- ❌ Design rejected without addressing concerns
- ❌ Code review fails multiple times
- ❌ Acceptance criteria not met

---

## 📝 Commands During Orchestration

```bash
# Check if artifact exists
ls docs/sdlc/hb-006-*.md

# Run tests
npm test

# Check coverage
npm run test:coverage

# See what was changed
git status
git diff

# View artifact
cat docs/sdlc/hb-006-requirements.md
```

---

## ✅ Success Criteria

Before marking story as "done":

| Criteria | Command to Verify |
|----------|------------------|
| All 8 artifacts exist | `ls docs/sdlc/hb-006-*.md` |
| All tests pass | `npm test` |
| Coverage >80% | `npm run test:coverage` |
| Code compiles | `npm start` or `node src/app.js` |
| CHANGELOG updated | `git diff CHANGELOG.md` |
| No uncommitted files | `git status` |

---

## 🎯 Expected Timeline

| Step | Typical Duration |
|------|-----------------|
| Requirements | 2-5 minutes |
| Architecture | 3-7 minutes |
| Design Review | 2-4 minutes |
| Implementation Plan | 3-5 minutes |
| Implementation | 10-30 minutes |
| Code Review | 3-7 minutes |
| Verification | 2-5 minutes |
| PR Documentation | 2-3 minutes |
| **Total** | **27-66 minutes** |

*Times vary based on story complexity*

---

## 📋 Example Approval Flow

```
Orchestrator: Step 1/8: Requirements Analysis
              Delegating to requirements-analyst...
              
[Agent works...]

Orchestrator: ✅ Artifact created: docs/sdlc/hb-006-requirements.md
              Summary: 5 acceptance criteria, 3 functional requirements
              Dependencies: None
              
              Approve to continue? [y/n]

User: y

Orchestrator: Step 2/8: Architecture Design
              Delegating to solution-architect...
              
[Process continues...]
```

---

## 🔍 Validation Before Starting

Run this before orchestration:

```bash
# Validate agents configured
./validate-agents.sh

# Expected: 33 checks, 100% pass rate
```

---

## 💡 Pro Tips

1. **Read Artifacts Between Steps**
   - Don't just approve blindly
   - Check artifacts are complete
   - Verify quality before proceeding

2. **Iterate Until Quality**
   - Don't skip issues
   - Fix and re-review until approved
   - Quality > Speed

3. **Document Decisions**
   - All context in artifacts
   - Why, not just what
   - Future you will thank you

4. **Test Frequently**
   - Run `npm test` after Implementer
   - Don't wait for Verifier
   - Catch issues early

5. **Use Git**
   - Commit after successful steps
   - Easy to rollback if needed
   - Track progress

---

## 🎓 Remember

- **Orchestrator coordinates, never codes**
- **One agent at a time, strict order**
- **Human approval after each step**
- **Iterate on failures**
- **All 8 agents must complete**
- **Verify artifacts exist after each step**
- **Quality gates: code review + verification**

---

**Quick Reference Version:** 1.0  
**Last Updated:** 2026-11-06

For detailed guide, see: [ORCHESTRATION_GUIDE.md](./ORCHESTRATION_GUIDE.md)
