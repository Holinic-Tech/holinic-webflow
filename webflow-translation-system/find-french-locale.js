#!/usr/bin/env node

require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function findFrenchLocale() {
  console.log('🔍 Searching for French locale...\n');
  
  try {
    // Try the locales endpoint
    console.log('Checking /locales endpoint...');
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
      console.log('Locales response:', JSON.stringify(localesData, null, 2));
    } else {
      console.log('Locales endpoint failed:', localesResponse.status);
    }
    
    // Try pages endpoint to see locale info
    console.log('\nChecking pages for locale information...');
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
    const page = pagesData.pages?.find(p => p.slug === 'challenge');
    
    if (page) {
      console.log('\nPage info:', {
        id: page.id,
        slug: page.slug,
        localeId: page.localeId
      });
      
      // Try to get DOM with different locale IDs
      console.log('\nTrying known locale IDs...');
      const knownLocaleIds = [
        '684683d87f6a3ae6079ec99f', // Previous French ID
        '684230454832f0132d5f6ccf', // German ID
      ];
      
      // Also try variations
      const possibleCodes = ['fr', 'fr-FR', 'fra', 'french'];
      
      for (const localeId of knownLocaleIds) {
        console.log(`\nTrying locale ID: ${localeId}`);
        const domResponse = await fetch(
          `https://api.webflow.com/v2/pages/${page.id}/dom?locale=${localeId}&limit=1`,
          {
            headers: {
              'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
              'accept': 'application/json'
            }
          }
        );
        
        if (domResponse.ok) {
          const domData = await domResponse.json();
          console.log(`  Success! Total nodes: ${domData.pagination?.total || 0}`);
        } else {
          console.log(`  Failed: ${domResponse.status}`);
        }
      }
      
      // Try without locale to see default
      console.log('\nGetting default DOM (no locale specified)...');
      const defaultDomResponse = await fetch(
        `https://api.webflow.com/v2/pages/${page.id}/dom?limit=1`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json'
          }
        }
      );
      
      if (defaultDomResponse.ok) {
        const defaultDomData = await defaultDomResponse.json();
        console.log('Default DOM info:', {
          total: defaultDomData.pagination?.total,
          locale: defaultDomData.locale,
          nodes: defaultDomData.nodes?.length
        });
      }
    }
    
    // Check site settings
    console.log('\nChecking site settings...');
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
      console.log('Site localization info:', {
        localization: siteData.localization,
        locales: siteData.locales
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

findFrenchLocale();