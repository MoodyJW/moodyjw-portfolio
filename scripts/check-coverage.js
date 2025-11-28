#!/usr/bin/env node

/**
 * Check coverage thresholds against coverage-summary.json
 * Exits with code 1 if any threshold is not met
 */

const {
  getCoverageData,
  THRESHOLD,
  BRANCH_EXCEPTION_THRESHOLD,
  HIGH_COVERAGE_THRESHOLD
} = require('./coverage-utils');

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
console.log(`Threshold:  ${THRESHOLD}%`);

// Check if branch exception applies
if (data.branchExceptionApplies) {
  console.log(`Branch Exception: ${BRANCH_EXCEPTION_THRESHOLD}% (Angular Signals)`);
  console.log(`  ℹ️  Branch coverage ${data.branches}% is acceptable due to high statement/line coverage`);
  console.log(`  ℹ️  V8 coverage counts signal initialization as branches`);
}
console.log('');

// Check thresholds with new logic
const failures = [];

if (data.statements < THRESHOLD) failures.push(`Statements: ${data.statements}% (required: ${THRESHOLD}%)`);
if (data.functions < THRESHOLD) failures.push(`Functions: ${data.functions}% (required: ${THRESHOLD}%)`);
if (data.lines < THRESHOLD) failures.push(`Lines: ${data.lines}% (required: ${THRESHOLD}%)`);

// Branch coverage check with exception handling
if (data.branchExceptionApplies) {
  // Exception applies, check against lower threshold
  if (data.branches < BRANCH_EXCEPTION_THRESHOLD) {
    failures.push(`Branches: ${data.branches}% (required: ${BRANCH_EXCEPTION_THRESHOLD}% with exception)`);
  }
} else {
  // No exception, check against standard threshold
  if (data.branches < THRESHOLD) {
    failures.push(`Branches: ${data.branches}% (required: ${THRESHOLD}%)`);
  }
}

if (failures.length > 0) {
  console.error('❌ Coverage is below threshold:\n');
  failures.forEach((failure) => console.error(`  - ${failure}`));
  console.error('');
  if (data.statements >= HIGH_COVERAGE_THRESHOLD && data.lines >= HIGH_COVERAGE_THRESHOLD && data.branches < THRESHOLD) {
    console.error('💡 Note: Branch exception applies when statements/lines ≥80%');
    console.error(`   Your current coverage: statements=${data.statements}%, lines=${data.lines}%`);
  }
  process.exit(1);
}

console.log('✅ All coverage thresholds met!');
process.exit(0);
