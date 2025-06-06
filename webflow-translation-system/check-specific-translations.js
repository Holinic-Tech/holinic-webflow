#!/usr/bin/env node

// Check specific translations more thoroughly
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf';

// Expected translations
const EXPECTED_TRANSLATIONS = {
  "Say the Challenge is life changing": "Sag, dass die Challenge lebensverändernd ist",
  "See our 100% money-back guarantee": "Sieh dir unsere 100% Geld-zurück-Garantie an",
  "No matter what you try": "Egal was du versuchst"
};

async function checkSpecificTranslations() {
  console.log('\n🔍 Checking specific translations...\n');
  
  try {
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
    
    let offset = 0;
    const limit = 100;
    const found = {};
    
    // Initialize found object
    Object.keys(EXPECTED_TRANSLATIONS).forEach(key => {
      found[key] = false;
    });
    
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
      
      data.nodes.forEach(node => {
        if (node.type === 'text' && node.text?.text) {
          const text = node.text.text;
          
          // Check each expected translation
          Object.entries(EXPECTED_TRANSLATIONS).forEach(([english, german]) => {
            if (text.includes(german) || text.toLowerCase().includes(german.toLowerCase())) {
              found[english] = true;
              console.log(`✅ Found: "${english}" → "${german}"`);
              console.log(`   Node ID: ${node.id}`);
              console.log(`   Full text: "${text.substring(0, 100)}..."\n`);
            }
          });
        }
      });
      
      offset += limit;
    }
    
    // Summary
    console.log('\n📊 Translation Summary:');
    Object.entries(found).forEach(([english, wasFound]) => {
      if (wasFound) {
        console.log(`   ✅ "${english}" - Translated`);
      } else {
        console.log(`   ❌ "${english}" - Not found`);
      }
    });
    
    const allFound = Object.values(found).every(f => f);
    if (allFound) {
      console.log('\n✨ All target strings have been successfully translated!');
    } else {
      console.log('\n⚠️  Some strings were not found. They may have been translated differently.');
    }
    
    console.log('\n🔗 Check the live page:');
    console.log('   https://hairqare.co/de/the-haircare-challenge\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Run
if (require.main === module) {
  checkSpecificTranslations();
}