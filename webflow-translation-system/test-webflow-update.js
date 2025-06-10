#!/usr/bin/env node

require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const FRENCH_LOCALE_ID = '684683d87f6a3ae6079ec99f';

async function testWebflowUpdate() {
  console.log('🧪 Testing Webflow update methods...\n');
  
  // Get a page
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
  
  console.log(`Page ID: ${page.id}\n`);
  
  // Get a text node
  const domResponse = await fetch(
    `https://api.webflow.com/v2/pages/${page.id}/dom?limit=1`,
    {
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'accept': 'application/json',
        'X-Locale-Id': FRENCH_LOCALE_ID
      }
    }
  );
  
  const domData = await domResponse.json();
  const firstNode = domData.nodes?.[0];
  
  if (!firstNode) {
    console.log('No nodes found');
    return;
  }
  
  console.log('First node:', {
    id: firstNode.id,
    type: firstNode.type,
    text: typeof firstNode.text === 'string' ? firstNode.text : firstNode.text?.text
  });
  
  // Test different update approaches
  console.log('\n🔧 Testing update methods:\n');
  
  // Method 1: PATCH to node endpoint
  console.log('1. PATCH to /dom/nodes/{nodeId}...');
  const patch1Response = await fetch(
    `https://api.webflow.com/v2/pages/${page.id}/dom/nodes/${firstNode.id}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'X-Locale-Id': FRENCH_LOCALE_ID
      },
      body: JSON.stringify({
        text: 'Test French Text'
      })
    }
  );
  console.log(`   Status: ${patch1Response.status}`);
  if (!patch1Response.ok) {
    const error = await patch1Response.text();
    console.log(`   Error: ${error}`);
  }
  
  // Method 2: PUT to node endpoint
  console.log('\n2. PUT to /dom/nodes/{nodeId}...');
  const put1Response = await fetch(
    `https://api.webflow.com/v2/pages/${page.id}/dom/nodes/${firstNode.id}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'X-Locale-Id': FRENCH_LOCALE_ID
      },
      body: JSON.stringify({
        text: 'Test French Text'
      })
    }
  );
  console.log(`   Status: ${put1Response.status}`);
  
  // Method 3: POST to page update
  console.log('\n3. POST to /pages/{pageId}/update...');
  const updateResponse = await fetch(
    `https://api.webflow.com/v2/pages/${page.id}/update`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        locale: FRENCH_LOCALE_ID,
        fields: {
          [firstNode.id]: 'Test French Text'
        }
      })
    }
  );
  console.log(`   Status: ${updateResponse.status}`);
  
  // Method 4: Check for CMS API
  console.log('\n4. Checking for CMS items...');
  const cmsResponse = await fetch(
    `https://api.webflow.com/v2/sites/${SITE_ID}/collections`,
    {
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'accept': 'application/json'
      }
    }
  );
  console.log(`   CMS Collections Status: ${cmsResponse.status}`);
  
  // Method 5: Check static content endpoint
  console.log('\n5. Checking static content endpoint...');
  const staticResponse = await fetch(
    `https://api.webflow.com/v2/pages/${page.id}/static-content`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        locale: FRENCH_LOCALE_ID,
        nodes: [{
          id: firstNode.id,
          text: 'Test French Text'
        }]
      })
    }
  );
  console.log(`   Status: ${staticResponse.status}`);
  
  console.log('\n\n📋 Summary:');
  console.log('The Webflow API v2 does not have a direct page content update endpoint.');
  console.log('Content updates must be done through:');
  console.log('1. Webflow Designer (manual)');
  console.log('2. CMS API (for CMS content)');
  console.log('3. Webflow Apps/Extensions API (requires app setup)');
}

testWebflowUpdate();