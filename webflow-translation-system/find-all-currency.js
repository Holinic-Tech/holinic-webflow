#!/usr/bin/env node

// Find ALL currency symbols including those I missed
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf';

async function findAllCurrency() {
  console.log('\n💵 Finding ALL currency symbols...\n');
  
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
    
    // Get all nodes
    let allNodes = [];
    let offset = 0;
    const limit = 100;
    
    while (true) {
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
      allNodes = allNodes.concat(data.nodes);
      
      if (offset + limit >= data.pagination.total) break;
      offset += limit;
    }
    
    // Find ALL nodes with $ symbol
    const currencyNodes = [];
    allNodes.forEach(node => {
      if (node.type === 'text' && node.text) {
        const text = node.text.text || '';
        const html = node.text.html || '';
        
        // Look for any $ symbol
        if (text.includes('$') || html.includes('$')) {
          currencyNodes.push({
            id: node.id,
            text: text,
            html: html,
            // Extract just the currency part for easier viewing
            currencyPart: text.match(/\$[\d,]+|\d+\s*\$/g) || html.match(/\$[\d,]+|\d+\s*\$/g)
          });
        }
      }
    });
    
    console.log(`Found ${currencyNodes.length} nodes with $ symbol:\n`);
    
    currencyNodes.forEach((node, i) => {
      console.log(`${i + 1}. Node ID: ${node.id}`);
      console.log(`   Text: "${node.text}"`);
      if (node.currencyPart) {
        console.log(`   Currency found: ${node.currencyPart.join(', ')}`);
      }
      console.log('');
    });
    
    // Also search for specific terms to fix
    console.log('\n🔍 Searching for terms to fix:\n');
    
    const searchTerms = [
      '14-Day Haircare Challenge',
      '14 Day Haircare Challenge',
      'Good hair days',
      'good hair days'
    ];
    
    searchTerms.forEach(term => {
      const found = allNodes.filter(node => 
        node.type === 'text' && node.text && 
        (node.text.text?.includes(term) || node.text.html?.includes(term))
      );
      
      if (found.length > 0) {
        console.log(`Found "${term}" in ${found.length} nodes:`);
        found.forEach(node => {
          console.log(`   - Node ${node.id}: "${node.text.text?.substring(0, 80)}..."`);
        });
        console.log('');
      }
    });
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

if (require.main === module) {
  findAllCurrency();
}