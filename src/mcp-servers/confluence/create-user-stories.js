#!/usr/bin/env node

/**
 * Script to create 5 user stories in Confluence
 * Run this after configuring your Confluence credentials
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const CONFLUENCE_BASE_URL = process.env.CONFLUENCE_BASE_URL || 'https://bahuddurshashaik.atlassian.net/wiki';
const CONFLUENCE_EMAIL = process.env.CONFLUENCE_EMAIL;
const CONFLUENCE_API_TOKEN = process.env.CONFLUENCE_API_TOKEN;
const CONFLUENCE_SPACE_KEY = process.env.CONFLUENCE_SPACE_KEY || 'ClaudeCpas';

if (!CONFLUENCE_EMAIL || !CONFLUENCE_API_TOKEN) {
  console.error('Error: CONFLUENCE_EMAIL and CONFLUENCE_API_TOKEN must be set in .env file');
  process.exit(1);
}

const confluenceApi = axios.create({
  baseURL: `${CONFLUENCE_BASE_URL}/rest/api`,
  auth: {
    username: CONFLUENCE_EMAIL,
    password: CONFLUENCE_API_TOKEN,
  },
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

const userStories = [
  {
    title: 'US-001: Requirements Gathering and Documentation',
    content: `<h2>User Story</h2>
<p><strong>As a</strong> developer using Claude Code in the Agentic SDLC pipeline</p>
<p><strong>I want to</strong> automatically read and parse user stories from Confluence</p>
<p><strong>So that</strong> the AI agent can understand the requirements and ask clarifying questions before starting implementation</p>

<h2>Description</h2>
<p>This user story covers the first step of the Agentic SDLC pipeline: Requirements gathering. The system should be able to connect to Confluence via MCP server, retrieve user stories, parse their content, and enable the AI agent to ask intelligent clarifying questions.</p>

<h2>Acceptance Criteria</h2>
<ul>
  <li>MCP server can connect to Confluence successfully</li>
  <li>User stories can be retrieved by ID or title</li>
  <li>Story content is parsed and displayed in Claude Code</li>
  <li>Agent can ask clarifying questions based on the story</li>
  <li>Requirements are documented in requirements.md</li>
  <li>Requirements document is committed to version control</li>
</ul>

<h2>Technical Details</h2>
<ul>
  <li>Implement Confluence MCP server with authentication</li>
  <li>Support Confluence REST API v2</li>
  <li>Handle pagination for large result sets</li>
  <li>Parse Confluence storage format</li>
</ul>

<h2>Story Points</h2>
<p><strong>5 points</strong></p>

<h2>Priority</h2>
<p><strong>High</strong> - This is the foundation for the entire SDLC pipeline</p>

<h2>Dependencies</h2>
<ul>
  <li>None - This is the first story</li>
</ul>`,
  },
  {
    title: 'US-002: Architecture Design Automation',
    content: `<h2>User Story</h2>
<p><strong>As a</strong> software architect</p>
<p><strong>I want</strong> AI-assisted architecture design</p>
<p><strong>So that</strong> I can create comprehensive system designs quickly</p>

<h2>Description</h2>
<p>This story implements the Architecture Design phase of the Agentic SDLC. The AI agent should analyze the documented requirements and propose a high-level system architecture including component diagrams, technology choices, and data flow.</p>

<h2>Acceptance Criteria</h2>
<ul>
  <li>Architecture recommendations are generated based on requirements.md</li>
  <li>Component diagrams are created or described in detail</li>
  <li>Technology stack is recommended with clear justification</li>
  <li>Data flow between components is documented</li>
  <li>Architecture is saved to architecture.md</li>
  <li>Non-functional requirements are addressed (scalability, security, performance)</li>
</ul>

<h2>Technical Details</h2>
<ul>
  <li>Use Claude Code's planning capabilities</li>
  <li>Generate Mermaid or PlantUML diagrams</li>
  <li>Document component responsibilities</li>
  <li>Identify key interfaces and APIs</li>
</ul>

<h2>Story Points</h2>
<p><strong>8 points</strong></p>

<h2>Priority</h2>
<p><strong>High</strong> - Critical for guiding implementation</p>

<h2>Dependencies</h2>
<ul>
  <li>US-001: Requirements must be documented first</li>
</ul>`,
  },
  {
    title: 'US-003: Automated Design Review',
    content: `<h2>User Story</h2>
<p><strong>As a</strong> technical lead</p>
<p><strong>I want</strong> automated design reviews</p>
<p><strong>So that</strong> architectural risks are identified early</p>

<h2>Description</h2>
<p>This story implements the Design Review phase. Claude Code should act as a senior reviewer, analyzing the proposed architecture for risks, gaps, security issues, scalability concerns, and suggesting improvements before any code is written.</p>

<h2>Acceptance Criteria</h2>
<ul>
  <li>Design review checklist is automated</li>
  <li>Risks and gaps are identified and documented</li>
  <li>Security considerations are thoroughly evaluated</li>
  <li>Scalability and performance concerns are addressed</li>
  <li>Review findings are saved to design-review.md</li>
  <li>Architecture.md is updated if issues are found</li>
</ul>

<h2>Review Checklist</h2>
<ul>
  <li>Single Responsibility Principle - are components focused?</li>
  <li>Scalability - can it handle growth?</li>
  <li>Security - are vulnerabilities addressed?</li>
  <li>Data flow - is it efficient and clear?</li>
  <li>Error handling - are failure modes covered?</li>
  <li>Testing strategy - is it testable?</li>
  <li>Deployment - is it deployable?</li>
</ul>

<h2>Story Points</h2>
<p><strong>5 points</strong></p>

<h2>Priority</h2>
<p><strong>Medium</strong> - Important quality gate</p>

<h2>Dependencies</h2>
<ul>
  <li>US-002: Architecture must be designed first</li>
</ul>`,
  },
  {
    title: 'US-004: Implementation Planning and Task Breakdown',
    content: `<h2>User Story</h2>
<p><strong>As a</strong> project manager</p>
<p><strong>I want</strong> automated task breakdown</p>
<p><strong>So that</strong> development work can be properly planned and tracked</p>

<h2>Description</h2>
<p>This story implements the Implementation Planning phase. The AI should break down the approved architecture into a prioritized, dependency-ordered task list with estimates, enabling efficient parallel development where possible.</p>

<h2>Acceptance Criteria</h2>
<ul>
  <li>Tasks are automatically generated from architecture.md</li>
  <li>Dependencies between tasks are clearly identified</li>
  <li>Tasks are prioritized by importance and dependency order</li>
  <li>Each task includes estimated complexity</li>
  <li>Implementation plan is saved to impl-plan.md</li>
  <li>Blocked tasks are clearly marked with reasons</li>
  <li>Critical path is identified</li>
</ul>

<h2>Task Categories</h2>
<ul>
  <li>Infrastructure setup</li>
  <li>Core component implementation</li>
  <li>Integration points</li>
  <li>Testing</li>
  <li>Documentation</li>
</ul>

<h2>Story Points</h2>
<p><strong>5 points</strong></p>

<h2>Priority</h2>
<p><strong>Medium</strong> - Enables organized development</p>

<h2>Dependencies</h2>
<ul>
  <li>US-003: Design must be reviewed and approved</li>
</ul>`,
  },
  {
    title: 'US-005: Automated Code Review and PR Creation',
    content: `<h2>User Story</h2>
<p><strong>As a</strong> developer</p>
<p><strong>I want</strong> automated code review and PR generation</p>
<p><strong>So that</strong> code quality is maintained and PRs are comprehensive</p>

<h2>Description</h2>
<p>This story implements the Review and PR creation phases. Claude Code should perform automated code reviews using a defined checklist and generate comprehensive PR descriptions with all required sections.</p>

<h2>Acceptance Criteria</h2>
<ul>
  <li>Code review checklist is automatically executed</li>
  <li>Security vulnerabilities are identified</li>
  <li>Test coverage is verified (unit + integration)</li>
  <li>Error handling is validated</li>
  <li>Code clarity and DRY principles are checked</li>
  <li>Dependency safety is verified</li>
  <li>PR description includes all required sections</li>
  <li>PR is created with proper attribution</li>
</ul>

<h2>Code Review Checklist</h2>
<table>
  <tr>
    <th>Review Area</th>
    <th>Review Question</th>
  </tr>
  <tr>
    <td>Correctness</td>
    <td>Does each component behave as specified?</td>
  </tr>
  <tr>
    <td>Security</td>
    <td>Are secrets excluded? Is input validated?</td>
  </tr>
  <tr>
    <td>Error Handling</td>
    <td>Are failures handled gracefully?</td>
  </tr>
  <tr>
    <td>Test Coverage</td>
    <td>Are happy path AND edge cases covered?</td>
  </tr>
  <tr>
    <td>Code Clarity</td>
    <td>Are names self-explanatory?</td>
  </tr>
  <tr>
    <td>DRY Principle</td>
    <td>Is there duplicated logic to refactor?</td>
  </tr>
  <tr>
    <td>Dependency Safety</td>
    <td>Any vulnerable package versions?</td>
  </tr>
</table>

<h2>PR Description Sections</h2>
<ul>
  <li>Summary - 2-3 sentence overview</li>
  <li>Changes Made - bulleted list of all files</li>
  <li>Test Evidence - test run output or CI results</li>
  <li>Known Limitations - anything out of scope</li>
  <li>Reviewer Checklist - tick-list for reviewers</li>
</ul>

<h2>Story Points</h2>
<p><strong>8 points</strong></p>

<h2>Priority</h2>
<p><strong>High</strong> - Ensures quality and completeness</p>

<h2>Dependencies</h2>
<ul>
  <li>US-004: Implementation must be planned first</li>
  <li>Code implementation must be complete</li>
</ul>`,
  },
];

async function createUserStories() {
  console.log('Creating user stories in Confluence...\n');

  for (let i = 0; i < userStories.length; i++) {
    const story = userStories[i];
    try {
      console.log(`Creating: ${story.title}`);

      const pageData = {
        type: 'page',
        title: story.title,
        space: { key: CONFLUENCE_SPACE_KEY },
        body: {
          storage: {
            value: story.content,
            representation: 'storage',
          },
        },
      };

      const response = await confluenceApi.post('/content', pageData);
      console.log(`✓ Created: ${response.data._links.webui}`);
      console.log(`  Page ID: ${response.data.id}\n`);
    } catch (error) {
      console.error(`✗ Failed to create ${story.title}`);
      if (error.response) {
        console.error(`  Error: ${error.response.data.message}`);
      } else {
        console.error(`  Error: ${error.message}`);
      }
      console.log('');
    }
  }

  console.log('User story creation complete!');
  console.log(`\nView your stories at: ${CONFLUENCE_BASE_URL}/spaces/${CONFLUENCE_SPACE_KEY}/overview`);
}

createUserStories().catch(console.error);
