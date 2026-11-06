# Hotel Booking System - Project Structure

## 📁 Complete Directory Structure

```
claude_capston_project/
│
├── src/                          # Application Source Code
│   ├── models/                   # Data Models
│   │   ├── Hotel.js             # HB-001: Hotel model with search
│   │   ├── Booking.js           # HB-002: Booking model
│   │   ├── Payment.js           # HB-003: Payment model
│   │   └── User.js              # HB-004: User model
│   │
│   ├── services/                 # Business Logic Layer
│   │   ├── HotelService.js      # HB-001: Hotel search service
│   │   ├── BookingService.js    # HB-002 & HB-005: Booking management
│   │   ├── PaymentService.js    # HB-003: Payment processing
│   │   └── UserService.js       # HB-004: Authentication service
│   │
│   ├── data/                     # Sample Data
│   │   └── sampleData.js        # 5 hotels, 2 users
│   │
│   ├── mcp-servers/              # MCP Server Integrations
│   │   └── confluence/          # Confluence MCP server
│   │
│   ├── agents/                   # Custom Agent Implementations
│   │   ├── README.md
│   │   └── requirements-agent.js
│   │
│   └── app.js                    # Main Application Entry
│
├── .github/                      # Agentic SDLC Configuration
│   ├── agents/                   # SDLC Agent Definitions
│   │   ├── requirements-analyst.agent.md
│   │   ├── solution-architect.agent.md
│   │   ├── design-reviewer.agent.md
│   │   ├── implementation-planner.agent.md
│   │   ├── implementer.agent.md
│   │   ├── code-reviewer.agent.md
│   │   ├── verifier.agent.md
│   │   ├── pr-author.agent.md
│   │   └── sdlc-orchestrator.agent.md
│   │
│   ├── instructions/             # Development Guidelines
│   │   ├── coding-standards.instructions.md
│   │   └── documentation.instructions.md
│   │
│   └── prompts/                  # SDLC Workflow Prompts
│       ├── 01-requirements.prompt.md
│       ├── 02-architecture.prompt.md
│       ├── 03-design-review.prompt.md
│       ├── 04-impl-plan.prompt.md
│       ├── 05-implement.prompt.md
│       ├── 06-code-review.prompt.md
│       ├── 07-verify.prompt.md
│       └── 08-pr.prompt.md
│
├── .claude/                      # Claude Code Configuration
│   ├── skills/                   # Custom Skills
│   │   └── requirements-agent.md
│   └── load-env.js              # Environment loader
│
├── docs/                         # Documentation
│   └── user-stories/            # User Stories
│       └── README.md
│
├── tests/                        # Test Files
│   ├── integration/             # Integration tests
│   └── unit/                    # Unit tests
│
├── README.md                     # Main Project Documentation
├── USER_STORIES.md              # Detailed User Stories Implementation
├── PROJECT_STRUCTURE.md         # This File
├── package.json                 # Node.js Package Configuration
├── mcp.json                     # MCP Server Configuration
├── .env.example                 # Environment Variables Template
├── .gitignore                   # Git Ignore Rules
├── setup-mcp.sh                 # MCP Setup Script (Unix)
└── setup-mcp.ps1                # MCP Setup Script (Windows)
```

## 🎯 Key Components

### Source Code (`/src`)

#### Models Layer
Defines data structures and business rules for each entity.

| File | User Story | Purpose |
|------|-----------|---------|
| `Hotel.js` | HB-001 | Hotel data model with search/filter methods |
| `Booking.js` | HB-002 | Booking model with date validation |
| `Payment.js` | HB-003 | Payment model with validation |
| `User.js` | HB-004 | User model with authentication |

#### Services Layer
Implements business logic and coordinates between models.

| File | User Story | Purpose |
|------|-----------|---------|
| `HotelService.js` | HB-001 | Hotel search and filtering |
| `BookingService.js` | HB-002, HB-005 | Booking creation and management |
| `PaymentService.js` | HB-003 | Payment processing and refunds |
| `UserService.js` | HB-004 | User registration and authentication |

#### Main Application
- `app.js` - Application entry point with demo of all user stories

#### Sample Data
- `data/sampleData.js` - 5 hotels and 2 users for testing

### Agentic SDLC (`/.github`)

#### 9 SDLC Agents
1. **Requirements Analyst** - Extracts and documents requirements
2. **Solution Architect** - Designs system architecture
3. **Design Reviewer** - Reviews architectural decisions
4. **Implementation Planner** - Creates detailed implementation plans
5. **Implementer** - Writes production code
6. **Code Reviewer** - Reviews code quality and standards
7. **Verifier** - Performs testing and validation
8. **PR Author** - Creates pull request documentation
9. **SDLC Orchestrator** - Coordinates the entire workflow

#### Instructions
- Coding standards and best practices
- Documentation guidelines

#### Prompts
8 workflow prompts for each SDLC phase

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Node.js dependencies and scripts |
| `mcp.json` | MCP server configuration |
| `.env.example` | Environment variables template |
| `.gitignore` | Git ignore patterns |

## 🚀 Getting Started

### Prerequisites
- Node.js 14+

### Setup

```bash
# 1. Install dependencies (none required for basic version)
npm install

# 2. Run the application
npm start
```

### Expected Output
The application runs a complete demo covering all 5 user stories:
1. Search hotels in New York
2. Register and login a user
3. Create a booking
4. Process payment
5. View and modify bookings

## 📊 User Stories Coverage

### HB-001: Hotel Search and Browse
**Files:** `src/models/Hotel.js`, `src/services/HotelService.js`

**Features:**
- Search by location
- Filter by price range
- Filter by rating
- Sort results
- View hotel details

### HB-002: Hotel Booking and Reservation
**Files:** `src/models/Booking.js`, `src/services/BookingService.js`

**Features:**
- Create bookings
- Validate dates
- Calculate total price
- Manage guest count

### HB-003: Payment Processing
**Files:** `src/models/Payment.js`, `src/services/PaymentService.js`

**Features:**
- Multiple payment methods
- Card validation
- Transaction processing
- Refund handling

### HB-004: User Authentication and Profiles
**Files:** `src/models/User.js`, `src/services/UserService.js`

**Features:**
- User registration
- Email/password validation
- Login/logout
- Profile management

### HB-005: Booking Management and Cancellation
**Files:** `src/services/BookingService.js`, `src/services/PaymentService.js`

**Features:**
- View bookings
- Modify bookings
- Cancel bookings
- Automatic refunds

## 🏗️ Architecture

### Layered Architecture

```
┌─────────────────────────────────────┐
│         Application Layer           │
│           (app.js)                  │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│         Service Layer               │
│  (HotelService, BookingService,     │
│   PaymentService, UserService)      │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│         Model Layer                 │
│  (Hotel, Booking, Payment, User)    │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│         Data Layer                  │
│      (In-Memory Storage)            │
└─────────────────────────────────────┘
```

### Design Principles
- **Separation of Concerns** - Models, Services, Application logic separated
- **Single Responsibility** - Each class/file has one clear purpose
- **Validation** - Input validation at multiple layers
- **Service-Oriented** - Services coordinate business logic

## 🔄 SDLC Workflow

```
Requirements → Architecture → Design Review → 
Implementation Plan → Implement → Code Review → 
Verify → PR Creation
```

Each phase has:
- Dedicated agent
- Workflow prompt
- Documentation output

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Language | JavaScript (ES6+) |
| Runtime | Node.js |
| Data Storage | In-Memory |
| Architecture | Service-Oriented |
| SDLC | Claude Code Agents |
| MCP | Confluence Integration |

## 📝 File Naming Conventions

- **Models:** PascalCase (e.g., `Hotel.js`, `Booking.js`)
- **Services:** PascalCase with "Service" suffix (e.g., `HotelService.js`)
- **Data:** camelCase (e.g., `sampleData.js`)
- **Documentation:** SCREAMING_SNAKE_CASE.md (e.g., `README.md`)

## 🧪 Testing

### Manual Testing
Run the built-in demo:
```bash
npm start
```

### Test Data
- 5 sample hotels
- 2 sample users
- Valid test card: 4532015112830366

### Future Test Structure
```
tests/
├── unit/                # Unit tests for models & services
│   ├── Hotel.test.js
│   ├── Booking.test.js
│   ├── Payment.test.js
│   └── User.test.js
└── integration/         # Integration tests
    └── workflow.test.js
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main project overview |
| `USER_STORIES.md` | Detailed user story implementation |
| `PROJECT_STRUCTURE.md` | This document - complete structure |
| `docs/user-stories/README.md` | User stories template |

## 🎯 Story Points Summary

| User Story | Points | Status |
|-----------|--------|--------|
| HB-001: Hotel Search | 8 | ✅ Complete |
| HB-002: Booking | 8 | ✅ Complete |
| HB-003: Payment | 13 | ✅ Complete |
| HB-004: Authentication | 5 | ✅ Complete |
| HB-005: Management | 5 | ✅ Complete |
| **TOTAL** | **39** | **✅ Complete** |

## 🌟 Project Highlights

✅ **Simple** - Pure JavaScript, no frameworks
✅ **Complete** - All 5 user stories implemented
✅ **Modular** - Clear separation of concerns
✅ **Validated** - Comprehensive input validation
✅ **Documented** - Extensive documentation
✅ **Runnable** - Works out of the box with `npm start`

## 🚀 Next Steps

For production deployment, consider:
1. Add database (PostgreSQL/MongoDB)
2. Create REST API with Express
3. Add frontend UI (React/Vue)
4. Implement JWT authentication
5. Add comprehensive test suite
6. Set up CI/CD pipeline
7. Add logging and monitoring
8. Implement real payment gateway

---

**Last Updated:** 2026-11-06
**Version:** 1.0.0
