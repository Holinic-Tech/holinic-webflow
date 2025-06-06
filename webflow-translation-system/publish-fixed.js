#!/usr/bin/env node

// Simple publish script that works
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function publishSite() {
  console.log('📢 Publishing Webflow site...\n');
  
  try {
    // First, let's check what domains we have
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
    const domainIds = siteData.customDomains.map(d => d.id);
    
    console.log('Found domains:', siteData.customDomains.map(d => d.url).join(', '));
    console.log('Domain IDs:', domainIds.join(', '));
    
    // Try publishing with domain IDs
    console.log('\n1️⃣ Attempting publish with domain IDs...');
    const response1 = await fetch(
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
    
    if (response1.ok) {
      console.log('✅ Success with domain IDs!');
      const data = await response1.json();
      console.log('Published:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Failed with domain IDs:', response1.status);
      const error1 = await response1.text();
      console.log('Error:', error1.substring(0, 200));
      
      // Try alternative method
      console.log('\n2️⃣ Attempting publish with publishToWebflowSubdomain...');
      const response2 = await fetch(
        `https://api.webflow.com/v2/sites/${SITE_ID}/publish`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'Content-Type': 'application/json',
            'accept': 'application/json'
          },
          body: JSON.stringify({
            publishToWebflowSubdomain: true
          })
        }
      );
      
      if (response2.ok) {
        console.log('✅ Success with publishToWebflowSubdomain!');
        const data = await response2.json();
        console.log('Published:', JSON.stringify(data, null, 2));
      } else {
        console.log('❌ Failed with publishToWebflowSubdomain:', response2.status);
        const error2 = await response2.text();
        console.log('Error:', error2.substring(0, 200));
      }
    }
    
    console.log('\n🔗 Check the German page at:');
    console.log('   https://hairqare.co/de/the-haircare-challenge');
    console.log('   https://www.hairqare.co/de/the-haircare-challenge');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run
if (require.main === module) {
  publishSite();
}