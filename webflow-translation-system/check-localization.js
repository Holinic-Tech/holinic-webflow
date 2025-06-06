#!/usr/bin/env node

// Check Webflow localization settings
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function checkLocalization() {
  console.log('\n🌐 Checking Webflow localization settings...\n');
  
  try {
    // 1. Get site info
    console.log('1. Getting site information...');
    const siteResponse = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (!siteResponse.ok) {
      throw new Error(`Site API error: ${siteResponse.status}`);
    }
    
    const siteData = await siteResponse.json();
    console.log(`Site: ${siteData.displayName}`);
    console.log(`Locales: ${JSON.stringify(siteData.locales || 'Not configured')}`);
    console.log(`Default locale: ${siteData.defaultLocale || 'Not set'}`);
    
    // 2. Check if there's a locales endpoint
    console.log('\n2. Checking for locales endpoint...');
    const localesResponse = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}/locales`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (localesResponse.ok) {
      const localesData = await localesResponse.json();
      console.log('✅ Localization is enabled!');
      console.log(`Found ${localesData.locales?.length || 0} locales:`);
      
      if (localesData.locales) {
        localesData.locales.forEach(locale => {
          console.log(`   - ${locale.displayName} (${locale.code}) ${locale.isDefault ? '[DEFAULT]' : ''}`);
        });
      }
      
      // Check for German locale
      const germanLocale = localesData.locales?.find(l => l.code === 'de' || l.code === 'de-DE');
      if (germanLocale) {
        console.log(`\n✅ German locale found: ${germanLocale.displayName} (${germanLocale.code})`);
        console.log('This explains why /de/ URLs work!');
        
        // Now we need to use locale-specific content
        console.log('\n3. Getting the haircare challenge page with locale...');
        const mainPage = await getPageBySlug('the-haircare-challenge');
        if (mainPage) {
          console.log(`\nPage ID: ${mainPage.id}`);
          console.log('\nTo translate this page to German, we need to:');
          console.log('1. Get the page content with locale parameter');
          console.log('2. Update the content for the German locale');
          
          // Try to get localized content
          const localizedContent = await getLocalizedContent(mainPage.id, germanLocale.id || 'de');
          if (localizedContent) {
            console.log('\n✅ Can access localized content!');
          }
        }
      }
    } else {
      console.log('❌ Localization might not be enabled or accessible via API');
      console.log(`Response: ${localesResponse.status} ${localesResponse.statusText}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function getPageBySlug(slug) {
  const response = await fetch(
    `https://api.webflow.com/v2/sites/${SITE_ID}/pages`,
    {
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'accept': 'application/json'
      }
    }
  );
  
  if (response.ok) {
    const data = await response.json();
    return data.pages.find(p => p.slug === slug);
  }
  return null;
}

async function getLocalizedContent(pageId, locale) {
  try {
    const response = await fetch(
      `https://api.webflow.com/v2/pages/${pageId}/content?locale=${locale}`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error getting localized content:', error.message);
  }
  return null;
}

checkLocalization();