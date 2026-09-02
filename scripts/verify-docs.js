const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'docs', 'guides');
const files = fs.readdirSync(dir);

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/u;

console.log('Found ' + files.length + ' files in docs/guides:');
let allClean = true;

files.forEach((f) => {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  const hasEmoji = emojiRegex.test(content);
  const hasMermaid = content.includes('```mermaid');
  const hasAscii = content.includes('+---') || content.includes('|');
  const hasCode =
    content.includes('```bash') ||
    content.includes('```yaml') ||
    content.includes('```groovy') ||
    content.includes('```dockerfile') ||
    content.includes('```properties') ||
    content.includes('```xml') ||
    content.includes('```json');

  console.log(
    'File: ' +
      f +
      ' | Size: ' +
      content.length +
      ' chars | HasEmoji: ' +
      hasEmoji +
      ' | HasMermaid: ' +
      hasMermaid +
      ' | HasAscii: ' +
      hasAscii +
      ' | HasCode: ' +
      hasCode
  );
  if (hasEmoji) allClean = false;
});

const docsDataPath = path.join(__dirname, '..', 'src', 'lib', 'docsData.ts');
const docsDataContent = fs.readFileSync(docsDataPath, 'utf-8');
const docsDataHasEmoji = emojiRegex.test(docsDataContent);
console.log('src/lib/docsData.ts HasEmoji: ' + docsDataHasEmoji);

const routePath = path.join(__dirname, '..', 'src', 'app', 'api', 'docs', 'route.ts');
const routeContent = fs.readFileSync(routePath, 'utf-8');
const routeHasEmoji = emojiRegex.test(routeContent);
console.log('src/app/api/docs/route.ts HasEmoji: ' + routeHasEmoji);

if (allClean && !routeHasEmoji && !docsDataHasEmoji && files.length === 9) {
  console.log('>>> [SUCCESS] TAT CA 9 TAI LIEU VA ROUTE API DAT CHUAN ZERO EMOJI VA INTEGRITY 100% <<<');
} else {
  console.error('>>> [ERROR] PHAT HIEN LOI HOAC EMOJI <<<');
  process.exit(1);
}
