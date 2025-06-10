#!/usr/bin/env node

// Test French locale configuration
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const FRENCH_LOCALE_ID = '684683d87f6a3ae6079ec99f';

async function testFrenchLocale() {
  console.log('🇫🇷 Testing French locale configuration...\n');
  
  try {
    // 1. Find the main page
    console.log('1️⃣ Finding the haircare challenge page...');
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
    const challengePage = pagesData.pages.find(p => p.slug === 'the-haircare-challenge');
    
    if (!challengePage) {
      throw new Error('Could not find the-haircare-challenge page');
    }
    
    console.log(`✅ Found page: ${challengePage.title} (ID: ${challengePage.id})`);
    
    // 2. Test DOM API with French locale
    console.log('\n2️⃣ Testing DOM API with French locale...');
    const frenchDomResponse = await fetch(
      `https://api.webflow.com/v2/pages/${challengePage.id}/dom?localeId=${FRENCH_LOCALE_ID}&limit=5`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    console.log(`   Status: ${frenchDomResponse.status} ${frenchDomResponse.statusText}`);
    
    if (!frenchDomResponse.ok) {
      const error = await frenchDomResponse.text();
      console.log('   Error:', error);
      throw new Error('Failed to fetch French DOM');
    }
    
    const frenchData = await frenchDomResponse.json();
    console.log(`✅ French locale works! Total nodes: ${frenchData.pagination.total}`);
    
    // 3. Check if content is already translated
    console.log('\n3️⃣ Checking content status...');
    let hasTranslations = false;
    let hasCurrency = false;
    
    frenchData.nodes.forEach((node, index) => {
      if (node.text) {
        console.log(`   Node ${index + 1}: "${node.text.substring(0, 50)}..."`);
        
        // Check for French patterns or Euro symbol
        if (node.text.includes('€')) {
          hasCurrency = true;
        }
        
        // Check for common French words
        const frenchIndicators = ['le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'pour', 'avec'];
        if (frenchIndicators.some(word => node.text.toLowerCase().includes(` ${word} `))) {
          hasTranslations = true;
        }
      }
    });
    
    if (hasTranslations || hasCurrency) {
      console.log('\n✅ French content appears to already have some translations');
    } else {
      console.log('\n⚠️  French content appears to be in English (not yet translated)');
    }
    
    // 4. Compare with default (English) content
    console.log('\n4️⃣ Comparing with default English content...');
    const englishDomResponse = await fetch(
      `https://api.webflow.com/v2/pages/${challengePage.id}/dom?limit=5`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (englishDomResponse.ok) {
      const englishData = await englishDomResponse.json();
      console.log(`   English nodes: ${englishData.pagination.total}`);
      console.log(`   French nodes: ${frenchData.pagination.total}`);
      
      if (englishData.pagination.total === frenchData.pagination.total) {
        console.log('   ✅ Same number of nodes in both languages');
      }
    }
    
    // 5. Summary
    console.log('\n📋 Summary:');
    console.log(`✅ French locale ID is valid: ${FRENCH_LOCALE_ID}`);
    console.log('✅ DOM API accepts the French locale ID');
    console.log(`✅ Page has ${frenchData.pagination.total} DOM nodes`);
    
    if (!hasTranslations) {
      console.log('\n🔄 Next step: Run translation script to translate content to French');
      console.log('   Example: node translate-any-page.js --slug="the-haircare-challenge" --lang="fr"');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testFrenchLocale();
}

module.exports = { testFrenchLocale };