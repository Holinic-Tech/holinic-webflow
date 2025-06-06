#!/usr/bin/env node

require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function checkLocaleSetup() {
  console.log('🔍 Checking Webflow locale configuration...\n');
  
  try {
    // Try different locale endpoints
    console.log('1️⃣ Trying /locales endpoint...');
    const localesResponse = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}/locales`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    console.log('   Status:', localesResponse.status, localesResponse.statusText);
    
    if (!localesResponse.ok) {
      const errorText = await localesResponse.text();
      console.log('   Response:', errorText.substring(0, 200));
    }
    
    // Check if we're using the right locale ID
    console.log('\n2️⃣ Testing locale ID in DOM request...');
    const pageId = '672c82dd7bb594490ba42d38'; // the-haircare-challenge page
    
    // Try without locale ID (default)
    console.log('   Default content (no locale):');
    const defaultResponse = await fetch(
      `https://api.webflow.com/v2/pages/${pageId}/dom?limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (defaultResponse.ok) {
      const data = await defaultResponse.json();
      console.log('   ✅ Success - Total nodes:', data.pagination.total);
    }
    
    // Try with German locale ID
    console.log('\n   German content (with locale 684230454832f0132d5f6ccf):');
    const germanResponse = await fetch(
      `https://api.webflow.com/v2/pages/${pageId}/dom?localeId=684230454832f0132d5f6ccf&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (germanResponse.ok) {
      const data = await germanResponse.json();
      console.log('   ✅ Success - Total nodes:', data.pagination.total);
    }
    
    // Check what was working 8 hours ago
    console.log('\n3️⃣ Checking recent successful translations...');
    const fs = require('fs');
    const files = fs.readdirSync('.').filter(f => f.startsWith('translation-progress-'));
    if (files.length > 0) {
      console.log(`   Found ${files.length} progress files`);
      const latest = files.sort().pop();
      const progress = JSON.parse(fs.readFileSync(latest, 'utf8'));
      console.log(`   Latest: ${latest}`);
      console.log(`   Timestamp: ${progress.timestamp}`);
      console.log(`   Translated: ${progress.translatedSoFar}/${progress.totalNodes} nodes`);
    }
    
    console.log('\n❓ IMPORTANT QUESTIONS:');
    console.log('   1. Is Localization enabled in your Webflow site settings?');
    console.log('   2. Is German locale added and published in Webflow?');
    console.log('   3. Are you checking the correct URL: https://hairqare.co/de/the-haircare-challenge ?');
    console.log('\n💡 The German content EXISTS in Webflow\'s database, but may not be accessible via the /de/ URL if localization isn\'t properly configured.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run
if (require.main === module) {
  checkLocaleSetup();
}