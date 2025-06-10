#!/usr/bin/env node

require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function checkAllLocales() {
  console.log('🔍 Checking all locale configurations...\n');
  
  try {
    // Get site details
    const siteResponse = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const siteData = await siteResponse.json();
    console.log('Site locales configuration:');
    console.log('Primary:', siteData.locales?.primary);
    console.log('Secondary:');
    if (siteData.locales?.secondary) {
      siteData.locales.secondary.forEach((locale, index) => {
        console.log(`  ${index + 1}:`, locale);
      });
    }
    
    // Get pages and check their locale IDs
    console.log('\n📄 Checking pages...');
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
    console.log('Pages found:');
    pagesData.pages?.forEach(page => {
      console.log(`  - ${page.slug} (ID: ${page.id}, Locale: ${page.localeId})`);
    });
    
    // Check challenge page across all known locale IDs
    const challengePage = pagesData.pages?.find(p => p.slug === 'challenge');
    if (challengePage) {
      console.log('\n🧪 Testing challenge page with different locale IDs...');
      
      const localeIds = [
        '684230454832f0132d5f6cd0', // Primary English
        '684230454832f0132d5f6ccf', // German (working)
        '684683d87f6a3ae6079ec99f', // French (used in script)
      ];
      
      // Add any secondary locale IDs from site data
      if (siteData.locales?.secondary) {
        siteData.locales.secondary.forEach(locale => {
          if (!localeIds.includes(locale.id)) {
            localeIds.push(locale.id);
          }
        });
      }
      
      for (const localeId of localeIds) {
        console.log(`\nTesting locale ID: ${localeId}`);
        const domResponse = await fetch(
          `https://api.webflow.com/v2/pages/${challengePage.id}/dom?localeId=${localeId}&limit=1`,
          {
            headers: {
              'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
              'accept': 'application/json'
            }
          }
        );
        
        if (domResponse.ok) {
          const domData = await domResponse.json();
          console.log(`  ✅ Success - Total nodes: ${domData.pagination?.total || 0}`);
          
          // Check a few nodes for language detection
          if (domData.nodes && domData.nodes.length > 0) {
            const firstTextNode = domData.nodes.find(n => n.type === 'text' && n.text?.text);
            if (firstTextNode) {
              console.log(`  Sample text: "${firstTextNode.text.text.substring(0, 50)}..."`);
            }
          }
        } else {
          console.log(`  ❌ Failed: ${domResponse.status} - ${domResponse.statusText}`);
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAllLocales();