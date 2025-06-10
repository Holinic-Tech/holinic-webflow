#!/usr/bin/env node

require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const FRENCH_LOCALE_ID = '684683d87f6a3ae6079ec99f';

async function verifyFrenchTranslation() {
  console.log('🔍 Verifying French translation status...\n');
  
  // Get pages
  const pagesResponse = await fetch(
    `https://api.webflow.com/v2/sites/${SITE_ID}/pages`,
    {
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'accept': 'application/json'
      }
    }
  );
  
  const pagesData = await pagesResponse.json();
  const page = pagesData.pages.find(p => p.slug === 'challenge');
  
  console.log(`Page: ${page.title} (${page.slug})\n`);
  
  // Get French content
  console.log('Checking French content...');
  const frenchResponse = await fetch(
    `https://api.webflow.com/v2/pages/${page.id}/dom?limit=10`,
    {
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'accept': 'application/json',
        'X-Locale-Id': FRENCH_LOCALE_ID
      }
    }
  );
  
  const frenchData = await frenchResponse.json();
  console.log(`Total nodes in French locale: ${frenchData.pagination?.total || 0}\n`);
  
  // Check sample nodes
  console.log('Sample French content:');
  let frenchCount = 0;
  let englishCount = 0;
  
  frenchData.nodes?.forEach((node, i) => {
    if (node.type === 'text' && node.text) {
      const text = typeof node.text === 'string' ? node.text : node.text.text;
      if (text && text.trim()) {
        console.log(`${i + 1}. "${text.substring(0, 60)}..."`);
        
        // Check if it's French
        const frenchWords = ['le', 'la', 'les', 'de', 'du', 'des', 'pour', 'avec', 'dans', 'sur'];
        const englishWords = ['the', 'and', 'for', 'with', 'your', 'from', 'that', 'this'];
        
        const textLower = text.toLowerCase();
        const hasFrench = frenchWords.some(word => textLower.includes(` ${word} `) || textLower.startsWith(`${word} `));
        const hasEnglish = englishWords.some(word => textLower.includes(` ${word} `) || textLower.startsWith(`${word} `));
        
        if (hasFrench && !hasEnglish) {
          frenchCount++;
          console.log('   ✅ French');
        } else if (hasEnglish && !hasFrench) {
          englishCount++;
          console.log('   ⚠️  Still English');
        } else {
          console.log('   ❓ Unclear');
        }
      }
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`- French content: ${frenchCount} nodes`);
  console.log(`- English content: ${englishCount} nodes`);
  console.log(`- Total text nodes checked: ${frenchCount + englishCount}`);
  
  if (frenchCount > englishCount) {
    console.log('\n✅ French translation appears to be active!');
    console.log('View at: https://hairqare.co/fr/challenge');
  } else {
    console.log('\n⚠️  Translation may not be complete');
  }
}

verifyFrenchTranslation();