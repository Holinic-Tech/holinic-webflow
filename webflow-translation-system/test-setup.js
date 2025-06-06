#!/usr/bin/env node

// Test script to verify setup
require('dotenv').config();

console.log('\n🔧 Webflow Translation System - Setup Check\n');

// Check environment variables
const checks = {
  'WEBFLOW_TOKEN': process.env.WEBFLOW_TOKEN,
  'OPENAI_API_KEY': process.env.OPENAI_API_KEY,
  'WEBFLOW_SITE_ID': process.env.WEBFLOW_SITE_ID || '62cbaa353a301eb715aa33d0'
};

let allGood = true;

for (const [key, value] of Object.entries(checks)) {
  if (!value || value === `YOUR_${key}`) {
    console.log(`❌ ${key}: Not configured (please update .env file)`);
    allGood = false;
  } else {
    console.log(`✅ ${key}: Configured (${value.substring(0, 10)}...)`);
  }
}

console.log('\n📦 Dependencies:');
try {
  require('node-fetch');
  console.log('✅ node-fetch: Installed');
} catch (e) {
  console.log('❌ node-fetch: Not installed');
  allGood = false;
}

try {
  require('dotenv');
  console.log('✅ dotenv: Installed');
} catch (e) {
  console.log('❌ dotenv: Not installed');
  allGood = false;
}

if (allGood) {
  console.log('\n✨ Setup looks good! You can now run:');
  console.log('   node translate-existing-page.js --url="hairqare.co/de/the-haircare-challenge" --lang="de"\n');
} else {
  console.log('\n⚠️  Please fix the issues above before running the translation script.\n');
  console.log('To set up your API keys:');
  console.log('1. Get your Webflow API token from: https://webflow.com/dashboard/account/integrations');
  console.log('2. Get your OpenAI API key from: https://platform.openai.com/api-keys');
  console.log('3. Update the .env file with your actual keys\n');
}