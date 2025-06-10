#!/usr/bin/env node

// Try multiple approaches to find locale information
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function findLocaleInfo() {
  console.log('🔍 Searching for locale information using multiple approaches...\n');
  
  try {
    // 1. Check site info for locale data
    console.log('1️⃣ Checking site information...');
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
      console.log('Site name:', siteData.displayName);
      
      // Check for any locale-related fields
      const localeFields = Object.keys(siteData).filter(key => 
        key.toLowerCase().includes('locale') || 
        key.toLowerCase().includes('lang') ||
        key.toLowerCase().includes('i18n')
      );
      
      if (localeFields.length > 0) {
        console.log('Found locale-related fields:');
        localeFields.forEach(field => {
          console.log(`  ${field}:`, siteData[field]);
        });
      } else {
        console.log('No locale-related fields in site data');
      }
    }
    
    // 2. Check pages for locale information
    console.log('\n2️⃣ Checking pages for locale information...');
    const pagesResponse = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}/pages`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (pagesResponse.ok) {
      const pagesData = await pagesResponse.json();
      
      // Look for pages with locale indicators
      const localePages = pagesData.pages.filter(page => {
        const slug = page.slug || '';
        return slug.includes('/de/') || slug.includes('/fr/') || slug.includes('/es/') ||
               slug.includes('-de') || slug.includes('-fr') || slug.includes('-es');
      });
      
      if (localePages.length > 0) {
        console.log(`Found ${localePages.length} pages with locale indicators:`);
        for (const page of localePages) {
          console.log(`\n  Page: ${page.slug}`);
          console.log(`  Title: ${page.title}`);
          console.log(`  ID: ${page.id}`);
          
          // Get detailed page info
          const pageDetailResponse = await fetch(
            `https://api.webflow.com/v2/pages/${page.id}`,
            {
              headers: {
                'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
                'accept': 'application/json'
              }
            }
          );
          
          if (pageDetailResponse.ok) {
            const pageDetail = await pageDetailResponse.json();
            
            // Check for locale fields
            const pageLocaleFields = Object.keys(pageDetail).filter(key => 
              key.toLowerCase().includes('locale')
            );
            
            if (pageLocaleFields.length > 0) {
              pageLocaleFields.forEach(field => {
                console.log(`  ${field}:`, pageDetail[field]);
              });
            }
          }
        }
      } else {
        console.log('No pages found with locale indicators in slugs');
      }
    }
    
    // 3. Test DOM API with different locale IDs
    console.log('\n3️⃣ Testing DOM API with known German locale ID...');
    const testPageId = '672c82dd7bb594490ba42d38'; // the-haircare-challenge
    const germanLocaleId = '684230454832f0132d5f6ccf';
    
    // Test with German locale
    const germanDomResponse = await fetch(
      `https://api.webflow.com/v2/pages/${testPageId}/dom?localeId=${germanLocaleId}&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (germanDomResponse.ok) {
      const data = await germanDomResponse.json();
      console.log(`✅ German locale ID works! Total nodes: ${data.pagination.total}`);
      
      // Check first node for language indicator
      if (data.nodes && data.nodes.length > 0) {
        const firstNode = data.nodes[0];
        if (firstNode.text && firstNode.text.includes('€')) {
          console.log('   Content appears to be translated (found € symbol)');
        }
      }
    } else {
      console.log('❌ German locale ID did not work');
    }
    
    // 4. Try to guess other locale IDs by pattern
    console.log('\n4️⃣ Attempting to find other locale IDs by pattern...');
    console.log('Note: The German locale ID is: 684230454832f0132d5f6ccf');
    console.log('This appears to be a MongoDB ObjectId format (24 hex characters)');
    
    // 5. Check if there's a pattern in the API responses
    console.log('\n5️⃣ Checking for locale patterns in API responses...');
    
    // Try the collections endpoint
    const collectionsResponse = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}/collections`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (collectionsResponse.ok) {
      const collectionsData = await collectionsResponse.json();
      console.log(`Found ${collectionsData.collections.length} collections`);
      
      // Check if any collections have locale information
      collectionsData.collections.forEach(collection => {
        if (collection.localeId || collection.locale) {
          console.log(`Collection ${collection.slug} has locale info:`, collection.localeId || collection.locale);
        }
      });
    }
    
    console.log('\n📋 Summary:');
    console.log('- The locales endpoint (/v2/sites/{siteId}/locales) returns 404');
    console.log('- This suggests localization might be handled differently for this site');
    console.log('- The German locale ID (684230454832f0132d5f6ccf) works with the DOM API');
    console.log('- To find French locale ID, you may need to:');
    console.log('  1. Check in Webflow Designer under Site Settings > Localization');
    console.log('  2. Contact Webflow support for API access to locale information');
    console.log('  3. Create a French page variant in Webflow first, then inspect the API response');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
if (require.main === module) {
  findLocaleInfo();
}

module.exports = { findLocaleInfo };