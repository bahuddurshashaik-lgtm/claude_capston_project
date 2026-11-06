# MCP Configuration Guide

This guide explains how to use the `mcp.json` configuration file with Claude Code.

## What is mcp.json?

The `mcp.json` file is a configuration file that defines Model Context Protocol (MCP) servers for Claude Code. It specifies which external tools and services Claude Code can interact with.

## Our mcp.json Configuration

```json
{
  "mcpServers": {
    "confluence": {
      "command": "node",
      "args": ["src/mcp-servers/confluence/index.js"],
      "env": {
        "CONFLUENCE_BASE_URL": "https://bahuddurshashaik.atlassian.net/wiki",
        "CONFLUENCE_EMAIL": "",
        "CONFLUENCE_API_TOKEN": "",
        "CONFLUENCE_SPACE_KEY": "ClaudeCpas"
      },
      "description": "Confluence MCP server for reading and writing user stories",
      "disabled": false
    }
  },
  "version": "1.0.0",
  "description": "MCP server configuration for Agentic SDLC Capstone Project"
}
```

## Using mcp.json with Claude Code

### Option 1: Project-Level Configuration (Recommended)

Keep the `mcp.json` file in your project root and Claude Code will automatically detect it.

**Pros:**
- ✅ Project-specific configuration
- ✅ Version controlled with your code
- ✅ Easy to share with team members
- ✅ Different projects can have different MCP servers

**Setup:**
1. The `mcp.json` is already in the project root
2. Update the `CONFLUENCE_EMAIL` and `CONFLUENCE_API_TOKEN` fields
3. Restart Claude Code
4. Claude Code will load the configuration automatically

### Option 2: Global Configuration

Add the configuration to Claude Code's global settings file.

**Location:**
- **Windows**: `%USERPROFILE%\.claude\settings.json`
- **Mac/Linux**: `~/.claude/settings.json`

**Setup:**
1. Open your global settings file
2. Merge the `mcpServers` section from `mcp.json`
3. Update paths to be absolute
4. Restart Claude Code

**Example Global Configuration:**
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
      },
      "description": "Confluence MCP server for reading and writing user stories",
      "disabled": false
    }
  }
}
```

## Configuration Fields Explained

### Required Fields

- **`command`**: The executable to run (e.g., `node`, `python`, `deno`)
- **`args`**: Array of arguments passed to the command
  - For project-level: Use relative paths
  - For global config: Use absolute paths

### Optional Fields

- **`env`**: Environment variables for the MCP server
  - Contains credentials and configuration
  - **Never commit sensitive values to git**
- **`description`**: Human-readable description of what the server does
- **`disabled`**: Set to `true` to temporarily disable the server

## Setting Up Credentials

### Method 1: Using .env File (Recommended for Development)

1. Navigate to the MCP server directory:
   ```bash
   cd src/mcp-servers/confluence
   ```

2. Create `.env` from template:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your credentials:
   ```env
   CONFLUENCE_EMAIL=your-email@example.com
   CONFLUENCE_API_TOKEN=your-api-token-here
   ```

4. The MCP server will load these automatically

### Method 2: Inline in mcp.json (Simpler)

Update the `env` section directly in `mcp.json`:

```json
"env": {
  "CONFLUENCE_BASE_URL": "https://bahuddurshashaik.atlassian.net/wiki",
  "CONFLUENCE_EMAIL": "your-email@example.com",
  "CONFLUENCE_API_TOKEN": "your-token-here",
  "CONFLUENCE_SPACE_KEY": "ClaudeCpas"
}
```

⚠️ **Security Warning**: If using this method, make sure `mcp.json` is in `.gitignore` or use a separate `mcp.local.json` that is gitignored.

## Getting Your Confluence API Token

1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a name (e.g., "Claude Code MCP")
4. Copy the generated token
5. Save it securely (you won't be able to see it again)

## Verifying the Configuration

### Test the MCP Server Directly

```bash
cd src/mcp-servers/confluence
npm install
node index.js
```

You should see: `Confluence MCP Server running on stdio`

Press Ctrl+C to stop.

### Test with Claude Code

1. Restart Claude Code after configuration changes
2. Try these commands:

```
List all pages in Confluence
```

```
Search Confluence for "hotel booking"
```

```
Get the page titled "HB-001: Hotel Search and Browse"
```

If the MCP server is working, Claude Code will be able to execute these commands.

## Troubleshooting

### "MCP server not found"
- ✅ Check that the path in `args` is correct
- ✅ Use absolute paths for global configuration
- ✅ Verify Node.js is installed: `node --version`
- ✅ Restart Claude Code after changes

### "Authentication failed"
- ✅ Verify your email is correct
- ✅ Check that your API token hasn't expired
- ✅ Generate a new API token if needed
- ✅ Ensure you have access to the Confluence space

### "Cannot find module"
- ✅ Run `npm install` in the confluence directory
- ✅ Check that all dependencies are installed
- ✅ Verify the working directory is correct

### MCP server works locally but not in Claude Code
- ✅ Check environment variables are set correctly
- ✅ Verify the `command` field points to the right executable
- ✅ Look at Claude Code logs for error messages
- ✅ Try using absolute paths instead of relative

## Creating User Stories in Confluence

Once the MCP server is configured, you can create the hotel booking user stories:

```bash
cd src/mcp-servers/confluence
node create-hotel-booking-stories.js
```

This will create 5 user stories (HB-001 through HB-005) in your Confluence space.

## Using the MCP Server with Claude Code

Once configured, you can interact with Confluence naturally:

### Read User Stories
```
Read HB-001 from Confluence and summarize the requirements
```

### Create Pages
```
Create a new page in Confluence titled "Architecture Design" with the following content: [content]
```

### Search
```
Search Confluence for all pages related to hotel booking
```

### Update Pages
```
Update the page "Requirements Document" with the revised requirements
```

## Advanced Configuration

### Multiple MCP Servers

You can configure multiple MCP servers in the same `mcp.json`:

```json
{
  "mcpServers": {
    "confluence": {
      "command": "node",
      "args": ["src/mcp-servers/confluence/index.js"],
      "env": { /* ... */ }
    },
    "jira": {
      "command": "node",
      "args": ["src/mcp-servers/jira/index.js"],
      "env": { /* ... */ }
    },
    "github": {
      "command": "node",
      "args": ["src/mcp-servers/github/index.js"],
      "env": { /* ... */ }
    }
  }
}
```

### Conditional Enabling

Disable servers you don't need:

```json
"confluence": {
  "command": "node",
  "args": ["src/mcp-servers/confluence/index.js"],
  "disabled": true  // Temporarily disabled
}
```

## Best Practices

1. **Security**
   - Never commit API tokens to version control
   - Use environment variables or separate config files
   - Add `mcp.local.json` to `.gitignore`
   - Rotate API tokens regularly

2. **Development**
   - Use project-level `mcp.json` for team sharing
   - Keep credentials in `.env` files
   - Document all MCP servers in README
   - Test MCP servers independently before integration

3. **Production**
   - Use environment-specific configurations
   - Implement proper error handling
   - Monitor MCP server health
   - Log all interactions for debugging

## Additional Resources

- [MCP Protocol Documentation](https://modelcontextprotocol.io/)
- [Confluence REST API](https://developer.atlassian.com/cloud/confluence/rest/v2/intro/)
- [Claude Code Documentation](https://docs.anthropic.com/claude/docs/claude-code)
- [Project Setup Guide](../SETUP.md)

## Support

For issues with MCP configuration:
1. Check this guide's troubleshooting section
2. Review the [SETUP.md](../SETUP.md) file
3. Verify your Confluence credentials
4. Test the MCP server independently
5. Check Claude Code logs for errors
