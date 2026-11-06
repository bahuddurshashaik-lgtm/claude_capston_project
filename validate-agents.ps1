# SDLC Agent Validation Script (PowerShell)
# Validates all 9 agents are properly configured

Write-Host "╔══════════════════════════════════════════════════════════════╗"
Write-Host "║          SDLC AGENT VALIDATION SCRIPT                        ║"
Write-Host "╚══════════════════════════════════════════════════════════════╝"
Write-Host ""

$AGENTS_DIR = ".github/agents"
$PROMPTS_DIR = ".github/prompts"
$INSTRUCTIONS_DIR = ".github/instructions"

$PASSED = 0
$FAILED = 0

Write-Host "📋 Checking Agent Files..."
Write-Host ""

# Array of required agents
$REQUIRED_AGENTS = @(
    "requirements-analyst",
    "solution-architect",
    "design-reviewer",
    "implementation-planner",
    "implementer",
    "code-reviewer",
    "verifier",
    "pr-author",
    "sdlc-orchestrator"
)

# Check each agent file
foreach ($agent in $REQUIRED_AGENTS) {
    $file = "$AGENTS_DIR/$agent.agent.md"
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        if ($content.Length -gt 0) {
            if ($content -match "^---") {
                Write-Host "✅ $agent.agent.md (exists, valid)" -ForegroundColor Green
                $PASSED++
            } else {
                Write-Host "❌ $agent.agent.md (missing frontmatter)" -ForegroundColor Red
                $FAILED++
            }
        } else {
            Write-Host "❌ $agent.agent.md (empty file)" -ForegroundColor Red
            $FAILED++
        }
    } else {
        Write-Host "❌ $agent.agent.md (missing)" -ForegroundColor Red
        $FAILED++
    }
}

Write-Host ""
Write-Host "📋 Checking Prompt Files..."
Write-Host ""

$REQUIRED_PROMPTS = @(
    "01-requirements",
    "02-architecture",
    "03-design-review",
    "04-impl-plan",
    "05-implement",
    "06-code-review",
    "07-verify",
    "08-pr"
)

foreach ($prompt in $REQUIRED_PROMPTS) {
    $file = "$PROMPTS_DIR/$prompt.prompt.md"
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        if ($size -gt 0) {
            Write-Host "✅ $prompt.prompt.md (exists)" -ForegroundColor Green
            $PASSED++
        } else {
            Write-Host "❌ $prompt.prompt.md (empty)" -ForegroundColor Red
            $FAILED++
        }
    } else {
        Write-Host "❌ $prompt.prompt.md (missing)" -ForegroundColor Red
        $FAILED++
    }
}

Write-Host ""
Write-Host "📋 Checking Instruction Files..."
Write-Host ""

$REQUIRED_INSTRUCTIONS = @(
    "coding-standards",
    "documentation"
)

foreach ($instruction in $REQUIRED_INSTRUCTIONS) {
    $file = "$INSTRUCTIONS_DIR/$instruction.instructions.md"
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        if ($size -gt 0) {
            Write-Host "✅ $instruction.instructions.md (exists)" -ForegroundColor Green
            $PASSED++
        } else {
            Write-Host "❌ $instruction.instructions.md (empty)" -ForegroundColor Red
            $FAILED++
        }
    } else {
        Write-Host "❌ $instruction.instructions.md (missing)" -ForegroundColor Red
        $FAILED++
    }
}

Write-Host ""
Write-Host "📋 Checking Project Structure..."
Write-Host ""

$REQUIRED_DIRS = @(
    "src/models",
    "src/services",
    "tests/unit",
    "tests/integration",
    "docs/sdlc",
    "docs/user-stories"
)

foreach ($dir in $REQUIRED_DIRS) {
    if (Test-Path $dir -PathType Container) {
        Write-Host "✅ $dir/ (exists)" -ForegroundColor Green
        $PASSED++
    } else {
        Write-Host "❌ $dir/ (missing)" -ForegroundColor Red
        $FAILED++
    }
}

Write-Host ""
Write-Host "📋 Checking Documentation..."
Write-Host ""

$REQUIRED_DOCS = @(
    "README.md",
    "USER_STORIES.md",
    "TEST_COVERAGE.md",
    "PROJECT_STRUCTURE.md",
    "ORCHESTRATION_GUIDE.md"
)

foreach ($doc in $REQUIRED_DOCS) {
    if (Test-Path $doc) {
        $size = (Get-Item $doc).Length
        if ($size -gt 0) {
            Write-Host "✅ $doc (exists)" -ForegroundColor Green
            $PASSED++
        } else {
            Write-Host "❌ $doc (empty)" -ForegroundColor Red
            $FAILED++
        }
    } else {
        Write-Host "❌ $doc (missing)" -ForegroundColor Red
        $FAILED++
    }
}

Write-Host ""
Write-Host "📋 Checking Configuration..."
Write-Host ""

$REQUIRED_CONFIG = @(
    "package.json",
    "jest.config.js",
    ".gitignore"
)

foreach ($config in $REQUIRED_CONFIG) {
    if (Test-Path $config) {
        Write-Host "✅ $config (exists)" -ForegroundColor Green
        $PASSED++
    } else {
        Write-Host "❌ $config (missing)" -ForegroundColor Red
        $FAILED++
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""

$TOTAL = $PASSED + $FAILED
$PERCENTAGE = [math]::Round(($PASSED * 100 / $TOTAL), 2)

Write-Host "📊 Validation Results:"
Write-Host ""
Write-Host "   Total Checks: $TOTAL"
Write-Host "   Passed: $PASSED" -ForegroundColor Green
Write-Host "   Failed: $FAILED" -ForegroundColor Red
Write-Host "   Success Rate: $PERCENTAGE%"
Write-Host ""

if ($FAILED -eq 0) {
    Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║   ✅ ALL VALIDATIONS PASSED - ORCHESTRATION READY!          ║" -ForegroundColor Green
    Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    exit 0
} else {
    Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Red
    Write-Host "║   ❌ VALIDATION FAILED - FIX ISSUES BEFORE ORCHESTRATION     ║" -ForegroundColor Red
    Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Red
    exit 1
}
