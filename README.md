# GitHub Copilot Capstone Project
## Agentic SDLC Use Case: Automated Documentation Sync

### Project Overview
This project demonstrates an Agentic SDLC Pipeline implementation using GitHub Copilot's capabilities and features. The SDLC implementation is driven entirely through GitHub Copilot Agents, Prompts, Instructions, Skills and Hooks.

### Project Structure

```
claude_capston_project/
├── .claude/                      # Claude Code configuration
│   ├── skills/                   # Custom skills for Claude Code
│   └── hooks/                    # Git hooks and automation
├── docs/                         # Documentation
│   ├── requirements/             # Requirements documents
│   ├── architecture/             # Architecture documentation
│   ├── design-review/            # Design review documents
│   └── implementation-plan/      # Implementation plans
├── src/                          # Source code
│   ├── agents/                   # Agent implementations
│   └── mcp-servers/              # MCP (Model Context Protocol) servers
│       └── confluence/           # Confluence MCP server
├── tests/                        # Test suite
│   ├── unit/                     # Unit tests
│   └── integration/              # Integration tests
└── README.md                     # This file
```

### SDLC Steps

1. **Requirements** - Define and document functional and non-functional requirements
2. **Architecture** - Design high-level system architecture
3. **Design Review** - Conduct structured design review
4. **Implementation Planning** - Break down architecture into prioritized tasks
5. **Implementation** - Implement the changes
6. **Review** - Perform structured code review
7. **Verify** - Run comprehensive verification suite
8. **PR** - Create Pull Request with complete documentation

### Technologies
- **Claude Code** - AI-powered development assistant
- **MCP (Model Context Protocol)** - For integrating external tools
- **Confluence** - For user story and documentation management

### Confluence Integration
Confluence Space: https://bahuddurshashaik.atlassian.net/wiki/spaces/ClaudeCpas/overview

### Getting Started
1. Install dependencies (coming soon)
2. Configure Confluence MCP server
3. Follow the SDLC steps documented in `/docs`

### License
MIT
