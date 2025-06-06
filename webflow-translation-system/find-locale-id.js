#!/usr/bin/env node

// Find the German locale ObjectId
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function findGermanLocaleId() {
  console.log('\n🔍 Searching for German locale ObjectId...\n');
  
  try {
    // 1. Try the site endpoint to see if locales are listed there
    console.log('1. Checking site information...');
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
      console.log(`Site: ${siteData.displayName}`);
      
      // Check for locales in site data
      if (siteData.locales) {
        console.log('Locales found in site data:', JSON.stringify(siteData.locales, null, 2));
      }
      
      // Check all properties for locale information
      console.log('\n2. Checking for locale-related properties...');
      Object.keys(siteData).forEach(key => {
        if (key.toLowerCase().includes('locale') || key.toLowerCase().includes('lang')) {
          console.log(`   ${key}: ${JSON.stringify(siteData[key])}`);
        }
      });
    }
    
    // 2. Try to find a German page variant
    console.log('\n3. Looking for German page variants...');
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
    
    // Look for pages that might be German variants
    const germanPages = pagesData.pages.filter(page => {
      const slug = page.slug || '';
      const title = page.title || '';
      return slug.includes('/de/') || slug.includes('de-') || title.toLowerCase().includes('german') || title.includes('DE');
    });
    
    if (germanPages.length > 0) {
      console.log(`Found ${germanPages.length} potential German pages:`);
      germanPages.forEach(page => {
        console.log(`   - ${page.slug} (${page.title}) - ID: ${page.id}`);
      });
      
      // Check if any have locale information
      for (const page of germanPages) {
        const pageResponse = await fetch(
          `https://api.webflow.com/v2/pages/${page.id}`,
          {
            headers: {
              'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
              'accept': 'application/json'
            }
          }
        );
        
        if (pageResponse.ok) {
          const pageData = await pageResponse.json();
          if (pageData.localeId) {
            console.log(`\n✅ Found locale ID on page ${page.slug}: ${pageData.localeId}`);
            return pageData.localeId;
          }
        }
      }
    }
    
    // 3. Try to access the page with different approaches
    console.log('\n4. Testing direct access to German content...');
    const mainPage = pagesData.pages.find(p => p.slug === 'the-haircare-challenge');
    
    if (mainPage) {
      // Try to get the page details
      const pageDetailResponse = await fetch(
        `https://api.webflow.com/v2/pages/${mainPage.id}`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json'
          }
        }
      );
      
      if (pageDetailResponse.ok) {
        const pageDetail = await pageDetailResponse.json();
        console.log('\nPage details:');
        Object.keys(pageDetail).forEach(key => {
          if (key.toLowerCase().includes('locale') || key === 'locales') {
            console.log(`   ${key}: ${JSON.stringify(pageDetail[key])}`);
          }
        });
      }
    }
    
    console.log('\n❌ Could not find German locale ObjectId');
    console.log('\nNext steps:');
    console.log('1. The German locale might need to be properly configured in Webflow');
    console.log('2. You might need to create a locale-specific page in Webflow Designer');
    console.log('3. Check Webflow\'s localization settings in the project settings');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run
findGermanLocaleId();