#!/usr/bin/env node

// Find translations that contain key words
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf';

// Key phrases to search for
const KEY_PHRASES = [
  { english: "Challenge is life changing", keywords: ["Challenge", "lebensverändernd", "Sag"] },
  { english: "No matter what you try", keywords: ["versuchst", "Haarausfall", "unerreichbar", "Egal"] }
];

async function findSimilarTranslations() {
  console.log('\n🔍 Searching for similar translations...\n');
  
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
    
    let offset = 100; // Start from node 101 where missing content was
    const limit = 100;
    
    console.log('Searching nodes 101-520 for key phrases...\n');
    
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
          
          // Check each key phrase
          KEY_PHRASES.forEach(phrase => {
            const hasKeywords = phrase.keywords.some(keyword => 
              text.toLowerCase().includes(keyword.toLowerCase())
            );
            
            if (hasKeywords) {
              console.log(`🔍 Possible match for "${phrase.english}":`);
              console.log(`   Node ID: ${node.id}`);
              console.log(`   Text: "${text}"\n`);
            }
          });
          
          // Also check for any text containing emoji that might be the third string
          if (text.includes('😭') || text.includes('Haarausfall')) {
            console.log(`🔍 Text with hair loss/emoji:`);
            console.log(`   Node ID: ${node.id}`);
            console.log(`   Text: "${text}"\n`);
          }
        }
      });
      
      offset += limit;
    }
    
    console.log('🔗 Check the live page to verify:');
    console.log('   https://hairqare.co/de/the-haircare-challenge\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Run
if (require.main === module) {
  findSimilarTranslations();
}