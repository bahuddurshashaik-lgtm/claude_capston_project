# MCP Setup Script for Agentic SDLC (PowerShell)
# Repository: https://github.com/bahuddurshashaik-lgtm/claude_capston_project

Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   MCP Configuration Setup                             ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if .claude directory exists
if (-not (Test-Path ".claude")) {
    Write-Host "Creating .claude directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path ".claude" -Force | Out-Null
}

# Check if settings.json exists
if (-not (Test-Path ".claude/settings.json")) {
    Write-Host "✗ .claude/settings.json not found" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory"
    exit 1
}

Write-Host "✓ Found .claude/settings.json" -ForegroundColor Green
Write-Host ""

# Check for GitHub token
Write-Host "Checking GitHub token..."
$settingsContent = Get-Content ".claude/settings.json" -Raw
if ($settingsContent -match "YOUR_GITHUB_TOKEN_HERE") {
    Write-Host "⚠ GitHub token not configured" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To set up GitHub MCP:" -ForegroundColor Cyan
    Write-Host "1. Go to https://github.com/settings/tokens"
    Write-Host "2. Click 'Generate new token (classic)'"
    Write-Host "3. Select scopes: repo, workflow, write:packages, read:org, gist"
    Write-Host "4. Copy the token"
    Write-Host "5. Run this script or manually update .claude/settings.json"
    Write-Host ""

    $response = Read-Host "Do you have a GitHub token ready? (y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        $token = Read-Host "Enter your GitHub token" -AsSecureString
        $plainToken = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
            [Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
        )

        if ($plainToken) {
            $settingsContent = $settingsContent -replace "YOUR_GITHUB_TOKEN_HERE", $plainToken
            Set-Content -Path ".claude/settings.json" -Value $settingsContent
            Write-Host "✓ GitHub token configured" -ForegroundColor Green
        }
    }
} else {
    Write-Host "✓ GitHub token is configured" -ForegroundColor Green
}

Write-Host ""

# Check Confluence MCP
Write-Host "Checking Confluence MCP..."
if (Test-Path "src/mcp-servers/confluence/.env") {
    Write-Host "✓ Confluence MCP configured" -ForegroundColor Green
} else {
    Write-Host "⚠ Confluence .env not found" -ForegroundColor Yellow
    if (Test-Path "src/mcp-servers/confluence/.env.example") {
        Write-Host "Creating .env from .env.example..."
        Copy-Item "src/mcp-servers/confluence/.env.example" "src/mcp-servers/confluence/.env"
        Write-Host "✓ Created src/mcp-servers/confluence/.env" -ForegroundColor Green
        Write-Host "  Please update with your actual credentials" -ForegroundColor Yellow
    }
}

Write-Host ""

# Check Confluence MCP dependencies
Write-Host "Checking Confluence MCP dependencies..."
if (Test-Path "src/mcp-servers/confluence/node_modules") {
    Write-Host "✓ Confluence MCP dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠ Installing Confluence MCP dependencies..." -ForegroundColor Yellow
    Push-Location src/mcp-servers/confluence
    npm install
    Pop-Location
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
}

Write-Host ""

# Verify .gitignore
Write-Host "Checking .gitignore..."
$gitignoreContent = Get-Content ".gitignore" -Raw -ErrorAction SilentlyContinue
if ($gitignoreContent -match ".claude/settings.json") {
    Write-Host "✓ .gitignore protects secrets" -ForegroundColor Green
} else {
    Write-Host "⚠ Adding .claude/settings.json to .gitignore" -ForegroundColor Yellow
    Add-Content -Path ".gitignore" -Value "`n# MCP Configuration with secrets`n.claude/settings.json`n.claude/settings.local.json"
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "MCP Setup Status" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Summary
$settingsContent = Get-Content ".claude/settings.json" -Raw
if ($settingsContent -match "YOUR_GITHUB_TOKEN_HERE") {
    Write-Host "GitHub MCP: " -NoNewline
    Write-Host "Not configured - Add token to .claude/settings.json" -ForegroundColor Yellow
} else {
    Write-Host "GitHub MCP: " -NoNewline
    Write-Host "Ready ✓" -ForegroundColor Green
}

if (Test-Path "src/mcp-servers/confluence/.env") {
    Write-Host "Confluence MCP: " -NoNewline
    Write-Host "Configured ✓" -ForegroundColor Green
} else {
    Write-Host "Confluence MCP: " -NoNewline
    Write-Host "Needs configuration" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Ensure GitHub token is set in .claude/settings.json"
Write-Host "2. Restart Claude Code: claude daemon restart"
Write-Host "3. Test GitHub MCP: 'List issues in repository'"
Write-Host "4. Test Confluence MCP: 'Read HB-001 from Confluence'"
Write-Host ""
Write-Host "For detailed instructions, see: MCP_SETUP_GUIDE.md"
Write-Host ""
