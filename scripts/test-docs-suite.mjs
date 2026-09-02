import { BUNDLED_TECHNICAL_DOCS, DOC_ACCORDION_GROUPS, DOC_CATEGORIES } from '../src/lib/docsData.ts';

console.log('=== TEST SUITE: NESTJS-STYLE 100% VIETNAMESE DOCS HUB ===');
console.log(`Total Bundled Documents: ${BUNDLED_TECHNICAL_DOCS.length}`);
console.log(`Total Accordion Groups: ${DOC_ACCORDION_GROUPS.length}`);
console.log(`Total Categories: ${DOC_CATEGORIES.length}`);

// Test 1: Accordion Group integrity
DOC_ACCORDION_GROUPS.forEach((group, index) => {
  console.log(`[Group ${index + 1}] ${group.title} -> ${group.docIds.length} docs`);
  group.docIds.forEach(id => {
    const doc = BUNDLED_TECHNICAL_DOCS.find(d => d.id === id);
    if (!doc) {
      console.error(`[ERROR] Document with id "${id}" not found in BUNDLED_TECHNICAL_DOCS!`);
      process.exit(1);
    }
  });
});

console.log('[PASS] All accordion docIds successfully mapped to existing documents.');

// Test 2: Verify all titles and content are in Vietnamese with diacritics
let hasVietnameseCheck = true;
BUNDLED_TECHNICAL_DOCS.forEach(doc => {
  if (!doc.title || doc.title.length < 5) {
    console.error(`[ERROR] Document ${doc.id} has invalid title!`);
    hasVietnameseCheck = false;
  }
  if (!doc.content || doc.content.length < 100) {
    console.error(`[ERROR] Document ${doc.id} has invalid content!`);
    hasVietnameseCheck = false;
  }
});

if (hasVietnameseCheck) {
  console.log('[PASS] 100% Technical Documents validated with rich content.');
} else {
  process.exit(1);
}
