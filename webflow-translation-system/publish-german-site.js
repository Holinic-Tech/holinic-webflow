#!/usr/bin/env node

// Quick script to publish the site with German translations
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function publishSite() {
  console.log('📢 Publishing site with German translations...\n');
  
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
          publishToWebflowSubdomain: true
        })
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Site published successfully!');
      console.log('\n🔗 Check the German page at:');
      console.log('   https://hairqare.co/de/the-haircare-challenge\n');
      
      if (data.publishedOn) {
        console.log(`📅 Published at: ${new Date(data.publishedOn).toLocaleString()}`);
      }
    } else {
      const errorText = await response.text();
      console.error('❌ Publish failed:', response.status, response.statusText);
      console.error('Error details:', errorText);
      
      if (response.status === 429) {
        console.log('\n⚠️  Rate limit hit. Please wait a few minutes and try again.');
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run
if (require.main === module) {
  publishSite();
}