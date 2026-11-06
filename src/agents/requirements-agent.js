#!/usr/bin/env node

/**
 * Requirements Gathering Agent
 * Reads user stories from Confluence and creates detailed requirements documentation
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

class RequirementsAgent {
  constructor(config = {}) {
    this.name = 'Requirements Agent';
    this.version = '1.0.0';
    this.config = config;
    this.outputDir = config.outputDir || 'docs/requirements';
  }

  /**
   * Main execution method
   */
  async execute(userStory) {
    console.log(`\n🔍 ${this.name} Starting...`);
    console.log(`📖 Processing: ${userStory.title}\n`);

    const requirements = await this.analyzeUserStory(userStory);
    const clarifications = await this.generateClarifyingQuestions(userStory);
    const document = await this.createRequirementsDocument(userStory, requirements, clarifications);

    await this.saveRequirements(document);

    console.log(`✅ ${this.name} Complete!`);
    return document;
  }

  /**
   * Analyze user story and extract requirements
   */
  async analyzeUserStory(userStory) {
    console.log('📝 Analyzing user story...');

    return {
      functional: this.extractFunctionalRequirements(userStory),
      nonFunctional: this.extractNonFunctionalRequirements(userStory),
      constraints: this.identifyConstraints(userStory),
      assumptions: this.identifyAssumptions(userStory),
    };
  }

  /**
   * Extract functional requirements
   */
  extractFunctionalRequirements(userStory) {
    const requirements = [];

    // Parse acceptance criteria as functional requirements
    if (userStory.acceptanceCriteria) {
      userStory.acceptanceCriteria.forEach((criteria, index) => {
        requirements.push({
          id: `FR-${String(index + 1).padStart(3, '0')}`,
          description: criteria,
          priority: this.determinePriority(criteria),
          source: userStory.id,
        });
      });
    }

    return requirements;
  }

  /**
   * Extract non-functional requirements
   */
  extractNonFunctionalRequirements(userStory) {
    const nfr = [];

    // Performance requirements
    nfr.push({
      id: 'NFR-001',
      category: 'Performance',
      description: 'Page load time must be less than 3 seconds',
      metric: 'Response Time < 3s',
      priority: 'High',
    });

    // Security requirements
    nfr.push({
      id: 'NFR-002',
      category: 'Security',
      description: 'All data transmission must use HTTPS encryption',
      metric: 'SSL/TLS enabled',
      priority: 'Critical',
    });

    // Availability requirements
    nfr.push({
      id: 'NFR-003',
      category: 'Availability',
      description: 'System uptime must be 99.9% or higher',
      metric: 'Uptime >= 99.9%',
      priority: 'High',
    });

    // Scalability requirements
    nfr.push({
      id: 'NFR-004',
      category: 'Scalability',
      description: 'System must handle 10,000 concurrent users',
      metric: 'Concurrent Users >= 10,000',
      priority: 'Medium',
    });

    // Usability requirements
    nfr.push({
      id: 'NFR-005',
      category: 'Usability',
      description: 'UI must be WCAG 2.1 Level AA compliant',
      metric: 'WCAG 2.1 AA compliance',
      priority: 'Medium',
    });

    return nfr;
  }

  /**
   * Identify constraints
   */
  identifyConstraints(userStory) {
    return [
      'Must comply with PCI DSS for payment processing',
      'Must support modern browsers (Chrome, Firefox, Safari, Edge)',
      'Must be mobile-responsive',
      'Must integrate with existing payment gateways',
      'Budget constraint: To be defined',
      'Timeline constraint: 8-week development cycle',
    ];
  }

  /**
   * Identify assumptions
   */
  identifyAssumptions(userStory) {
    return [
      'Users have access to modern web browsers',
      'Payment gateway APIs are available and stable',
      'Hotel inventory data is available via API',
      'Users have basic internet connectivity',
      'Email service is available for notifications',
      'Database can handle expected transaction volume',
    ];
  }

  /**
   * Generate clarifying questions
   */
  async generateClarifyingQuestions(userStory) {
    console.log('❓ Generating clarifying questions...');

    return [
      {
        category: 'Business Logic',
        questions: [
          'What happens if a user searches for a location with no available hotels?',
          'Should we support guest checkout or require user registration?',
          'What is the maximum booking duration allowed?',
          'How should we handle overbooking scenarios?',
        ],
      },
      {
        category: 'User Experience',
        questions: [
          'Should search results be cached for returning users?',
          'What information should be displayed in the search results preview?',
          'Should we support saving favorite hotels?',
          'What accessibility features are required?',
        ],
      },
      {
        category: 'Technical',
        questions: [
          'What payment gateways should be supported?',
          'Should we support multiple currencies?',
          'What are the expected peak load times?',
          'Are there any third-party integrations required?',
        ],
      },
      {
        category: 'Security',
        questions: [
          'What authentication methods should be supported?',
          'How long should user sessions remain active?',
          'What data retention policies must be followed?',
          'Are there any specific compliance requirements beyond PCI DSS?',
        ],
      },
    ];
  }

  /**
   * Create requirements document
   */
  async createRequirementsDocument(userStory, requirements, clarifications) {
    console.log('📄 Creating requirements document...');

    return {
      metadata: {
        title: `Requirements: ${userStory.title}`,
        userStoryId: userStory.id,
        version: '1.0',
        date: new Date().toISOString(),
        author: this.name,
      },
      overview: {
        description: userStory.description,
        scope: userStory.scope || 'In Scope: ' + userStory.title,
        outOfScope: userStory.outOfScope || [
          'Mobile native applications',
          'Loyalty program integration',
          'Multi-language support (Phase 1)',
        ],
      },
      functionalRequirements: requirements.functional,
      nonFunctionalRequirements: requirements.nonFunctional,
      constraints: requirements.constraints,
      assumptions: requirements.assumptions,
      clarifyingQuestions: clarifications,
      successCriteria: this.defineSuccessCriteria(userStory),
      risks: this.identifyRisks(userStory),
    };
  }

  /**
   * Define success criteria
   */
  defineSuccessCriteria(userStory) {
    return [
      'All acceptance criteria met and verified',
      'Code review approved with no critical issues',
      'Test coverage above 80%',
      'Performance benchmarks met',
      'Security scan passes with no high-severity issues',
      'Stakeholder sign-off obtained',
    ];
  }

  /**
   * Identify risks
   */
  identifyRisks(userStory) {
    return [
      {
        id: 'RISK-001',
        description: 'Third-party payment gateway downtime',
        impact: 'High',
        probability: 'Low',
        mitigation: 'Implement retry logic and fallback payment methods',
      },
      {
        id: 'RISK-002',
        description: 'Database performance degradation under load',
        impact: 'High',
        probability: 'Medium',
        mitigation: 'Implement caching and database query optimization',
      },
      {
        id: 'RISK-003',
        description: 'Security vulnerabilities in dependencies',
        impact: 'Critical',
        probability: 'Medium',
        mitigation: 'Regular security audits and dependency updates',
      },
    ];
  }

  /**
   * Determine priority based on criteria text
   */
  determinePriority(criteria) {
    const text = criteria.toLowerCase();
    if (text.includes('must') || text.includes('critical')) return 'High';
    if (text.includes('should')) return 'Medium';
    return 'Low';
  }

  /**
   * Save requirements to file
   */
  async saveRequirements(document) {
    const filename = `${document.metadata.userStoryId.toLowerCase()}-requirements.json`;
    const filepath = join(this.outputDir, filename);

    console.log(`💾 Saving to: ${filepath}`);

    // Also create a markdown version
    const markdown = this.generateMarkdown(document);
    const mdFilepath = filepath.replace('.json', '.md');

    writeFileSync(filepath, JSON.stringify(document, null, 2));
    writeFileSync(mdFilepath, markdown);

    console.log(`✅ Saved: ${filename}`);
    console.log(`✅ Saved: ${filename.replace('.json', '.md')}`);
  }

  /**
   * Generate markdown from requirements document
   */
  generateMarkdown(doc) {
    let md = `# ${doc.metadata.title}\n\n`;
    md += `**Version:** ${doc.metadata.version} | **Date:** ${new Date(doc.metadata.date).toLocaleDateString()}\n\n`;
    md += `**User Story:** ${doc.metadata.userStoryId}\n\n`;

    md += `## Overview\n\n${doc.overview.description}\n\n`;

    md += `### Scope\n${doc.overview.scope}\n\n`;

    md += `### Out of Scope\n`;
    doc.overview.outOfScope.forEach(item => md += `- ${item}\n`);
    md += `\n`;

    md += `## Functional Requirements\n\n`;
    doc.functionalRequirements.forEach(req => {
      md += `### ${req.id} - ${req.priority} Priority\n`;
      md += `${req.description}\n\n`;
    });

    md += `## Non-Functional Requirements\n\n`;
    doc.nonFunctionalRequirements.forEach(nfr => {
      md += `### ${nfr.id} - ${nfr.category}\n`;
      md += `**Priority:** ${nfr.priority}\n\n`;
      md += `${nfr.description}\n\n`;
      md += `**Metric:** ${nfr.metric}\n\n`;
    });

    md += `## Constraints\n\n`;
    doc.constraints.forEach(constraint => md += `- ${constraint}\n`);
    md += `\n`;

    md += `## Assumptions\n\n`;
    doc.assumptions.forEach(assumption => md += `- ${assumption}\n`);
    md += `\n`;

    md += `## Clarifying Questions\n\n`;
    doc.clarifyingQuestions.forEach(category => {
      md += `### ${category.category}\n`;
      category.questions.forEach(q => md += `- ${q}\n`);
      md += `\n`;
    });

    md += `## Success Criteria\n\n`;
    doc.successCriteria.forEach(criteria => md += `- [ ] ${criteria}\n`);
    md += `\n`;

    md += `## Risks\n\n`;
    doc.risks.forEach(risk => {
      md += `### ${risk.id}\n`;
      md += `**Description:** ${risk.description}\n\n`;
      md += `**Impact:** ${risk.impact} | **Probability:** ${risk.probability}\n\n`;
      md += `**Mitigation:** ${risk.mitigation}\n\n`;
    });

    return md;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const sampleUserStory = {
    id: 'HB-001',
    title: 'Hotel Search and Browse',
    description: 'As a traveler, I want to search for hotels by location and dates so that I can find available accommodations',
    acceptanceCriteria: [
      'Users can enter destination (city, address, or landmark)',
      'Users can select check-in and check-out dates using a date picker',
      'Users can specify number of guests (adults and children)',
      'Search results display available hotels with basic info',
      'Results can be filtered by price range, star rating, amenities',
      'Results can be sorted by price, rating, or distance',
      'Search parameters are validated',
      'No results message displayed when no hotels match criteria',
    ],
    priority: 'High',
    storyPoints: 8,
  };

  const agent = new RequirementsAgent({ outputDir: 'docs/requirements' });
  agent.execute(sampleUserStory).catch(console.error);
}

export default RequirementsAgent;
