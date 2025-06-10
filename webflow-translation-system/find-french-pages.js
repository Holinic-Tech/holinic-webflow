#!/usr/bin/env node

require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const FRENCH_LOCALE_ID = '684683d87f6a3ae6079ec99f';

async function findFrenchPages() {
  console.log('🔍 Searching for French pages...\n');
  
  // Get all pages
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
  console.log(`Found ${pagesData.pages?.length || 0} total pages\n`);
  
  // Check each page for French content
  for (const page of pagesData.pages || []) {
    console.log(`\n📄 Page: ${page.title} (${page.slug})`);
    console.log(`   ID: ${page.id}`);
    console.log(`   Locale ID: ${page.localeId || 'none'}`);
    
    // Check if this page has French content
    try {
      const frenchResponse = await fetch(
        `https://api.webflow.com/v2/pages/${page.id}/dom?locale=${FRENCH_LOCALE_ID}&limit=1`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json'
          }
        }
      );
      
      if (frenchResponse.ok) {
        const frenchData = await frenchResponse.json();
        const nodeCount = frenchData.pagination?.total || 0;
        
        if (nodeCount > 0) {
          console.log(`   ✅ French content: ${nodeCount} nodes`);
          
          // Show first node as sample
          if (frenchData.nodes?.[0]) {
            const node = frenchData.nodes[0];
            const text = typeof node.text === 'string' ? node.text : node.text?.text;
            console.log(`   Sample: "${text?.substring(0, 80)}..."`);
          }
        } else {
          console.log(`   ❌ No French content (0 nodes)`);
        }
      } else {
        console.log(`   ⚠️  Error checking French content: ${frenchResponse.status}`);
      }
    } catch (error) {
      console.log(`   ⚠️  Error: ${error.message}`);
    }
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Check site localization settings
  console.log('\n\n🌐 Site Localization Info:');
  const siteResponse = await fetch(
    `https://api.webflow.com/v2/sites/${SITE_ID}`,
    {
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'accept': 'application/json'
      }
    }
  );
  
  if (siteResponse.ok) {
    const siteData = await siteResponse.json();
    console.log('\nLocales configuration:');
    console.log(JSON.stringify(siteData.locales, null, 2));
  }
}

findFrenchPages();