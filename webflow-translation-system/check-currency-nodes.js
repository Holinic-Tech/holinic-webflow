#!/usr/bin/env node

// Check currency nodes to understand structure
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf';

async function checkCurrencyNodes() {
  console.log('\n🔍 Checking currency nodes structure...\n');
  
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
    
    // Find nodes with currency
    const currencyNodes = [];
    allNodes.forEach(node => {
      if (node.type === 'text' && node.text) {
        const text = node.text.text || '';
        const html = node.text.html;
        
        if (text.includes('$') || text.includes('USD') || (html && (html.includes('$') || html.includes('USD')))) {
          currencyNodes.push({
            id: node.id,
            text: text,
            html: html,
            attributes: node.text.attributes
          });
        }
      }
    });
    
    console.log(`Found ${currencyNodes.length} nodes with currency symbols:\n`);
    
    currencyNodes.forEach((node, i) => {
      console.log(`\n${i + 1}. Node ID: ${node.id}`);
      console.log(`   Text: "${node.text}"`);
      if (node.html) {
        console.log(`   HTML: "${node.html}"`);
      }
      if (node.attributes) {
        console.log(`   Attributes:`, JSON.stringify(node.attributes, null, 2));
      }
    });
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

if (require.main === module) {
  checkCurrencyNodes();
}