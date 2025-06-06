#!/usr/bin/env node

// Publish using the correct domain IDs as documented
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

// Domain IDs from the status report
const DOMAIN_IDS = ['62cbaae84edab1e8249b4f3b', '62cbaae84edab1b14a9b4f3a'];

async function publishWithDomainIds() {
  console.log('📢 Publishing site with correct domain IDs...\n');
  console.log('   Using domain IDs:', DOMAIN_IDS.join(', '));
  
  try {
    const response = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}/publish`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          publishTargets: DOMAIN_IDS
        })
      }
    );
    
    console.log('Response status:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ Site published successfully!');
      console.log('\n🔗 Check the German page at:');
      console.log('   https://hairqare.co/de/the-haircare-challenge');
      console.log('   https://www.hairqare.co/de/the-haircare-challenge\n');
      
      if (data.publishedOn) {
        console.log(`📅 Published at: ${new Date(data.publishedOn).toLocaleString()}`);
      }
      
      console.log('\n📝 Details:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.error('\n❌ Publish failed:', response.status, response.statusText);
      console.error('Error details:', errorText);
      
      if (response.status === 429) {
        console.log('\n⚠️  Rate limit hit. Please wait a few minutes and try again.');
        console.log('   Webflow rate limits: 60 requests per minute');
      } else if (response.status === 400) {
        console.log('\n⚠️  Bad request. This might mean:');
        console.log('   - The domain IDs are incorrect');
        console.log('   - The site doesn\'t have these domains configured');
        console.log('   - Try using publishToWebflowSubdomain: true instead');
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run
if (require.main === module) {
  publishWithDomainIds();
}