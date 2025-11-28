#!/usr/bin/env node

/**
 * Generate coverage report data for CI/CD workflows
 * Can be used by both threshold checking and PR comments
 */

const fs = require('fs');
const path = require('path');

const THRESHOLD = 80;
const BRANCH_EXCEPTION_THRESHOLD = 65;
const HIGH_COVERAGE_THRESHOLD = 80;

function findCoverageFile() {
  const coverageDir = path.join(__dirname, '../coverage');
  if (!fs.existsSync(coverageDir)) {
    return null;
  }

  // Look for coverage-summary.json (preferred)
  const files = fs.readdirSync(coverageDir);
  for (const file of files) {
    const summaryPath = path.join(coverageDir, file, 'coverage-summary.json');
    if (fs.existsSync(summaryPath)) {
      return { path: summaryPath, type: 'summary' };
    }
  }

  // Fallback to coverage-final.json
  for (const file of files) {
    const finalPath = path.join(coverageDir, file, 'coverage-final.json');
    if (fs.existsSync(finalPath)) {
      return { path: finalPath, type: 'final' };
    }
  }

  console.error(`Coverage directory exists but no coverage files found.`);
  console.error(`Files in coverage/: ${files.join(', ')}`);
  return null;
}

function calculateTotalsFromFinal(coverageData) {
  const totals = {
    statements: { covered: 0, total: 0 },
    branches: { covered: 0, total: 0 },
    functions: { covered: 0, total: 0 },
    lines: { covered: 0, total: 0 },
  };

  for (const filePath in coverageData) {
    const file = coverageData[filePath];

    // Statements
    for (const key in file.s) {
      totals.statements.total++;
      if (file.s[key] > 0) totals.statements.covered++;
    }

    // Branches
    for (const key in file.b) {
      const branches = file.b[key];
      for (let i = 0; i < branches.length; i++) {
        totals.branches.total++;
        if (branches[i] > 0) totals.branches.covered++;
      }
    }

    // Functions
    for (const key in file.f) {
      totals.functions.total++;
      if (file.f[key] > 0) totals.functions.covered++;
    }

    // Lines (use statementMap as proxy)
    for (const key in file.s) {
      totals.lines.total++;
      if (file.s[key] > 0) totals.lines.covered++;
    }
  }

  return {
    statements: {
      pct:
        totals.statements.total > 0
          ? ((totals.statements.covered / totals.statements.total) * 100).toFixed(2)
          : 0,
    },
    branches: {
      pct:
        totals.branches.total > 0
          ? ((totals.branches.covered / totals.branches.total) * 100).toFixed(2)
          : 0,
    },
    functions: {
      pct:
        totals.functions.total > 0
          ? ((totals.functions.covered / totals.functions.total) * 100).toFixed(2)
          : 0,
    },
    lines: {
      pct:
        totals.lines.total > 0 ? ((totals.lines.covered / totals.lines.total) * 100).toFixed(2) : 0,
    },
  };
}

function getCoverageData() {
  // Find coverage file
  const coverageFile = findCoverageFile();
  if (!coverageFile) {
    return null;
  }
  try {
    // Read and parse coverage data
    const coverage = JSON.parse(fs.readFileSync(coverageFile.path, 'utf8'));

    let totals;
    if (coverageFile.type === 'summary') {
      // coverage-summary.json format
      if (!coverage.total) {
        console.error('Coverage file exists but does not have expected "total" property');
        return null;
      }
      totals = coverage.total;
    } else {
      // coverage-final.json format - calculate totals
      totals = calculateTotalsFromFinal(coverage);
    }

    const { statements, branches, functions, lines } = totals;

    // Check if Angular Signals branch exception applies
    // Allow branch coverage >= 65% when statements >= 80% AND lines >= 80%
    const hasHighCoverage = statements.pct >= HIGH_COVERAGE_THRESHOLD && lines.pct >= HIGH_COVERAGE_THRESHOLD;
    const branchExceptionApplies = hasHighCoverage && branches.pct >= BRANCH_EXCEPTION_THRESHOLD;

    // Determine if thresholds are met
    const meetsThreshold =
      statements.pct >= THRESHOLD &&
      functions.pct >= THRESHOLD &&
      lines.pct >= THRESHOLD &&
      (branches.pct >= THRESHOLD || branchExceptionApplies);

    return {
      statements: statements.pct,
      branches: branches.pct,
      functions: functions.pct,
      lines: lines.pct,
      threshold: THRESHOLD,
      branchExceptionThreshold: BRANCH_EXCEPTION_THRESHOLD,
      highCoverageThreshold: HIGH_COVERAGE_THRESHOLD,
      branchExceptionApplies,
      meetsThreshold,
    };
  } catch (error) {
    console.error('Error reading or parsing coverage file:', error.message);
    return null;
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getCoverageData,
    THRESHOLD,
    BRANCH_EXCEPTION_THRESHOLD,
    HIGH_COVERAGE_THRESHOLD
  };
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
