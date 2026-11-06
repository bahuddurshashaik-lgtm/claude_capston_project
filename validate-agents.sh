#!/bin/bash

# SDLC Agent Validation Script
# Validates all 9 agents are properly configured

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║          SDLC AGENT VALIDATION SCRIPT                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

AGENTS_DIR=".github/agents"
PROMPTS_DIR=".github/prompts"
INSTRUCTIONS_DIR=".github/instructions"

PASSED=0
FAILED=0

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "📋 Checking Agent Files..."
echo ""

# Array of required agents
declare -a REQUIRED_AGENTS=(
    "requirements-analyst"
    "solution-architect"
    "design-reviewer"
    "implementation-planner"
    "implementer"
    "code-reviewer"
    "verifier"
    "pr-author"
    "sdlc-orchestrator"
)

# Check each agent file
for agent in "${REQUIRED_AGENTS[@]}"; do
    file="$AGENTS_DIR/$agent.agent.md"
    if [ -f "$file" ]; then
        # Check if file has content
        if [ -s "$file" ]; then
            # Check if file has frontmatter
            if grep -q "^---" "$file"; then
                echo -e "${GREEN}✅${NC} $agent.agent.md (exists, valid)"
                ((PASSED++))
            else
                echo -e "${RED}❌${NC} $agent.agent.md (missing frontmatter)"
                ((FAILED++))
            fi
        else
            echo -e "${RED}❌${NC} $agent.agent.md (empty file)"
            ((FAILED++))
        fi
    else
        echo -e "${RED}❌${NC} $agent.agent.md (missing)"
        ((FAILED++))
    fi
done

echo ""
echo "📋 Checking Prompt Files..."
echo ""

# Array of required prompts
declare -a REQUIRED_PROMPTS=(
    "01-requirements"
    "02-architecture"
    "03-design-review"
    "04-impl-plan"
    "05-implement"
    "06-code-review"
    "07-verify"
    "08-pr"
)

for prompt in "${REQUIRED_PROMPTS[@]}"; do
    file="$PROMPTS_DIR/$prompt.prompt.md"
    if [ -f "$file" ]; then
        if [ -s "$file" ]; then
            echo -e "${GREEN}✅${NC} $prompt.prompt.md (exists)"
            ((PASSED++))
        else
            echo -e "${RED}❌${NC} $prompt.prompt.md (empty)"
            ((FAILED++))
        fi
    else
        echo -e "${RED}❌${NC} $prompt.prompt.md (missing)"
        ((FAILED++))
    fi
done

echo ""
echo "📋 Checking Instruction Files..."
echo ""

declare -a REQUIRED_INSTRUCTIONS=(
    "coding-standards"
    "documentation"
)

for instruction in "${REQUIRED_INSTRUCTIONS[@]}"; do
    file="$INSTRUCTIONS_DIR/$instruction.instructions.md"
    if [ -f "$file" ]; then
        if [ -s "$file" ]; then
            echo -e "${GREEN}✅${NC} $instruction.instructions.md (exists)"
            ((PASSED++))
        else
            echo -e "${RED}❌${NC} $instruction.instructions.md (empty)"
            ((FAILED++))
        fi
    else
        echo -e "${RED}❌${NC} $instruction.instructions.md (missing)"
        ((FAILED++))
    fi
done

echo ""
echo "📋 Checking Project Structure..."
echo ""

# Check required directories
declare -a REQUIRED_DIRS=(
    "src/models"
    "src/services"
    "tests/unit"
    "tests/integration"
    "docs/sdlc"
    "docs/user-stories"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅${NC} $dir/ (exists)"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} $dir/ (missing)"
        ((FAILED++))
    fi
done

echo ""
echo "📋 Checking Documentation..."
echo ""

declare -a REQUIRED_DOCS=(
    "README.md"
    "USER_STORIES.md"
    "TEST_COVERAGE.md"
    "PROJECT_STRUCTURE.md"
    "ORCHESTRATION_GUIDE.md"
)

for doc in "${REQUIRED_DOCS[@]}"; do
    if [ -f "$doc" ]; then
        if [ -s "$doc" ]; then
            echo -e "${GREEN}✅${NC} $doc (exists)"
            ((PASSED++))
        else
            echo -e "${RED}❌${NC} $doc (empty)"
            ((FAILED++))
        fi
    else
        echo -e "${RED}❌${NC} $doc (missing)"
        ((FAILED++))
    fi
done

echo ""
echo "📋 Checking Configuration..."
echo ""

declare -a REQUIRED_CONFIG=(
    "package.json"
    "jest.config.js"
    ".gitignore"
)

for config in "${REQUIRED_CONFIG[@]}"; do
    if [ -f "$config" ]; then
        echo -e "${GREEN}✅${NC} $config (exists)"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} $config (missing)"
        ((FAILED++))
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

TOTAL=$((PASSED + FAILED))
PERCENTAGE=$((PASSED * 100 / TOTAL))

echo "📊 Validation Results:"
echo ""
echo "   Total Checks: $TOTAL"
echo -e "   ${GREEN}Passed: $PASSED${NC}"
echo -e "   ${RED}Failed: $FAILED${NC}"
echo "   Success Rate: $PERCENTAGE%"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   ✅ ALL VALIDATIONS PASSED - ORCHESTRATION READY!          ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    echo -e "${RED}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║   ❌ VALIDATION FAILED - FIX ISSUES BEFORE ORCHESTRATION     ║${NC}"
    echo -e "${RED}╚══════════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi
