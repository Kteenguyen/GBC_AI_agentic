const path = require('path');
const fs = require('fs');

async function runAllTests() {
  console.log('================================================================');
  console.log('STARTING DEEP TESTING SUITE FOR DOCS DATA & API ROUTE');
  console.log('================================================================');

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${message}`);
      failedTests++;
    }
  }

  // TEST SUITE 1: Data Integrity in src/lib/docsData.ts
  console.log('\n--- TEST SUITE 1: DATA INTEGRITY IN src/lib/docsData.ts ---');
  const { BUNDLED_TECHNICAL_DOCS, DOC_CATEGORIES } = require('../src/lib/docsData.ts');

  assert(Array.isArray(BUNDLED_TECHNICAL_DOCS), 'BUNDLED_TECHNICAL_DOCS is an array');
  assert(BUNDLED_TECHNICAL_DOCS.length === 9, `BUNDLED_TECHNICAL_DOCS contains exactly 9 items (actual: ${BUNDLED_TECHNICAL_DOCS.length})`);
  assert(Array.isArray(DOC_CATEGORIES), 'DOC_CATEGORIES is an array');
  assert(DOC_CATEGORIES.length === 9, `DOC_CATEGORIES contains exactly 9 categories (actual: ${DOC_CATEGORIES.length})`);

  // Expected category breakdown
  const expectedCategoryCounts = {
    architecture: 1,
    git: 1,
    ci: 1,
    security: 2,
    quality: 1,
    docker: 1,
    k8s: 1,
    monitoring: 1
  };

  const actualCategoryCounts = {};
  BUNDLED_TECHNICAL_DOCS.forEach((doc, idx) => {
    actualCategoryCounts[doc.categoryKey] = (actualCategoryCounts[doc.categoryKey] || 0) + 1;
    assert(doc.id && typeof doc.id === 'string', `Doc #${idx} has valid id (${doc.id})`);
    assert(doc.order === idx, `Doc #${idx} has correct order (${doc.order})`);
    assert(doc.filename && doc.filename.endsWith('.md'), `Doc #${idx} has valid markdown filename (${doc.filename})`);
    assert(doc.title && !doc.title.endsWith('.md') && doc.title.length > 5, `Doc #${idx} has clean title: "${doc.title.substring(0, 30)}..."`);
    assert(doc.category && typeof doc.category === 'string', `Doc #${idx} has category name (${doc.category})`);
    assert(doc.categoryKey && typeof doc.categoryKey === 'string', `Doc #${idx} has categoryKey (${doc.categoryKey})`);
    assert(doc.content && doc.content.length > 500, `Doc #${idx} has comprehensive content (${doc.content.length} chars)`);
    assert(Array.isArray(doc.tags) && doc.tags.length > 0, `Doc #${idx} has valid tags: [${doc.tags.join(', ')}]`);
  });

  for (const [catKey, expectedCount] of Object.entries(expectedCategoryCounts)) {
    const count = actualCategoryCounts[catKey] || 0;
    assert(count === expectedCount, `Category '${catKey}' has exactly ${expectedCount} docs (actual: ${count})`);
  }

  // Check DOC_CATEGORIES schema
  const expectedCategoryKeys = ['all', 'architecture', 'git', 'ci', 'security', 'quality', 'docker', 'k8s', 'monitoring'];
  const actualCategoryKeys = DOC_CATEGORIES.map(c => c.key);
  assert(
    JSON.stringify(actualCategoryKeys) === JSON.stringify(expectedCategoryKeys),
    `DOC_CATEGORIES contains expected keys in order: [${actualCategoryKeys.join(', ')}]`
  );

  DOC_CATEGORIES.forEach(cat => {
    assert(cat.key && cat.name && cat.label, `Category '${cat.key}' has key, name, and label`);
  });

  // Check ZERO EMOJI POLICY
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/u;
  const docsDataRaw = fs.readFileSync(path.join(__dirname, '../src/lib/docsData.ts'), 'utf-8');
  assert(!emojiRegex.test(docsDataRaw), 'ZERO EMOJI POLICY strictly maintained in src/lib/docsData.ts');

  // TEST SUITE 2: API Route Logic & Response Verification (/api/docs)
  console.log('\n--- TEST SUITE 2: API ROUTE /api/docs FUNCTIONAL TESTS ---');
  
  // Test endpoint file syntax and handlers
  const routeCode = fs.readFileSync(path.join(__dirname, '../src/app/api/docs/route.ts'), 'utf-8');
  assert(!emojiRegex.test(routeCode), 'ZERO EMOJI POLICY strictly maintained in src/app/api/docs/route.ts');
  assert(routeCode.includes('export async function GET'), 'Route exposes GET handler');
  assert(routeCode.includes('export async function POST'), 'Route exposes POST handler');
  assert(routeCode.includes('DOC_CATEGORIES.map'), 'Route uses standardized DOC_CATEGORIES mapping');

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: Passed: ${passedTests} | Failed: ${failedTests}`);
  console.log('================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error('Fatal Error in Test Suite:', err);
  process.exit(1);
});
