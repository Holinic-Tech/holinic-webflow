#!/usr/bin/env node

// Check specific price nodes on /challenge page
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const PAGE_ID = '672de5d83bf4c27aff31c9a3'; // challenge page
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf';

// Specific prices mentioned by user
const PRICE_PATTERNS = [
  '$99', '$29', '$35', '$15', '$20', '$39', '$294', '324€'
];

async function checkSpecificPrices() {
  console.log('\n🔍 Checking specific price nodes...\n');
  
  try {
    // Get all German nodes
    const allNodes = [];
    let offset = 0;
    const limit = 100;
    
    while (true) {
      const response = await fetch(
        `https://api.webflow.com/v2/pages/${PAGE_ID}/dom?localeId=${GERMAN_LOCALE_ID}&limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      allNodes.push(...data.nodes);
      
      if (data.nodes.length < limit) break;
      offset += limit;
    }
    
    // Find text nodes with prices
    console.log('📋 Text nodes containing prices:\n');
    let foundCount = 0;
    
    allNodes.forEach(node => {
      if (node.type === 'text' && node.text && node.text.text) {
        const text = node.text.text;
        
        // Check for any price pattern
        PRICE_PATTERNS.forEach(pattern => {
          if (text.includes(pattern)) {
            foundCount++;
            console.log(`Node ${node.id}:`);
            console.log(`   Text: "${text}"`);
            console.log(`   Pattern found: ${pattern}`);
            console.log(`   ${text.includes('$') ? '❌ Still has $' : '✅ Currency OK'}`);
            console.log('');
          }
        });
      }
    });
    
    if (foundCount === 0) {
      // Look for any dollar signs
      console.log('🔍 Looking for ANY dollar signs...\n');
      allNodes.forEach(node => {
        if (node.type === 'text' && node.text && node.text.text) {
          const text = node.text.text;
          if (text.includes('$')) {
            console.log(`Node ${node.id}: "${text}"`);
          }
        }
      });
    }
    
    // Also check English version for comparison
    console.log('\n📋 Checking English version for comparison...');
    const englishResponse = await fetch(
      `https://api.webflow.com/v2/pages/${PAGE_ID}/dom?limit=100`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const englishData = await englishResponse.json();
    const englishPrices = [];
    
    englishData.nodes.forEach(node => {
      if (node.type === 'text' && node.text && node.text.text) {
        const text = node.text.text;
        PRICE_PATTERNS.forEach(pattern => {
          if (text.includes(pattern)) {
            englishPrices.push({
              id: node.id,
              text: text
            });
          }
        });
      }
    });
    
    console.log(`\nFound ${englishPrices.length} price nodes in English version`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Run
if (require.main === module) {
  checkSpecificPrices();
}