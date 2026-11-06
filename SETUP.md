# Setup Guide

This guide will help you set up the Agentic SDLC Capstone Project with Confluence integration.

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Claude Code (CLI, Desktop, or Web)
- Atlassian Confluence account with API access

## Step 1: Clone and Navigate

```bash
cd claude_capston_project
```

## Step 2: Install MCP Server Dependencies

```bash
cd src/mcp-servers/confluence
npm install
```

## Step 3: Configure Confluence Credentials

### 3.1 Generate Confluence API Token

1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a name (e.g., "Claude Code MCP")
4. Copy the generated token (save it securely!)

### 3.2 Create Environment File

```bash
cp .env.example .env
```

Edit `.env` and fill in your credentials:

```env
CONFLUENCE_BASE_URL=https://bahuddurshashaik.atlassian.net/wiki
CONFLUENCE_EMAIL=your-email@example.com
CONFLUENCE_API_TOKEN=your-api-token-here
CONFLUENCE_SPACE_KEY=ClaudeCpas
```

## Step 4: Configure Claude Code MCP

### For Windows

Edit `%USERPROFILE%\.claude\settings.json`:

```json
{
  "mcpServers": {
    "confluence": {
      "command": "node",
      "args": [
        "C:/Users/shaiksai_bahuddursha/Documents/GitHub_Copilot_Capstone_Project/claude_capston_project/src/mcp-servers/confluence/index.js"
      ],
      "env": {
        "CONFLUENCE_BASE_URL": "https://bahuddurshashaik.atlassian.net/wiki",
        "CONFLUENCE_EMAIL": "your-email@example.com",
        "CONFLUENCE_API_TOKEN": "your-api-token-here",
        "CONFLUENCE_SPACE_KEY": "ClaudeCpas"
      }
    }
  }
}
```

### For Mac/Linux

Edit `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "confluence": {
      "command": "node",
      "args": [
        "/path/to/claude_capston_project/src/mcp-servers/confluence/index.js"
      ],
      "env": {
        "CONFLUENCE_BASE_URL": "https://bahuddurshashaik.atlassian.net/wiki",
        "CONFLUENCE_EMAIL": "your-email@example.com",
        "CONFLUENCE_API_TOKEN": "your-api-token-here",
        "CONFLUENCE_SPACE_KEY": "ClaudeCpas"
      }
    }
  }
}
```

## Step 5: Create User Stories in Confluence

Run the user story creation script:

```bash
cd src/mcp-servers/confluence
node create-user-stories.js
```

This will create 5 user stories in your Confluence space:
- US-001: Requirements Gathering and Documentation
- US-002: Architecture Design Automation
- US-003: Automated Design Review
- US-004: Implementation Planning and Task Breakdown
- US-005: Automated Code Review and PR Creation

## Step 6: Restart Claude Code

After configuring the MCP server, restart Claude Code to load the new configuration.

## Step 7: Test the Integration

In Claude Code, try these commands:

```
List all pages in the ClaudeCpas space
```

```
Get the page titled "US-001: Requirements Gathering and Documentation"
```

```
Search Confluence for pages about architecture
```

## Verification

To verify everything is set up correctly:

1. **MCP Server**: Run `npm start` in the confluence directory - it should start without errors
2. **Claude Code**: Check that the confluence MCP tools are available
3. **Confluence**: Verify the 5 user stories were created at:
   https://bahuddurshashaik.atlassian.net/wiki/spaces/ClaudeCpas/overview

## Troubleshooting

### "Authentication failed"
- Double-check your email and API token
- Ensure the API token hasn't expired
- Verify you have access to the Confluence space

### "Cannot find module"
- Run `npm install` in the confluence directory
- Check that Node.js is installed (`node --version`)

### "MCP server not found"
- Verify the path in settings.json is correct
- Use absolute paths, not relative
- Restart Claude Code after configuration changes

### "Space not found"
- Verify the space key is correct (case-sensitive)
- Ensure you have permissions to access the space

## Next Steps

Once setup is complete, you can proceed with the Agentic SDLC workflow:

1. **Requirements** - Read US-001 from Confluence and document requirements
2. **Architecture** - Design system architecture based on requirements
3. **Design Review** - Have Claude review the architecture
4. **Implementation Planning** - Break down into tasks
5. **Implementation** - Write the code
6. **Review** - Automated code review
7. **Verify** - Run tests
8. **PR** - Create pull request

## Additional Resources

- [Confluence REST API Documentation](https://developer.atlassian.com/cloud/confluence/rest/v2/intro/)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [Claude Code Documentation](https://docs.anthropic.com/claude/docs/claude-code)

## Support

For issues or questions:
- Check the project README.md
- Review the Confluence MCP server README
- Check Claude Code documentation at `/help`
