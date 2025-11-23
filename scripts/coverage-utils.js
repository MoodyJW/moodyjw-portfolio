#!/usr/bin/env node

/**
 * Generate coverage report data for CI/CD workflows
 * Can be used by both threshold checking and PR comments
 */

const fs = require('fs');
const path = require('path');

const COVERAGE_FILE = path.join(__dirname, '../coverage/coverage-summary.json');
const THRESHOLD = 80;

function getCoverageData() {
  // Check if coverage file exists
  if (!fs.existsSync(COVERAGE_FILE)) {
    // Help debug by checking what files exist in coverage directory
    const coverageDir = path.join(__dirname, '../coverage');
    if (fs.existsSync(coverageDir)) {
      const files = fs.readdirSync(coverageDir);
      console.error(`Coverage directory exists but coverage-summary.json not found.`);
      console.error(`Files in coverage/: ${files.join(', ')}`);
    }
    return null;
  }

  try {
    // Read and parse coverage data
    const coverage = JSON.parse(fs.readFileSync(COVERAGE_FILE, 'utf8'));

    // Validate the structure
    if (!coverage.total) {
      console.error('Coverage file exists but does not have expected "total" property');
      return null;
    }

    const { statements, branches, functions, lines } = coverage.total;

    return {
      statements: statements.pct,
      branches: branches.pct,
      functions: functions.pct,
      lines: lines.pct,
      threshold: THRESHOLD,
      meetsThreshold:
        statements.pct >= THRESHOLD &&
        branches.pct >= THRESHOLD &&
        functions.pct >= THRESHOLD &&
        lines.pct >= THRESHOLD,
    };
  } catch (error) {
    console.error('Error reading or parsing coverage file:', error.message);
    return null;
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getCoverageData, THRESHOLD };
}

// CLI usage: output JSON
if (require.main === module) {
  const data = getCoverageData();
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.error('Coverage data not found');
    process.exit(1);
  }
}
