const fs = require('fs');

const filePath = 'src/lib/blog-posts.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Fix all mojibake sequences
content = content.replaceAll('â‰ ', '≠ ');
content = content.replaceAll('â‰', '≠');
content = content.replaceAll('â€"', '—');
content = content.replaceAll('â€ ', '— ');

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Fixed encoding in blog-posts.ts');

// Verify
const fixed = fs.readFileSync(filePath, 'utf8');
const hasCorruption = /â€|â‰/.test(fixed);
if (hasCorruption) {
  console.log('⚠ Warning: Corruption still found');
  process.exit(1);
} else {
  console.log('✓ Verification: No corruption remaining');
}
