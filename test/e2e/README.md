# YAPI Plus UI & Functional Testing Guide

## Overview

This directory contains comprehensive UI and functional tests for YAPI Plus using Playwright.

## Test Structure

```
test/e2e/
├── config.js                 # Playwright configuration
├── ai-agent-framework.js     # AI Agent automation framework
├── pages/                    # Page Object Models
│   ├── AuthPages.js         # Login, Register, Home, Setup pages
│   ├── ProjectPages.js      # Project, Interface, Group management
│   └── AiAgentPages.js      # AI Agent page objects
├── tests/                   # Test cases
│   ├── ui-tests.test.js     # UI rendering and element tests
│   ├── functional-tests.test.js  # API and data flow tests
│   ├── ai-agent-tests.test.js    # AI agent automation tests
│   └── performance-tests.test.js # Performance and accessibility tests
└── utils/
    └── TestUtils.js         # Common test utilities
```

## Quick Start

### Prerequisites

- MongoDB must be running
- Dependencies installed (`npm install`)

### Run All Tests

```bash
npm run test:e2e
```

### Run Specific Test Suites

```bash
# UI Tests
npm run test:ui

# Functional Tests
npm run test:functional

# AI Agent Tests
npm run test:ai

# Performance Tests
npm run test:perf

# All Tests
npm run test:all
```

### Interactive Mode

```bash
# UI mode for visual debugging
npm run test:e2e:ui

# Headed mode (show browser)
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug
```

### Generate Report

```bash
npm run test:e2e:report
```

## AI Agent Automation Framework

### Features

1. **Natural Language Test Generation**
   - Convert human-readable descriptions to executable tests
   - Keyword-based test case generation

2. **Predefined Test Library**
   - Authentication flows
   - Project management
   - Interface management
   - AI Agent functionality

3. **Smart Assertions**
   - URL validation
   - Element visibility
   - Text content verification
   - API response checks

4. **Report Generation**
   - JSON format for CI/CD
   - HTML format for human review

### Usage

```javascript
const { AIAgentTestFramework, AI_TEST_CASES } = require('./ai-agent-framework');

// Use predefined tests
const framework = new AIAgentTestFramework(page);
await framework.executeTestCase(AI_TEST_CASES.authentication.loginWithValidCredentials);

// Generate test from natural language
const testCase = framework.generateTestCaseFromNaturalLanguage(
  '测试用户登录功能...'
);

// Export report
const report = framework.exportReport('html');
```

## Test Categories

### UI Tests
- Page rendering
- Element visibility
- Navigation flows
- Form validation
- Responsive design

### Functional Tests
- Authentication (login/logout/register)
- Project CRUD operations
- Interface management
- API response handling
- Error handling

### Performance Tests
- Page load time
- Time to First Byte (TTFB)
- Page weight
- Console errors

### Accessibility Tests
- Image alt text
- Form labels
- Heading hierarchy
- ARIA attributes

## Test Configuration

Edit `test/e2e/config.js` to customize:
- Base URL
- Test timeouts
- Retry attempts
- Browser selection
- Video/screenshot capture
- Web server configuration

## Browser Support

- Chromium (default)
- Firefox
- Webkit (Safari)

## CI/CD Integration

The tests are designed to work in CI environments:
- Automatic web server startup
- Retry on failure
- HTML report generation
- Exit codes for automation

## Best Practices

1. Use Page Object Model for maintainability
2. Keep tests independent
3. Use meaningful test names
4. Take screenshots on failure
5. Include both positive and negative test cases
6. Test across different viewports