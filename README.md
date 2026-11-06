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

### Sample Applications

This project includes two sets of user stories to practice the Agentic SDLC:

1. **Agentic SDLC Pipeline** (5 stories) - Meta implementation of the SDLC process itself
2. **Hotel Booking Application** (5 stories) - Full-featured hotel reservation system

### Confluence Integration
Confluence Space: https://bahuddurshashaik.atlassian.net/wiki/spaces/ClaudeCpas/overview

**Created User Stories:**
- 5 Agentic SDLC user stories (US-001 to US-005)
- 5 Hotel Booking user stories (HB-001 to HB-005)

### Getting Started

#### Quick Start
See [QUICK_START.md](QUICK_START.md) for a 5-minute setup guide.

#### Detailed Setup
1. Install dependencies: `cd src/mcp-servers/confluence && npm install`
2. Configure Confluence credentials in `.env` file
3. Create user stories: `node create-hotel-booking-stories.js`
4. Configure Claude Code MCP server (see [SETUP.md](SETUP.md))
5. Follow the SDLC workflow in [docs/AGENTIC_SDLC_WORKFLOW.md](docs/AGENTIC_SDLC_WORKFLOW.md)

### Documentation
- **[QUICK_START.md](QUICK_START.md)** - Get started in 5 minutes
- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[docs/AGENTIC_SDLC_WORKFLOW.md](docs/AGENTIC_SDLC_WORKFLOW.md)** - Complete SDLC workflow guide
- **[docs/requirements/HOTEL_BOOKING_GUIDE.md](docs/requirements/HOTEL_BOOKING_GUIDE.md)** - Hotel booking implementation guide
- **[mcp.json](mcp.json)** - MCP server configuration

### License
MIT
