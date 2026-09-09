const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '..', 'cli', 'deneb-cli', 'src', 'tools', 'fivora-template-validator.cjs');
let content = fs.readFileSync(filePath, 'utf8');

const target = 'm=i.includes("@fivora/editable-components")&&(i.includes("SiteDataProvider")||i.includes("BaseSiteDataProvider"))';
const replacement = 'm=(i.includes("@fivora/editable-components")||i.includes("@deneb-ui/ui")||i.includes("@deneb/ui"))&&(i.includes("SiteDataProvider")||i.includes("BaseSiteDataProvider")||i.includes("DenebDataProvider"))';

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully patched validator to recognize @deneb-ui/ui and DenebDataProvider!');
} else if (content.includes(replacement)) {
  console.log('Validator already patched.');
} else {
  console.error('Target string not found in validator!');
  process.exit(1);
}
