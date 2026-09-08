const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '..', 'cli', 'fivora-cli', 'bin', 'index.js');
let content = fs.readFileSync(filePath, 'utf8');

const heroMarker = "'hero': {";
const heroIdx = content.indexOf(heroMarker);

if (heroIdx === -1) {
  console.error("'hero': { not found");
  process.exit(1);
}

// Find the closing brace of the hero object and the registry closing brace
const endOfRegistry = content.indexOf('  };', heroIdx);
if (endOfRegistry === -1) {
  console.error("end of registry '  };' not found");
  process.exit(1);
}

const componentsToAdd = `
    'whatsapp-button': {
      file: 'WhatsAppButton.tsx',
      component: 'WhatsAppButton',
      code: \`'use client';\\n\\nimport { WhatsAppButton, type WhatsAppButtonProps } from '\${importPkg}';\\n\\nexport { WhatsAppButton, type WhatsAppButtonProps };\\n\`,
    },
    'phone-button': {
      file: 'PhoneButton.tsx',
      component: 'PhoneButton',
      code: \`'use client';\\n\\nimport { PhoneButton, type PhoneButtonProps } from '\${importPkg}';\\n\\nexport { PhoneButton, type PhoneButtonProps };\\n\`,
    },
    'email-button': {
      file: 'EmailButton.tsx',
      component: 'EmailButton',
      code: \`'use client';\\n\\nimport { EmailButton, type EmailButtonProps } from '\${importPkg}';\\n\\nexport { EmailButton, type EmailButtonProps };\\n\`,
    },
    'contact-actions': {
      file: 'ContactActions.tsx',
      component: 'ContactActions',
      code: \`'use client';\\n\\nimport { ContactActions, type ContactActionsProps } from '\${importPkg}';\\n\\nexport { ContactActions, type ContactActionsProps };\\n\`,
    },
    'location-card': {
      file: 'LocationCard.tsx',
      component: 'LocationCard',
      code: \`'use client';\\n\\nimport { LocationCard, type LocationCardProps } from '\${importPkg}';\\n\\nexport { LocationCard, type LocationCardProps };\\n\`,
    },
    'location-link': {
      file: 'LocationLink.tsx',
      component: 'LocationLink',
      code: \`'use client';\\n\\nimport { LocationLink, type LocationLinkProps } from '\${importPkg}';\\n\\nexport { LocationLink, type LocationLinkProps };\\n\`,
    },
    'map-embed': {
      file: 'MapEmbed.tsx',
      component: 'MapEmbed',
      code: \`'use client';\\n\\nimport { MapEmbed, type MapEmbedProps } from '\${importPkg}';\\n\\nexport { MapEmbed, type MapEmbedProps };\\n\`,
    },
    'social-links': {
      file: 'SocialLinks.tsx',
      component: 'SocialLinks',
      code: \`'use client';\\n\\nimport { SocialLinks, type SocialLinksProps } from '\${importPkg}';\\n\\nexport { SocialLinks, type SocialLinksProps };\\n\`,
    },
    'social-button': {
      file: 'SocialButton.tsx',
      component: 'SocialButton',
      code: \`'use client';\\n\\nimport { SocialButton, type SocialButtonProps } from '\${importPkg}';\\n\\nexport { SocialButton, type SocialButtonProps };\\n\`,
    },
    'business-hours': {
      file: 'BusinessHours.tsx',
      component: 'BusinessHours',
      code: \`'use client';\\n\\nimport { BusinessHours, type BusinessHoursProps } from '\${importPkg}';\\n\\nexport { BusinessHours, type BusinessHoursProps };\\n\`,
    },
    'deneb-action': {
      file: 'DenebAction.tsx',
      component: 'DenebAction',
      code: \`'use client';\\n\\nimport { DenebAction, type DenebActionProps } from '\${importPkg}';\\n\\nexport { DenebAction, type DenebActionProps };\\n\`,
    },`;

content = content.slice(0, endOfRegistry) + componentsToAdd + '\n' + content.slice(endOfRegistry);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully added smart components to CLI registry!');
