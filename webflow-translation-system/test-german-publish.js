#!/usr/bin/env node

require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf';

async function testGermanPublish() {
  console.log('🔍 Testing German page publish...\n');
  
  try {
    // 1. Get site info
    console.log('📄 Getting site configuration...');
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
    console.log(`\n✅ Site: ${siteData.displayName || siteData.shortName}`);
    console.log(`   Last published: ${siteData.lastPublished}`);
    
    // Extract custom domains properly
    const customDomains = siteData.customDomains?.map(d => d.domain || d) || [];
    console.log(`   Custom domains: ${customDomains.join(', ')}`);
    
    // Check locale configuration
    if (siteData.locales) {
      console.log('\n🌐 Locale Configuration:');
      console.log(`   Primary: ${siteData.locales.primary.displayName} (${siteData.locales.primary.tag})`);
      console.log(`   Secondary locales: ${siteData.locales.secondary.length}`);
      
      const germanLocale = siteData.locales.secondary.find(l => l.id === GERMAN_LOCALE_ID);
      if (germanLocale) {
        console.log(`\n   ✅ German locale found:`);
        console.log(`      Name: ${germanLocale.displayName}`);
        console.log(`      Enabled: ${germanLocale.enabled}`);
        console.log(`      Subdirectory: /${germanLocale.subdirectory}/`);
        console.log(`      Tag: ${germanLocale.tag}`);
      }
    }
    
    // 2. Check German content
    console.log('\n📝 Checking German content...');
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
    const mainPage = pagesData.pages?.find(p => p.slug === 'the-haircare-challenge');
    
    if (mainPage) {
      // Get German DOM
      const germanDomResponse = await fetch(
        `https://api.webflow.com/v2/pages/${mainPage.id}/dom?localeId=${GERMAN_LOCALE_ID}`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json'
          }
        }
      );
      
      if (germanDomResponse.ok) {
        const germanDom = await germanDomResponse.json();
        
        // Count German text nodes
        let germanCount = 0;
        function countGerman(nodes) {
          nodes?.forEach(node => {
            if (node.type === 'text' && node.text?.text) {
              const text = node.text.text;
              if (text.includes('ä') || text.includes('ö') || text.includes('ü') || 
                  text.includes('ß') || text.includes('Haar') || text.includes('Tag')) {
                germanCount++;
              }
            }
            if (node.children) countGerman(node.children);
          });
        }
        
        countGerman(germanDom.nodes);
        console.log(`   ✅ German text nodes found: ${germanCount}`);
      }
    }
    
    // 3. Test publishing
    console.log('\n📢 Publishing site...');
    
    // Try different publish configurations
    const publishConfigs = [
      {
        publishTargets: customDomains.length > 0 ? customDomains : ['live']
      }
    ];
    
    for (const config of publishConfigs) {
      console.log(`\n🔄 Publishing with: ${JSON.stringify(config)}`);
      
      const publishResponse = await fetch(
        `https://api.webflow.com/v2/sites/${SITE_ID}/publish`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'Content-Type': 'application/json',
            'accept': 'application/json'
          },
          body: JSON.stringify(config)
        }
      );
      
      if (publishResponse.ok) {
        const result = await publishResponse.json();
        console.log(`   ✅ Publish successful!`);
        console.log(`   Response: ${JSON.stringify(result)}`);
      } else {
        const error = await publishResponse.text();
        console.log(`   ❌ Publish failed (${publishResponse.status}): ${error}`);
      }
    }
    
    console.log('\n✨ Test complete!');
    console.log('\n🔗 Check these URLs now:');
    console.log('   1. https://hairqare.co/de/the-haircare-challenge');
    console.log('   2. https://www.hairqare.co/de/the-haircare-challenge');
    console.log('\n📌 If the German content is not showing:');
    console.log('   - The locale is configured correctly');
    console.log('   - The German content exists in the API');
    console.log('   - The publish command is working');
    console.log('   - Check if Webflow Localization is enabled in your plan');
    console.log('   - You may need to publish from the Webflow Designer');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  }
}

// Run
testGermanPublish();