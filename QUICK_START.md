# Quick Start Guide

Get up and running with the Agentic SDLC Capstone Project in 5 minutes!

## 🚀 Quick Setup (5 steps)

### 1. Install Dependencies
```bash
cd src/mcp-servers/confluence
npm install
```

### 2. Configure Confluence
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# Get API token from: https://id.atlassian.com/manage-profile/security/api-tokens
```

### 3. Create User Stories in Confluence
```bash
node create-user-stories.js
```

### 4. Configure Claude Code

**Windows**: Edit `%USERPROFILE%\.claude\settings.json`

**Mac/Linux**: Edit `~/.claude/settings.json`

```json
{
  "mcpServers": {
    "confluence": {
      "command": "node",
      "args": ["FULL_PATH_TO/src/mcp-servers/confluence/index.js"],
      "env": {
        "CONFLUENCE_BASE_URL": "https://bahuddurshashaik.atlassian.net/wiki",
        "CONFLUENCE_EMAIL": "your-email@example.com",
        "CONFLUENCE_API_TOKEN": "your-token-here",
        "CONFLUENCE_SPACE_KEY": "ClaudeCpas"
      }
    }
  }
}
```

### 5. Restart Claude Code

Restart Claude Code to load the MCP server.

## ✅ Verify Setup

Test in Claude Code:
```
List all pages in Confluence
```

You should see your 5 user stories!

## 📋 The 5 User Stories

1. **US-001**: Requirements Gathering and Documentation
2. **US-002**: Architecture Design Automation
3. **US-003**: Automated Design Review
4. **US-004**: Implementation Planning and Task Breakdown
5. **US-005**: Automated Code Review and PR Creation

## 🎯 Start Your First SDLC Cycle

```
Read US-001 from Confluence and let's start the requirements phase
```

## 📚 Full Documentation

- **Setup Details**: See [SETUP.md](SETUP.md)
- **Workflow Guide**: See [docs/AGENTIC_SDLC_WORKFLOW.md](docs/AGENTIC_SDLC_WORKFLOW.md)
- **Project Info**: See [README.md](README.md)

## 🆘 Troubleshooting

### Can't connect to Confluence?
- Check your API token is correct
- Verify your email address
- Ensure space key matches (case-sensitive)

### MCP server not found?
- Use absolute paths in settings.json
- Restart Claude Code after changes
- Check Node.js is installed: `node --version`

### User stories not created?
- Check Confluence permissions
- Verify space key exists
- Look for error messages in console

## 🎓 Learning Path

1. ✅ Setup (you're here!)
2. 📖 Read AGENTIC_SDLC_WORKFLOW.md
3. 🔄 Run through one complete SDLC cycle
4. 🚀 Build your own features

## 💡 Pro Tips

- Keep all documents in sync
- Reference docs by name (requirements.md, architecture.md)
- Ask Claude to explain anything unclear
- Iterate and refine your process
- Document lessons learned

## 🔗 Useful Links

- **Confluence Space**: https://bahuddurshashaik.atlassian.net/wiki/spaces/ClaudeCpas/overview
- **API Tokens**: https://id.atlassian.com/manage-profile/security/api-tokens
- **MCP Docs**: https://modelcontextprotocol.io/

---

**Ready to build something amazing? Let's go! 🚀**
