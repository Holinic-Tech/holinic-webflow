#!/usr/bin/env node

require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const FRENCH_LOCALE_ID = '684683d87f6a3ae6079ec99f';

async function initializeFrenchLocale() {
  console.log('🚀 Initializing French locale structure...\n');
  
  // Get pages
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
  
  if (!page) {
    console.log('❌ Page not found');
    return;
  }
  
  console.log(`Found page: ${page.title} (${page.slug})`);
  console.log(`Page ID: ${page.id}\n`);
  
  // Get all nodes from default locale
  console.log('📥 Fetching default content...');
  let allNodes = [];
  let offset = 0;
  const limit = 100;
  
  while (true) {
    const response = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/dom?limit=${limit}&offset=${offset}`,
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
  
  console.log(`Retrieved ${allNodes.length} nodes from default locale\n`);
  
  // Extract text nodes
  const textNodes = allNodes.filter(node => 
    node.type === 'text' && 
    node.text && 
    (typeof node.text === 'string' || node.text.text)
  );
  
  console.log(`Found ${textNodes.length} text nodes to copy\n`);
  
  // Prepare update payload for French locale
  console.log('📝 Copying content to French locale...');
  const updatePayload = {
    locale: FRENCH_LOCALE_ID,
    fields: {}
  };
  
  // Copy each text node to French locale (keeping original English text for now)
  textNodes.forEach(node => {
    const textContent = typeof node.text === 'string' ? node.text : node.text.text;
    updatePayload.fields[node.id] = {
      text: textContent
    };
  });
  
  // Apply the update
  try {
    const response = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/update`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(updatePayload)
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Update failed:', error);
      
      // If it fails, try a simpler approach with just a few nodes
      console.log('\n📋 Trying with smaller batch...');
      const smallPayload = {
        locale: FRENCH_LOCALE_ID,
        fields: {}
      };
      
      // Just copy first 10 nodes
      textNodes.slice(0, 10).forEach(node => {
        const textContent = typeof node.text === 'string' ? node.text : node.text.text;
        smallPayload.fields[node.id] = textContent; // Try without object wrapper
      });
      
      const smallResponse = await fetch(
        `https://api.webflow.com/v2/pages/${page.id}/update`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'Content-Type': 'application/json',
            'accept': 'application/json'
          },
          body: JSON.stringify(smallPayload)
        }
      );
      
      if (smallResponse.ok) {
        console.log('✅ Initialized French locale with first 10 nodes');
        console.log('\n⚠️  Note: Only partial content was copied. You may need to:');
        console.log('1. Open the page in Webflow Designer');
        console.log('2. Switch to French locale');
        console.log('3. Save the page to create full structure');
      } else {
        const smallError = await smallResponse.text();
        console.error('❌ Small batch also failed:', smallError);
      }
      
      return;
    }
    
    console.log('✅ Successfully initialized French locale!');
    
    // Verify the update
    console.log('\n🔍 Verifying French content...');
    const verifyResponse = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/dom?locale=${FRENCH_LOCALE_ID}&limit=5`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const verifyData = await verifyResponse.json();
    console.log(`French locale now has ${verifyData.pagination?.total || 0} nodes`);
    
    if (verifyData.pagination?.total > 0) {
      console.log('\n✅ French locale is ready for translation!');
      console.log('Run: node translate-page-multilingual.js --lang fr --page challenge');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

initializeFrenchLocale();