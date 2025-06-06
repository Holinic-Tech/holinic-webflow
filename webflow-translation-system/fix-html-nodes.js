#!/usr/bin/env node

// Fix the HTML nodes that had errors
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf';

async function fixHtmlNodes() {
  console.log('\n🔧 Fixing HTML nodes...\n');
  
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
    
    if (!page) {
      console.error('❌ Page not found');
      return;
    }
    
    // The nodes that failed - we need to provide just the inner text, not the full HTML
    const fixNodes = [
      {
        nodeId: '10059b80-9bdb-397f-b23b-1e6cd5ed0db0',
        text: 'Stress'  // Just the text content for h3
      },
      {
        nodeId: '10059b80-9bdb-397f-b23b-1e6cd5ed0dc0',
        text: 'Du möchtest deine Haarprobleme endlich loswerden?'  // Just the text for p
      }
    ];
    
    console.log('Fixing nodes:');
    fixNodes.forEach(node => {
      console.log(`   ${node.nodeId}: "${node.text}"`);
    });
    
    // Update the nodes
    const response = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/dom?localeId=${GERMAN_LOCALE_ID}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          nodes: fixNodes
        })
      }
    );
    
    const result = await response.json();
    
    if (response.ok && (!result.errors || result.errors.length === 0)) {
      console.log('\n✅ HTML nodes fixed successfully!');
    } else {
      console.log('\n⚠️  Result:', result);
    }
    
    // Publish
    console.log('\n📢 Publishing...');
    await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}/publish`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          publishTargets: ['live']
        })
      }
    );
    
    console.log('✅ Complete!');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixHtmlNodes();