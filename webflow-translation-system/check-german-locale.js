#!/usr/bin/env node

// Check for German locale and page
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function checkGermanLocale() {
  console.log('\n🔍 Checking for German locale...\n');
  
  try {
    // 1. Check locales
    console.log('1. Getting site locales...');
    const localesResponse = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}/locales`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (!localesResponse.ok) {
      console.log(`Locales endpoint returned: ${localesResponse.status}`);
      return;
    }
    
    const localesData = await localesResponse.json();
    console.log(`✅ Found ${localesData.locales?.length || 0} locales:`);
    
    let germanLocaleId = null;
    
    if (localesData.locales) {
      localesData.locales.forEach(locale => {
        console.log(`   - ${locale.displayName} (${locale.code}) ${locale.isDefault ? '[DEFAULT]' : ''} - ID: ${locale.id}`);
        if (locale.code === 'de' || locale.code === 'de-DE') {
          germanLocaleId = locale.id;
        }
      });
    }
    
    if (!germanLocaleId) {
      console.log('\n❌ German locale not found');
      return;
    }
    
    console.log(`\n✅ German locale ID: ${germanLocaleId}`);
    
    // 2. Find the haircare challenge page
    console.log('\n2. Finding the haircare challenge page...');
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
    const mainPage = pagesData.pages.find(p => p.slug === 'the-haircare-challenge');
    
    if (!mainPage) {
      console.log('❌ Main page not found');
      return;
    }
    
    console.log(`✅ Found page: ${mainPage.title}`);
    console.log(`   Page ID: ${mainPage.id}`);
    
    // 3. Test getting localized content
    console.log('\n3. Testing localized content access...');
    const localizedContentResponse = await fetch(
      `https://api.webflow.com/v2/pages/${mainPage.id}/dom?localeId=${germanLocaleId}`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (localizedContentResponse.ok) {
      console.log('✅ Can access German localized content!');
      
      const content = await localizedContentResponse.json();
      console.log(`   Total nodes: ${content.nodes?.length || 0}`);
      
      // Check if content is already translated
      const textNodes = content.nodes?.filter(n => n.type === 'text' && n.text);
      if (textNodes && textNodes.length > 0) {
        console.log(`\n   Sample text from German locale:`);
        console.log(`   "${textNodes[0].text.text?.substring(0, 80)}..."`);
      }
      
      return { pageId: mainPage.id, germanLocaleId };
    } else {
      console.log(`❌ Cannot access localized content: ${localizedContentResponse.status}`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Export for use in other scripts
module.exports = checkGermanLocale;

// Run if called directly
if (require.main === module) {
  checkGermanLocale();
}