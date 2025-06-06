#!/usr/bin/env node

// Verify that specific strings were translated
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf';

// Strings to verify
const TARGET_STRINGS = [
  "Say the Challenge is life changing",
  "See our 100% money-back guarantee",
  "No matter what you try, the solution to your hair loss  remains out of reach"
];

async function verifyTranslations() {
  console.log('\n🔍 Verifying translations...\n');
  
  try {
    // Get the page
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
    const page = pagesData.pages.find(p => p.slug === 'the-haircare-challenge');
    
    // Get German content
    console.log('Fetching German content...\n');
    let foundCount = 0;
    let offset = 0;
    const limit = 100;
    
    while (offset < 520) {
      const response = await fetch(
        `https://api.webflow.com/v2/pages/${page.id}/dom?localeId=${GERMAN_LOCALE_ID}&limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      
      // Search for translations
      data.nodes.forEach(node => {
        if (node.type === 'text' && node.text?.text) {
          const text = node.text.text;
          
          // Check for German versions of our target strings
          if (text.includes('Sag, dass die Challenge lebensverändernd ist') ||
              text.includes('Sieh dir unsere 100% Geld-zurück-Garantie an') ||
              text.includes('Egal was du versuchst')) {
            console.log(`✅ Found German translation: "${text.substring(0, 60)}..."`);
            foundCount++;
          }
        }
      });
      
      offset += limit;
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   Found ${foundCount} of the ${TARGET_STRINGS.length} missing strings in German`);
    
    if (foundCount >= TARGET_STRINGS.length) {
      console.log('\n✨ All missing strings have been successfully translated!');
    } else {
      console.log('\n⚠️  Some strings may still need translation.');
      console.log('   Run a full page check on the live site.');
    }
    
    console.log('\n🔗 Check the live page:');
    console.log('   https://hairqare.co/de/the-haircare-challenge\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Run
if (require.main === module) {
  verifyTranslations();
}