#!/usr/bin/env node

require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const FRENCH_LOCALE_ID = '684683d87f6a3ae6079ec99f';

async function checkChallengeFrench() {
  console.log('🔍 Checking challenge page French content...\n');
  
  // Get pages and look for challenge pages
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
  
  // Find challenge-related pages
  const challengePages = pagesData.pages?.filter(p => 
    p.slug.includes('challenge') || 
    p.title.toLowerCase().includes('challenge')
  ) || [];
  
  console.log(`Found ${challengePages.length} challenge-related pages:\n`);
  
  // Check the main challenge page
  const mainChallenge = challengePages.find(p => p.slug === 'challenge');
  
  if (mainChallenge) {
    console.log(`📄 Main Challenge Page:`);
    console.log(`   Title: ${mainChallenge.title}`);
    console.log(`   Slug: ${mainChallenge.slug}`);
    console.log(`   ID: ${mainChallenge.id}`);
    
    // Check default content
    const defaultResponse = await fetch(
      `https://api.webflow.com/v2/pages/${mainChallenge.id}/dom?limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const defaultData = await defaultResponse.json();
    console.log(`   Default locale nodes: ${defaultData.pagination?.total || 0}`);
    
    // Check French content with proper locale parameter
    console.log('\n   Checking French locale...');
    
    // Try different approaches
    const approaches = [
      { 
        url: `https://api.webflow.com/v2/pages/${mainChallenge.id}/dom?locale=${FRENCH_LOCALE_ID}`,
        desc: 'With locale parameter'
      },
      {
        url: `https://api.webflow.com/v2/pages/${mainChallenge.id}/dom`,
        headers: { 'X-Locale-Id': FRENCH_LOCALE_ID },
        desc: 'With locale header'
      }
    ];
    
    for (const approach of approaches) {
      console.log(`\n   Trying: ${approach.desc}`);
      
      const headers = {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'accept': 'application/json',
        ...approach.headers
      };
      
      const response = await fetch(approach.url, { headers });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Success! Total nodes: ${data.pagination?.total || 0}`);
        
        if (data.nodes?.[0]) {
          const node = data.nodes[0];
          console.log(`   First node type: ${node.type}`);
          if (node.text) {
            const text = typeof node.text === 'string' ? node.text : node.text?.text;
            console.log(`   First text: "${text?.substring(0, 50)}..."`);
          }
        }
      } else {
        console.log(`   ❌ Failed: ${response.status}`);
      }
    }
  }
  
  // Check if we need to use a different API endpoint
  console.log('\n\n📋 Checking alternate API endpoints...');
  
  // Try the static content endpoint
  console.log('\nTrying static content endpoint...');
  const staticResponse = await fetch(
    `https://api.webflow.com/v2/pages/${mainChallenge.id}/static`,
    {
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'accept': 'application/json'
      }
    }
  );
  
  console.log(`Static endpoint status: ${staticResponse.status}`);
  
  // Show site locales info
  console.log('\n\n🌐 Site Locales Configuration:');
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
    console.log('\nPrimary locale:', siteData.locales?.primary);
    console.log('\nSecondary locales:');
    siteData.locales?.secondary?.forEach((locale, i) => {
      console.log(`${i + 1}. ${locale.displayName} (${locale.tag})`);
      console.log(`   ID: ${locale.id}`);
      console.log(`   Subdirectory: ${locale.subdirectory}`);
      console.log(`   Enabled: ${locale.enabled}`);
      
      if (locale.tag === 'fr' || locale.displayName.toLowerCase().includes('french')) {
        console.log(`   ✅ This is the French locale!`);
        
        if (locale.id !== FRENCH_LOCALE_ID) {
          console.log(`   ⚠️  Note: The ID differs from what we have configured`);
          console.log(`      Configured: ${FRENCH_LOCALE_ID}`);
          console.log(`      Actual: ${locale.id}`);
        }
      }
    });
  }
}

checkChallengeFrench();