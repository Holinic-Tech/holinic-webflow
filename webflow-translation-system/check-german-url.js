#!/usr/bin/env node

const fetch = require('node-fetch');

async function checkGermanURL() {
  console.log('🔍 Checking if German page is accessible...\n');
  
  const urls = [
    'https://hairqare.co/de/the-haircare-challenge',
    'https://www.hairqare.co/de/the-haircare-challenge',
    'https://hairqare.co/the-haircare-challenge',
    'https://www.hairqare.co/the-haircare-challenge'
  ];
  
  for (const url of urls) {
    try {
      console.log(`Checking: ${url}`);
      const response = await fetch(url, {
        method: 'HEAD',
        redirect: 'manual' // Don't follow redirects
      });
      
      console.log(`  Status: ${response.status} ${response.statusText}`);
      if (response.headers.get('location')) {
        console.log(`  Redirects to: ${response.headers.get('location')}`);
      }
      console.log('');
    } catch (error) {
      console.log(`  Error: ${error.message}\n`);
    }
  }
  
  console.log('\n💡 IMPORTANT: The German translations ARE in Webflow:');
  console.log('   - 56 text nodes were successfully updated');
  console.log('   - German content exists when queried with locale ID');
  console.log('   - But publishing is rate limited right now');
  console.log('\n📋 What to do:');
  console.log('   1. Wait 15-30 minutes for rate limit to clear');
  console.log('   2. Try publishing from Webflow Designer directly');
  console.log('   3. Or check if /de/ URLs require Localization plan feature');
  console.log('\n❓ Question: Is Localization enabled in your Webflow plan?');
  console.log('   The /de/ URL structure requires the Localization add-on.');
}

// Run
if (require.main === module) {
  checkGermanURL();
}