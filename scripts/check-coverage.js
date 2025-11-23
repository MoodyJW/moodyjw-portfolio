#!/usr/bin/env node

/**
 * Check coverage thresholds against coverage-summary.json
 * Exits with code 1 if any threshold is not met
 */

const { getCoverageData, THRESHOLD } = require('./coverage-utils');

// Attempt to get coverage data
const data = getCoverageData();

if (!data) {
  console.error('\n❌ Failed to load coverage data');
  console.error('   Check the errors above for details.');
  console.error('   Make sure you have run tests with coverage enabled:');
  console.error('   npm run test:coverage\n');
  process.exit(1);
}

// Log coverage results
console.log('📊 Coverage Results:');
console.log('-------------------');
console.log(`Statements: ${data.statements}%`);
console.log(`Branches:   ${data.branches}%`);
console.log(`Functions:  ${data.functions}%`);
console.log(`Lines:      ${data.lines}%`);
console.log('-------------------');
console.log(`Threshold:  ${THRESHOLD}%\n`);

// Check thresholds
const failures = [];

if (data.statements < THRESHOLD) failures.push(`Statements: ${data.statements}%`);
if (data.branches < THRESHOLD) failures.push(`Branches: ${data.branches}%`);
if (data.functions < THRESHOLD) failures.push(`Functions: ${data.functions}%`);
if (data.lines < THRESHOLD) failures.push(`Lines: ${data.lines}%`);

if (failures.length > 0) {
  console.error('❌ Coverage is below threshold:\n');
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}

console.log('✅ All coverage thresholds met!');
process.exit(0);
