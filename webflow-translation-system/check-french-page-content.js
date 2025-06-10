#!/usr/bin/env node

require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const FRENCH_LOCALE_ID = '684683d87f6a3ae6079ec99f';

async function checkFrenchContent() {
  console.log('🔍 Checking French page content...\n');
  
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
  const page = pagesData.pages.find(p => p.slug === 'the-haircare-challenge' || p.slug === 'challenge');
  
  if (!page) {
    console.log('❌ Page not found');
    console.log('Available pages:', pagesData.pages.map(p => p.slug));
    return;
  }
  
  console.log(`Found page: ${page.title} (${page.slug})\n`);
  
  // Check default locale
  console.log('1️⃣ Default locale content:');
  const defaultResponse = await fetch(
    `https://api.webflow.com/v2/pages/${page.id}/dom?limit=5`,
    {
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'accept': 'application/json'
      }
    }
  );
  
  const defaultData = await defaultResponse.json();
  console.log(`   Total nodes: ${defaultData.pagination?.total || 0}`);
  console.log(`   Sample nodes:`, defaultData.nodes?.slice(0, 3).map(n => ({
    type: n.type,
    text: typeof n.text === 'string' ? n.text.substring(0, 50) + '...' : n.text
  })));
  
  // Check French locale
  console.log('\n2️⃣ French locale content:');
  const frenchResponse = await fetch(
    `https://api.webflow.com/v2/pages/${page.id}/dom?locale=${FRENCH_LOCALE_ID}&limit=5`,
    {
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'accept': 'application/json'
      }
    }
  );
  
  const frenchData = await frenchResponse.json();
  console.log(`   Total nodes: ${frenchData.pagination?.total || 0}`);
  
  if (frenchData.pagination?.total === 0) {
    console.log('\n⚠️  French page has no content!');
    console.log('\n📋 Next steps:');
    console.log('1. Open the page in Webflow Designer');
    console.log('2. Switch to French locale using the locale switcher in the top bar');
    console.log('3. Make a small edit and save (this creates the locale structure)');
    console.log('4. Publish the site');
    console.log('5. Run the translation script again');
  } else {
    console.log(`   Sample nodes:`, frenchData.nodes?.slice(0, 3).map(n => ({
      type: n.type,
      text: typeof n.text === 'string' ? n.text.substring(0, 50) + '...' : n.text
    })));
  }
  
  // Show update endpoint info
  console.log('\n3️⃣ Update endpoint for French:');
  console.log(`   POST https://api.webflow.com/v2/pages/${page.id}/update`);
  console.log('   Body: { "locale": "' + FRENCH_LOCALE_ID + '", "fields": { "nodeId": "text" } }');
}

checkFrenchContent();