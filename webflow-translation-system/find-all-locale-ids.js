#!/usr/bin/env node

// Find all locale IDs configured in Webflow
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function findAllLocaleIds() {
  console.log('🔍 Finding all locale IDs...\n');

  try {
    const response = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}/locales`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.locales || data.locales.length === 0) {
      console.log('No locales found. Localization might not be enabled.');
      return;
    }

    console.log('Found locales:\n');
    console.log('Add these to translation-server.js LANGUAGE_CONFIG:\n');
    
    data.locales.forEach(locale => {
      console.log(`${locale.shortCode || locale.code}:`);
      console.log(`  name: '${locale.displayName}'`);
      console.log(`  localeId: '${locale.id}'`);
      console.log(`  enabled: ${locale.enabled}`);
      console.log(`  ${locale.isDefault ? '(DEFAULT)' : ''}`);
      console.log('');
    });

    // Generate code snippet
    console.log('\n📋 Code snippet for translation-server.js:\n');
    data.locales.forEach(locale => {
      if (!locale.isDefault && locale.enabled) {
        const code = locale.shortCode || locale.code;
        console.log(`  ${code}: {`);
        console.log(`    name: '${locale.displayName}',`);
        console.log(`    localeId: '${locale.id}',`);
        console.log(`    baseInstructions: \`...\``);
        console.log(`  },`);
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

findAllLocaleIds();