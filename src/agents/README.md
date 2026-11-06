# Agentic SDLC Agents - Implementation Reference

This directory contains reference implementations and documentation for the Agentic SDLC agents.

## Agent Definitions Location

**The actual agent definitions used by Claude Code are located in `.claude/agents/`**

This directory (`src/agents/`) contains:
- Reference JavaScript implementations
- Documentation and summaries
- Test execution notes

## Active Agents (in `.claude/agents/`)

All 9 agents are now registered and accessible:

1. **orchestration-agent** - Coordinates full SDLC workflow
2. **requirements-agent** - Analyzes user stories
3. **architecture-agent** - Designs system architecture  
4. **design-review-agent** - Reviews architecture
5. **implementation-planning-agent** - Creates task breakdown
6. **implementation-agent** - Writes production code
7. **code-review-agent** - Reviews code quality
8. **verification-agent** - Runs tests and validation
9. **pr-agent** - Creates pull requests

## Usage

To use the agents from Claude Code:

```
"Run orchestration-agent for user story HB-001"
```

Or invoke specific agents:

```
"Use requirements-agent to analyze HB-001"
"Use architecture-agent to design the system"
```

## Files in This Directory

- **requirements-agent.js** - JavaScript implementation example
- **AGENT_SUMMARY.md** - Summary of agent capabilities
- **test-agent-execution.md** - Test execution notes
- **README.md** - This file

## See Also

- `.claude/agents/README.md` - Complete agent documentation
- `docs/` - Agent output documentation
