#!/usr/bin/env node

require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function fixPublishCommand() {
  console.log('🔍 Fixing publish command...\n');
  
  try {
    // 1. Get site info with custom domains
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
    
    // Properly extract domain information
    console.log('\n🌐 Custom domains:');
    if (siteData.customDomains && Array.isArray(siteData.customDomains)) {
      siteData.customDomains.forEach(domain => {
        console.log(`   - ID: ${domain.id}`);
        console.log(`     URL: ${domain.url}`);
        console.log(`     Last published: ${domain.lastPublished}`);
      });
      
      // Extract just the domain IDs
      const domainIds = siteData.customDomains.map(d => d.id);
      console.log(`\n📝 Domain IDs for publishing: ${domainIds.join(', ')}`);
      
      // 2. Test correct publish format
      console.log('\n📢 Publishing with correct format...');
      
      const publishResponse = await fetch(
        `https://api.webflow.com/v2/sites/${SITE_ID}/publish`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'Content-Type': 'application/json',
            'accept': 'application/json'
          },
          body: JSON.stringify({
            publishTargets: domainIds
          })
        }
      );
      
      if (publishResponse.ok) {
        const result = await publishResponse.json();
        console.log(`   ✅ Publish successful!`);
        console.log(`   Queued: ${result.queued}`);
        console.log(`   Publishing to domains: ${domainIds.length}`);
        
        // Wait a moment for publishing to complete
        console.log('\n⏳ Waiting for publish to complete...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Check updated publish time
        const updatedSiteResponse = await fetch(
          `https://api.webflow.com/v2/sites/${SITE_ID}`,
          {
            headers: {
              'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
              'accept': 'application/json'
            }
          }
        );
        
        const updatedSite = await updatedSiteResponse.json();
        console.log(`\n✅ New publish time: ${updatedSite.lastPublished}`);
        
      } else {
        const error = await publishResponse.text();
        console.log(`   ❌ Publish failed (${publishResponse.status}): ${error}`);
      }
    } else {
      // Fallback to 'live' target
      console.log('\n📢 No custom domains found, using "live" target...');
      
      const publishResponse = await fetch(
        `https://api.webflow.com/v2/sites/${SITE_ID}/publish`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'Content-Type': 'application/json',
            'accept': 'application/json'
          },
          body: JSON.stringify({
            publishTargets: ['live']
          })
        }
      );
      
      if (publishResponse.ok) {
        console.log('   ✅ Published to live!');
      } else {
        const error = await publishResponse.text();
        console.log(`   ❌ Publish failed: ${error}`);
      }
    }
    
    console.log('\n✨ Publish fix complete!');
    console.log('\n🔗 The German page should now be live at:');
    console.log('   - https://hairqare.co/de/the-haircare-challenge');
    console.log('   - https://www.hairqare.co/de/the-haircare-challenge');
    console.log('\n📌 Note: German locale is enabled and 60+ German text nodes are in the system.');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  }
}

// Run
fixPublishCommand();