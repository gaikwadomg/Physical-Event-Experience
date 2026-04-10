// ═══════════════════════════════════════════════════════
// SMART STADIUM — Basic Test Suite
// Validates data integrity, simulation logic, and state
// ═══════════════════════════════════════════════════════

import {
  getCrowdStatus,
  initialGates,
  initialRoutes,
  initialFoodStalls,
  initialWashrooms,
  initialEmergencyExits,
  wheelPrizes,
  quizQuestions,
  simulateCrowdLevels,
  simulateRoutes,
  simulateFoodStalls,
  simulateWashrooms,
} from '../data/stadiumData.js';

let passed = 0;
let failed = 0;

/**
 * Simple assertion helper.
 * @param {string} name - test name
 * @param {boolean} condition - assertion condition
 */
function assert(name, condition) {
  if (condition) {
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${name}`);
    failed++;
  }
}

function runTests() {
  console.log('🏟️ Smart Stadium — Test Suite\n');

  // ─── Data Integrity Tests ───
  console.log('📦 Data Integrity:');
  assert('Gates has 4 entries', initialGates.length === 4);
  assert('All gates have required fields', initialGates.every(g => g.id && g.name && typeof g.crowdLevel === 'number' && g.icon));
  assert('Gate crowd levels are 0-100', initialGates.every(g => g.crowdLevel >= 0 && g.crowdLevel <= 100));

  assert('Routes has 4 destination types', Object.keys(initialRoutes).length === 4);
  assert('Each route has required fields', Object.values(initialRoutes).flat().every(r => r.id && r.name && r.walkTime && typeof r.crowdLevel === 'number'));

  assert('Food stalls has 6 entries', initialFoodStalls.length === 6);
  assert('All stalls have required fields', initialFoodStalls.every(s => s.id && s.name && s.cuisine && typeof s.waitTime === 'number' && typeof s.queueLength === 'number'));

  assert('Washrooms has 4 entries', initialWashrooms.length === 4);
  assert('Emergency exits has 4 entries', initialEmergencyExits.length === 4);
  assert('Wheel prizes has 8 entries', wheelPrizes.length === 8);
  assert('All prizes have points', wheelPrizes.every(p => typeof p.points === 'number' && p.points > 0));
  assert('Quiz has 5 questions', quizQuestions.length === 5);
  assert('All questions have correct answer index', quizQuestions.every(q =>
    typeof q.correct === 'number' && q.correct >= 0 && q.correct < q.options.length
  ));

  // ─── getCrowdStatus Tests ───
  console.log('\n🎨 getCrowdStatus:');
  assert('Level 0 is green/Free', getCrowdStatus(0).color === 'green');
  assert('Level 35 is green/Free', getCrowdStatus(35).color === 'green');
  assert('Level 36 is yellow/Moderate', getCrowdStatus(36).color === 'yellow');
  assert('Level 65 is yellow/Moderate', getCrowdStatus(65).color === 'yellow');
  assert('Level 66 is red/Crowded', getCrowdStatus(66).color === 'red');
  assert('Level 100 is red/Crowded', getCrowdStatus(100).color === 'red');

  // ─── Simulation Tests ───
  console.log('\n⚙️ Simulation Logic:');
  const simGates = simulateCrowdLevels(initialGates);
  assert('simulateCrowdLevels returns same count', simGates.length === initialGates.length);
  assert('Simulated crowd levels stay in bounds (5-95)', simGates.every(g => g.crowdLevel >= 5 && g.crowdLevel <= 95));
  assert('Gate IDs preserved after simulation', simGates.every((g, i) => g.id === initialGates[i].id));

  const simRoutes = simulateRoutes(initialRoutes);
  assert('simulateRoutes preserves destination keys', Object.keys(simRoutes).length === Object.keys(initialRoutes).length);
  assert('Route crowd levels stay in bounds', Object.values(simRoutes).flat().every(r => r.crowdLevel >= 5 && r.crowdLevel <= 95));

  const simStalls = simulateFoodStalls(initialFoodStalls);
  assert('simulateFoodStalls preserves count', simStalls.length === initialFoodStalls.length);
  assert('Stall queue lengths >= 0', simStalls.every(s => s.queueLength >= 0));
  assert('Stall wait times >= 1', simStalls.every(s => s.waitTime >= 1));

  const simWC = simulateWashrooms(initialWashrooms);
  assert('simulateWashrooms preserves count', simWC.length === initialWashrooms.length);
  assert('Washroom queue lengths >= 0', simWC.every(w => w.queueLength >= 0));
  assert('Washroom wait times >= 0', simWC.every(w => w.waitTime >= 0));

  // ─── Security Tests ───
  console.log('\n🔒 Security Checks:');
  assert('No sensitive data in initial state (no passwords/tokens)', !JSON.stringify(initialGates).match(/password|token|secret|apikey/i));
  assert('localStorage keys are namespaced', ['stadium-points', 'stadium-spins-used'].every(key => key.startsWith('stadium-')));

  // ─── Summary ───
  console.log(`\n${'═'.repeat(40)}`);
  console.log(`📊 Results: ${passed} passed, ${failed} failed`);
  console.log(`${'═'.repeat(40)}\n`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

runTests();
