#!/usr/bin/env node

require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function findDomainIds() {
  console.log('🔍 Finding domain IDs for the site...\n');
  
  try {
    // Get site info with domains
    const response = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch site: ${response.status}`);
    }
    
    const siteData = await response.json();
    console.log('Site:', siteData.displayName);
    console.log('Site ID:', siteData.id);
    
    // Try to get domains
    console.log('\n📍 Looking for domain information...');
    
    // Check custom domains
    if (siteData.customDomains && siteData.customDomains.length > 0) {
      console.log('\nCustom domains found:');
      siteData.customDomains.forEach(domain => {
        console.log(`  - ${domain.url} (ID: ${domain.id})`);
      });
    }
    
    // Check default domain
    if (siteData.defaultDomain) {
      console.log('\nDefault domain:');
      console.log(`  - ${siteData.defaultDomain}`);
    }
    
    // Check all properties for domain-related info
    console.log('\n🔍 All site properties:');
    Object.keys(siteData).forEach(key => {
      if (key.toLowerCase().includes('domain') || key.toLowerCase().includes('publish')) {
        console.log(`  ${key}:`, JSON.stringify(siteData[key], null, 2));
      }
    });
    
    console.log('\n💡 RECOMMENDATION:');
    console.log('   Since domain IDs are not valid, use this publish format instead:');
    console.log(`
    body: JSON.stringify({
      publishToWebflowSubdomain: true
    })
    `);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run
if (require.main === module) {
  findDomainIds();
}