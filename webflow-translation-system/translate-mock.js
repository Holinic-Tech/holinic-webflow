#!/usr/bin/env node

// Mock translation script for testing without API keys
// Usage: node translate-mock.js --url="hairqare.co/de/the-haircare-challenge" --lang="de"

const LANGUAGE_NAMES = {
  de: 'German',
  es: 'Spanish',
  fr: 'French',
  it: 'Italian',
  pt: 'Portuguese',
  nl: 'Dutch'
};

// Mock translations
const MOCK_TRANSLATIONS = {
  de: {
    "Transform Your Hair in 5 Days": "Verwandeln Sie Ihr Haar in 5 Tagen",
    "Join the Challenge": "Nehmen Sie an der Herausforderung teil",
    "Start Today": "Heute beginnen",
    "Learn More": "Mehr erfahren"
  },
  es: {
    "Transform Your Hair in 5 Days": "Transforma tu cabello en 5 días",
    "Join the Challenge": "Únete al desafío",
    "Start Today": "Comienza hoy",
    "Learn More": "Aprende más"
  },
  fr: {
    "Transform Your Hair in 5 Days": "Transformez vos cheveux en 5 jours",
    "Join the Challenge": "Rejoignez le défi",
    "Start Today": "Commencer aujourd'hui",
    "Learn More": "En savoir plus"
  }
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {};
  
  args.forEach(arg => {
    const [key, value] = arg.split('=');
    params[key.replace('--', '')] = value;
  });
  
  return params;
}

// Mock page content
const MOCK_PAGE_CONTENT = {
  nodes: [
    { nodeId: "node1", type: "text", text: "Transform Your Hair in 5 Days" },
    { nodeId: "node2", type: "text", text: "Join the Challenge" },
    { nodeId: "node3", type: "text", text: "Start Today" },
    { nodeId: "node4", type: "text", text: "Learn More" },
    { nodeId: "node5", type: "image", alt: "Hair transformation" },
    { nodeId: "node6", type: "link", href: "/products" }
  ]
};

// Mock translation function
async function mockTranslate(text, targetLanguage) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const translations = MOCK_TRANSLATIONS[targetLanguage] || {};
  return translations[text] || `[${targetLanguage.toUpperCase()}] ${text}`;
}

// Main function
async function main() {
  const args = parseArgs();
  
  if (!args.url || !args.lang) {
    console.log(`
Usage: node translate-mock.js --url="hairqare.co/de/the-haircare-challenge" --lang="de"

This is a MOCK translation script for testing without API keys.
It simulates the translation process with sample data.

Options:
  --url   The full URL of the page to translate (required)
  --lang  Target language code: de, es, fr, it, pt, nl (required)
    `);
    process.exit(1);
  }
  
  if (!LANGUAGE_NAMES[args.lang]) {
    console.error(`\n❌ Invalid language code: ${args.lang}`);
    console.error('Valid codes: de, es, fr, it, pt, nl\n');
    process.exit(1);
  }
  
  console.log(`\n🌐 MOCK Translation of ${args.url} to ${LANGUAGE_NAMES[args.lang]}...\n`);
  
  // Simulate the process
  console.log('📄 Page slug: de/the-haircare-challenge');
  console.log('🔍 Finding page ID...');
  console.log('✅ Page ID: mock-page-id-12345');
  
  console.log('📥 Getting page content...');
  console.log(`✅ Found ${MOCK_PAGE_CONTENT.nodes.length} nodes`);
  
  console.log(`🔄 Translating text content to ${LANGUAGE_NAMES[args.lang]}...`);
  
  let translationCount = 0;
  const translatedNodes = [];
  
  for (const node of MOCK_PAGE_CONTENT.nodes) {
    if (node.type === 'text' && node.text) {
      translationCount++;
      const translatedText = await mockTranslate(node.text, args.lang);
      console.log(`   ${translationCount}. "${node.text}" → "${translatedText}"`);
      translatedNodes.push({
        nodeId: node.nodeId,
        text: translatedText
      });
    }
  }
  
  console.log(`✅ Translated ${translatedNodes.length} text nodes`);
  
  console.log('📤 Updating page with translations...');
  console.log('✅ Page updated successfully');
  
  console.log('📢 Publishing page...');
  console.log('✅ Page published');
  
  console.log(`\n✅ Success! Page translated to ${LANGUAGE_NAMES[args.lang]}`);
  console.log(`🔗 View at: https://${args.url}\n`);
  
  console.log('📋 Summary of translations:');
  translatedNodes.forEach(node => {
    console.log(`   - ${node.text}`);
  });
  console.log('\n⚠️  Note: This was a MOCK translation for testing purposes.\n');
}

// Run if called directly
if (require.main === module) {
  main();
}