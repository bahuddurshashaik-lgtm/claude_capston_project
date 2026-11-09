# Hotel Booking System - Agentic SDLC

> Complete hotel booking application built using AI agents with full SDLC automation

## 🎯 Overview

This project demonstrates an **automated SDLC workflow** using 8 specialized AI agents that deliver features from requirements to production-ready code.

**Features:**
- 5 user stories implemented (39 story points)
- 99.2% test coverage (137 tests)
- Complete SDLC automation
- Human approval gates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Claude Code CLI

### Database Setup
```bash
# 1. Create database and user (see DATABASE_SETUP.md for details)
createdb hotel_booking
psql -c "CREATE USER hotel_app WITH PASSWORD 'secure_password';"

# 2. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 3. Run migrations
npm run migrate:latest

# 4. Seed test data
npm run seed:run
```

### Run the Application
```bash
npm start          # Run hotel booking API server
npm run dev        # Run with nodemon (auto-reload)
npm test           # Run all tests with coverage
npm run test:watch # Run tests in watch mode
```

### Run the SDLC Orchestrator
```bash
# In Claude Code:
@sdlc-orchestrator

# The orchestrator will:
# 1. Ask which user story to implement (HB-001 to HB-005)
# 2. Run 8 agents in sequence with approval gates
# 3. Generate 7 .md files in docs/sdlc/
# 4. Create code + tests
# 5. Prepare PR description
```

## 📋 User Stories

| ID | Story | Priority | Points | Status |
|----|-------|----------|--------|--------|
| HB-001 | Hotel Search and Browse | High | 8 | ✅ |
| HB-002 | Hotel Booking and Reservation | High | 8 | ✅ |
| HB-003 | Payment Processing | High | 13 | ✅ |
| HB-004 | User Authentication and Profiles | Medium | 5 | ✅ |
| HB-005 | Booking Management and Cancellation | Medium | 5 | ✅ |

See [`docs/user-stories/user-stories.md`](./docs/user-stories/user-stories.md) for details.

## 🤖 The 8-Agent SDLC Pipeline

When you run `@sdlc-orchestrator`, these agents run in sequence:

1. **requirements-analyst** → `docs/sdlc/{story-id}-requirements.md`
2. **solution-architect** → `docs/sdlc/{story-id}-architecture.md`
3. **design-reviewer** → `docs/sdlc/{story-id}-design-review.md`
4. **implementation-planner** → `docs/sdlc/{story-id}-impl-plan.md`
5. **implementer** → Code in `src/` + tests in `tests/`
6. **code-reviewer** → `docs/sdlc/{story-id}-code-review.md`
7. **verifier** → `docs/sdlc/{story-id}-verification.md`
8. **pr-author** → `docs/sdlc/{story-id}-pr-description.md` + `CHANGELOG.md`

**Human approval required between each step.**

## 📁 Project Structure

```
.
├── .github/agents/           # 9 AI agents (orchestrator + 8 specialists)
├── docs/
│   ├── api/                 # API documentation
│   ├── user-stories/        # User stories (source of truth)
│   └── sdlc/                # Agent-generated artifacts
├── src/
│   ├── config/              # Database and app configuration
│   ├── controllers/         # HTTP request handlers
│   ├── middleware/          # Express middleware (validation, errors, rate limiting, CORS)
│   ├── models/              # Entity models
│   ├── repositories/        # Data access layer
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── utils/               # Utilities (logger, validators, constants)
│   ├── app.js               # Express application
│   └── server.js            # Server startup
├── migrations/              # Database migrations
├── seeds/                   # Database seed data
├── tests/
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── fixtures/           # Test data fixtures
├── logs/                    # Application logs
├── mcp.json                 # MCP configuration (GitHub)
├── knexfile.js              # Knex configuration
├── .env                     # Environment variables (git-ignored)
├── package.json
├── README.md                # This file
├── DATABASE_SETUP.md        # Database setup guide
├── TESTING_GUIDE.md         # Testing documentation
└── CHANGELOG.md             # Version history
```

## 🔧 MCP Configuration (GitHub Integration)

### Setup Steps

1. **Create `.env` file** with your tokens:
   ```bash
   # GitHub Token (get from: https://github.com/settings/tokens)
   GITHUB_TOKEN=ghp_your_token_here
   
   # Confluence Token (get from: https://id.atlassian.com/manage-profile/security/api-tokens)
   CONFLUENCE_BASE_URL=https://yourname.atlassian.net/wiki
   CONFLUENCE_EMAIL=your@email.com
   CONFLUENCE_API_TOKEN=your_token
   CONFLUENCE_SPACE_KEY=YourSpace
   ```

2. **MCP is auto-configured in `mcp.json`** (GitHub + Confluence servers)

The pr-author agent uses this to create pull requests automatically.

## 🧪 Testing

### Test Coverage: 99.2%

```bash
npm test                    # Run all tests
npm run test:coverage      # Coverage report
```

**Coverage:**
- Statements: 99.2%
- Branches: 94.73%
- Functions: 100%
- Lines: 99.14%

### Test Distribution
- Unit tests: 89
- Integration tests: 48
- **Total: 137 tests**

## 📊 Features

### HB-001: Hotel Search (Production-Ready)
- ✅ RESTful API with `/api/v1/hotels/search` endpoint
- ✅ PostgreSQL database with pg_trgm indexes for fast search
- ✅ Search by location (city/region) with partial matching
- ✅ Filter by price range and minimum rating
- ✅ Sort by price or rating (4 options)
- ✅ View hotel details with amenities
- ✅ Pagination support (100 results per page)
- ✅ Rate limiting (100 req/min per IP)
- ✅ CORS and security headers configured
- ✅ Comprehensive validation with Joi
- ✅ 80%+ test coverage (unit + integration)

### HB-002: Booking
- Create reservations with dates
- Date validation
- Automatic pricing

### HB-003: Payment
- Multiple payment methods
- Card validation (Luhn)
- Refund processing

### HB-004: Authentication
- User registration
- Email/password validation
- Profile management

### HB-005: Booking Management
- View bookings
- Modify reservations
- Cancel with refunds

## 🛠️ Technology Stack

### Backend
- **Language:** JavaScript (ES6+)
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.x
- **Database:** PostgreSQL 14+ with pg_trgm extension
- **Query Builder:** Knex.js 2.x
- **Testing:** Jest 29.x + Supertest 6.x
- **Validation:** Joi 17.x
- **Logging:** Winston 3.x
- **Security:** Helmet, CORS, express-rate-limit
- **Architecture:** Layered (Controllers → Services → Repositories → Database)
- **AI/Automation:** Claude Code (8 agents)

## 📖 How the Orchestrator Works

### Example Session

```bash
# Start orchestrator
@sdlc-orchestrator

# It asks: Which user story? (HB-001 to HB-005)
You: HB-001

# Step 1/8: Requirements Analysis
# → Generates: docs/sdlc/HB-001-requirements.md
# → Asks: Approve to continue? (yes/no)

# Step 2/8: Solution Architecture
# → Generates: docs/sdlc/HB-001-architecture.md
# → Asks: Approve to continue? (yes/no)

# ... continues through all 8 steps ...

# Step 8/8: PR Preparation
# → Generates: docs/sdlc/HB-001-pr-description.md
# → Updates: CHANGELOG.md

# Done! Ready to create PR.
```

### What Gets Generated

For each user story (e.g., HB-001):

```
docs/sdlc/
├── HB-001-requirements.md
├── HB-001-architecture.md
├── HB-001-design-review.md
├── HB-001-impl-plan.md
├── HB-001-code-review.md
├── HB-001-verification.md
└── HB-001-pr-description.md

src/
└── [new/modified code]

tests/
└── [new tests]

CHANGELOG.md (updated)
```

## 🔒 Validation Rules

### Bookings
- Check-in must be future date
- Check-out after check-in

### Payments
- Valid methods: credit_card, debit_card, paypal
- Card validation via Luhn algorithm

### Users
- Valid email format
- Password: 8+ chars, uppercase, lowercase, number

## 🎓 Key Benefits

✅ **Automated SDLC** - 8 agents handle the entire workflow  
✅ **High Quality** - 99.2% test coverage automatically  
✅ **Complete Docs** - 7 artifacts per feature  
✅ **Human Control** - Approval gates between steps  
✅ **Consistent** - Same process every time  

## 🚀 Next Steps

### For New Features
1. Run `@sdlc-orchestrator`
2. Choose user story
3. Approve each of 8 steps
4. Review generated code and docs
5. Create PR from pr-description.md

### For Code Changes
```bash
# Make changes
npm test                 # Verify tests pass
git add .
git commit -m "feat: your message"
git push
```

## 📞 Common Commands

```bash
npm start                # Run demo
npm test                 # Run tests
npm run test:coverage    # Coverage report
@sdlc-orchestrator       # Run full SDLC
@pr-author               # Create PR
```

## ⚠️ Security Notes

- Never commit `.env` to git
- `.env` is in `.gitignore`
- Rotate GitHub tokens regularly
- Use minimum required token scopes

## 📄 License

MIT

---

**Built with Claude Code** - AI-powered SDLC automation

**Version:** 1.0.0  
**Status:** Production-ready (educational demo)
