#!/usr/bin/env node

require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf';

async function checkPublishStatus() {
  console.log('🔍 Checking publish status and configuration...\n');
  
  try {
    // 1. Get site information
    console.log('📄 Fetching site information...');
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
      console.log(`\n✅ Site: ${siteData.displayName || siteData.shortName}`);
      console.log(`   ID: ${siteData.id}`);
      console.log(`   Last published: ${siteData.lastPublished || 'Never'}`);
      console.log(`   Default domain: ${siteData.defaultDomain}`);
      console.log(`   Custom domains: ${siteData.customDomains?.join(', ') || 'None'}`);
      
      if (siteData.locales && Array.isArray(siteData.locales)) {
        console.log(`\n🌐 Locales configuration:`);
        siteData.locales.forEach(locale => {
          console.log(`   - ${locale.displayName} (${locale.id})`);
          console.log(`     Tag: ${locale.tag}`);
          console.log(`     Enabled: ${locale.enabled}`);
        });
      } else {
        console.log(`\n🌐 Locales: ${JSON.stringify(siteData.locales) || 'Not configured'}`);
      }
    }
    
    // 2. Test publish with different configurations
    console.log('\n📢 Testing publish configurations...');
    
    const publishConfigs = [
      { name: 'Live only', body: { publishTargets: ['live'] } },
      { name: 'Custom domains', body: { publishTargets: siteData?.customDomains || ['hairqare.co'] } },
      { name: 'All domains', body: { publishTargets: ['live', 'hairqare.co', 'www.hairqare.co'] } }
    ];
    
    for (const config of publishConfigs) {
      console.log(`\n🔄 Testing: ${config.name}`);
      console.log(`   Payload: ${JSON.stringify(config.body)}`);
      
      try {
        const publishResponse = await fetch(
          `https://api.webflow.com/v2/sites/${SITE_ID}/publish`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
              'Content-Type': 'application/json',
              'accept': 'application/json'
            },
            body: JSON.stringify(config.body)
          }
        );
        
        if (publishResponse.ok) {
          const result = await publishResponse.json();
          console.log(`   ✅ Success: ${JSON.stringify(result)}`);
        } else {
          const error = await publishResponse.text();
          console.log(`   ❌ Failed (${publishResponse.status}): ${error}`);
        }
      } catch (err) {
        console.log(`   ❌ Error: ${err.message}`);
      }
    }
    
    // 3. Check if German content is visible
    console.log('\n🌐 Checking German page accessibility...');
    const mainPage = await getMainPage();
    
    if (mainPage) {
      // Check default DOM
      const defaultDom = await fetchPageDOM(mainPage.id);
      const germanDom = await fetchPageDOM(mainPage.id, GERMAN_LOCALE_ID);
      
      console.log(`\n📊 Content comparison:`);
      console.log(`   Default DOM nodes: ${defaultDom?.nodes?.length || 0}`);
      console.log(`   German DOM nodes: ${germanDom?.nodes?.length || 0}`);
      
      // Compare sample texts
      if (defaultDom?.nodes && germanDom?.nodes) {
        console.log('\n📝 Sample text comparison:');
        let compared = 0;
        
        function findTextNodes(nodes, texts = []) {
          nodes.forEach(node => {
            if (node.type === 'text' && node.text?.text && node.text.text.length > 20) {
              texts.push(node.text.text);
            }
            if (node.children) findTextNodes(node.children, texts);
          });
          return texts;
        }
        
        const defaultTexts = findTextNodes(defaultDom.nodes);
        const germanTexts = findTextNodes(germanDom.nodes);
        
        for (let i = 0; i < Math.min(3, defaultTexts.length, germanTexts.length); i++) {
          console.log(`\n   Text ${i + 1}:`);
          console.log(`   EN: ${defaultTexts[i].substring(0, 50)}...`);
          console.log(`   DE: ${germanTexts[i].substring(0, 50)}...`);
        }
      }
    }
    
    console.log('\n✨ Status check complete!');
    console.log('\n🔗 URLs to check:');
    console.log('   - https://hairqare.co/the-haircare-challenge');
    console.log('   - https://hairqare.co/de/the-haircare-challenge');
    console.log('   - https://www.hairqare.co/de/the-haircare-challenge');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  }
}

async function getMainPage() {
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
  return pagesData.pages?.find(p => p.slug === 'the-haircare-challenge');
}

async function fetchPageDOM(pageId, localeId = null) {
  const url = localeId 
    ? `https://api.webflow.com/v2/pages/${pageId}/dom?localeId=${localeId}`
    : `https://api.webflow.com/v2/pages/${pageId}/dom`;
    
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
      'accept': 'application/json'
    }
  });
  
  return response.ok ? await response.json() : null;
}

// Run
checkPublishStatus();