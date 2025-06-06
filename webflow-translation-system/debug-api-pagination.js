#!/usr/bin/env node

// Debug API response to check for pagination or limits
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function debugApiResponse() {
  console.log('\n🔍 Debugging API Response for Complete Page Content\n');
  
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
    
    console.log(`Page ID: ${page.id}`);
    
    // Try DOM endpoint with different parameters
    console.log('\n1. Testing DOM endpoint with pagination parameters...');
    
    // Standard request
    const domResponse1 = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/dom`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const domData1 = await domResponse1.json();
    console.log(`   Standard request: ${domData1.nodes?.length || 0} nodes`);
    
    // Try with limit parameter
    const domResponse2 = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/dom?limit=1000`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const domData2 = await domResponse2.json();
    console.log(`   With limit=1000: ${domData2.nodes?.length || 0} nodes`);
    
    // Check response headers for pagination info
    console.log('\n2. Response headers:');
    domResponse1.headers.forEach((value, key) => {
      if (key.toLowerCase().includes('link') || 
          key.toLowerCase().includes('page') || 
          key.toLowerCase().includes('limit') ||
          key.toLowerCase().includes('total')) {
        console.log(`   ${key}: ${value}`);
      }
    });
    
    // Check if there's pagination info in the response
    console.log('\n3. Checking response structure:');
    const responseKeys = Object.keys(domData1);
    console.log(`   Response keys: ${responseKeys.join(', ')}`);
    
    if (domData1.pagination) {
      console.log('   Pagination info:', domData1.pagination);
    }
    
    // Try alternative endpoints
    console.log('\n4. Trying alternative approaches...');
    
    // Try offset
    const domResponse3 = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/dom?offset=50`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (domResponse3.ok) {
      const domData3 = await domResponse3.json();
      console.log(`   With offset=50: ${domData3.nodes?.length || 0} nodes`);
    }
    
    // Get the last few nodes to see if content is cut off
    console.log('\n5. Last 5 nodes in response:');
    const lastNodes = domData1.nodes.slice(-5);
    lastNodes.forEach((node, i) => {
      if (node.type === 'text' && node.text) {
        console.log(`   Node ${domData1.nodes.length - 5 + i}: "${node.text.text?.substring(0, 50)}..."`);
      }
    });
    
    // Save raw response for inspection
    console.log('\n6. Saving raw responses...');
    fs.writeFileSync('debug-dom-response.json', JSON.stringify(domData1, null, 2));
    console.log('   Saved to debug-dom-response.json');
    
    // Check total text content length
    let totalTextLength = 0;
    let totalTextNodes = 0;
    domData1.nodes.forEach(node => {
      if (node.type === 'text' && node.text?.text) {
        totalTextLength += node.text.text.length;
        totalTextNodes++;
      }
    });
    
    console.log(`\n7. Content statistics:`);
    console.log(`   Total nodes: ${domData1.nodes.length}`);
    console.log(`   Text nodes: ${totalTextNodes}`);
    console.log(`   Total text length: ${totalTextLength} characters`);
    
    // Search for the missing strings in the raw response
    console.log('\n8. Searching for missing strings in raw response...');
    const rawResponse = JSON.stringify(domData1);
    const searchStrings = [
      "Say the Challenge",
      "money-back guarantee",
      "No matter what you try"
    ];
    
    searchStrings.forEach(str => {
      if (rawResponse.includes(str)) {
        console.log(`   ✅ "${str}" - Found in response`);
      } else {
        console.log(`   ❌ "${str}" - NOT in response`);
      }
    });
    
    console.log('\n💡 Conclusion:');
    if (!searchStrings.some(str => rawResponse.includes(str))) {
      console.log('The missing text is NOT in the API response at all.');
      console.log('This suggests either:');
      console.log('1. The API has a limit on response size');
      console.log('2. The content is loaded differently (dynamic/AJAX)');
      console.log('3. The page structure in Webflow uses a different method for this content');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugApiResponse();