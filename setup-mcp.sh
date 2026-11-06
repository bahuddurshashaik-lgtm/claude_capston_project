#!/bin/bash

# MCP Setup Script for Agentic SDLC
# Repository: https://github.com/bahuddurshashaik-lgtm/claude_capston_project

echo "╔═══════════════════════════════════════════════════════╗"
echo "║   MCP Configuration Setup                             ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .claude directory exists
if [ ! -d ".claude" ]; then
    echo -e "${YELLOW}Creating .claude directory...${NC}"
    mkdir -p .claude
fi

# Check if settings.json exists
if [ ! -f ".claude/settings.json" ]; then
    echo -e "${RED}✗ .claude/settings.json not found${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo -e "${GREEN}✓ Found .claude/settings.json${NC}"
echo ""

# Check for GitHub token
echo "Checking GitHub token..."
if grep -q "YOUR_GITHUB_TOKEN_HERE" .claude/settings.json; then
    echo -e "${YELLOW}⚠ GitHub token not configured${NC}"
    echo ""
    echo "To set up GitHub MCP:"
    echo "1. Go to https://github.com/settings/tokens"
    echo "2. Click 'Generate new token (classic)'"
    echo "3. Select scopes: repo, workflow, write:packages, read:org, gist"
    echo "4. Copy the token"
    echo "5. Replace 'YOUR_GITHUB_TOKEN_HERE' in .claude/settings.json"
    echo ""
    read -p "Do you have a GitHub token ready? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your GitHub token: " GITHUB_TOKEN
        if [ -n "$GITHUB_TOKEN" ]; then
            # Replace token in settings.json (macOS/Linux compatible)
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s/YOUR_GITHUB_TOKEN_HERE/$GITHUB_TOKEN/" .claude/settings.json
            else
                sed -i "s/YOUR_GITHUB_TOKEN_HERE/$GITHUB_TOKEN/" .claude/settings.json
            fi
            echo -e "${GREEN}✓ GitHub token configured${NC}"
        fi
    fi
else
    echo -e "${GREEN}✓ GitHub token is configured${NC}"
fi

echo ""

# Check Confluence MCP
echo "Checking Confluence MCP..."
if [ -f "src/mcp-servers/confluence/.env" ]; then
    echo -e "${GREEN}✓ Confluence MCP configured${NC}"
else
    echo -e "${YELLOW}⚠ Confluence .env not found${NC}"
    if [ -f "src/mcp-servers/confluence/.env.example" ]; then
        echo "Creating .env from .env.example..."
        cp src/mcp-servers/confluence/.env.example src/mcp-servers/confluence/.env
        echo -e "${GREEN}✓ Created src/mcp-servers/confluence/.env${NC}"
        echo -e "${YELLOW}  Please update with your actual credentials${NC}"
    fi
fi

echo ""

# Check Confluence MCP dependencies
echo "Checking Confluence MCP dependencies..."
if [ -d "src/mcp-servers/confluence/node_modules" ]; then
    echo -e "${GREEN}✓ Confluence MCP dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠ Installing Confluence MCP dependencies...${NC}"
    cd src/mcp-servers/confluence
    npm install
    cd ../../..
    echo -e "${GREEN}✓ Dependencies installed${NC}"
fi

echo ""

# Verify .gitignore
echo "Checking .gitignore..."
if grep -q ".claude/settings.json" .gitignore; then
    echo -e "${GREEN}✓ .gitignore protects secrets${NC}"
else
    echo -e "${YELLOW}⚠ Adding .claude/settings.json to .gitignore${NC}"
    echo "" >> .gitignore
    echo "# MCP Configuration with secrets" >> .gitignore
    echo ".claude/settings.json" >> .gitignore
    echo ".claude/settings.local.json" >> .gitignore
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "MCP Setup Status"
echo "═══════════════════════════════════════════════════════"
echo ""

# Summary
if grep -q "YOUR_GITHUB_TOKEN_HERE" .claude/settings.json; then
    echo -e "${YELLOW}GitHub MCP:${NC} Not configured - Add token to .claude/settings.json"
else
    echo -e "${GREEN}GitHub MCP:${NC} Ready ✓"
fi

if [ -f "src/mcp-servers/confluence/.env" ]; then
    echo -e "${GREEN}Confluence MCP:${NC} Configured ✓"
else
    echo -e "${YELLOW}Confluence MCP:${NC} Needs configuration"
fi

echo ""
echo "Next steps:"
echo "1. Ensure GitHub token is set in .claude/settings.json"
echo "2. Restart Claude Code: claude daemon restart"
echo "3. Test GitHub MCP: 'List issues in repository'"
echo "4. Test Confluence MCP: 'Read HB-001 from Confluence'"
echo ""
echo "For detailed instructions, see: MCP_SETUP_GUIDE.md"
echo ""
