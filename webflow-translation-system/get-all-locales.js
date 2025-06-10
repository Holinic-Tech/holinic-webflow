#!/usr/bin/env node

// Get all available locales from Webflow
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function getAllLocales() {
  console.log('🔍 Fetching all available locales from Webflow...\n');
  
  try {
    // Fetch locales from Webflow API
    const response = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}/locales`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    console.log('API Response Status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error Response:', errorText);
      
      if (response.status === 404) {
        console.log('\n⚠️  Locales endpoint not found. This could mean:');
        console.log('   1. Localization is not enabled for this site');
        console.log('   2. The site doesn\'t have a paid plan that supports localization');
        console.log('   3. No locales have been configured yet');
      }
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.locales || data.locales.length === 0) {
      console.log('❌ No locales found. Localization might not be enabled.');
      console.log('\nTo enable localization:');
      console.log('1. Go to Webflow Site Settings > Localization');
      console.log('2. Enable localization (requires paid plan)');
      console.log('3. Add desired locales');
      console.log('4. Publish the site');
      return;
    }
    
    console.log(`✅ Found ${data.locales.length} locale(s):\n`);
    
    // Display all locales with their details
    data.locales.forEach((locale, index) => {
      console.log(`${index + 1}. ${locale.displayName || locale.name}`);
      console.log(`   Code: ${locale.shortCode || locale.code}`);
      console.log(`   ID: ${locale.id}`);
      console.log(`   Enabled: ${locale.enabled ? '✅' : '❌'}`);
      console.log(`   Default: ${locale.isDefault ? '✅ (Primary locale)' : '❌'}`);
      if (locale.cname) {
        console.log(`   Custom domain: ${locale.cname}`);
      }
      console.log('');
    });
    
    // Check if French locale exists
    const frenchLocale = data.locales.find(locale => 
      (locale.shortCode === 'fr' || locale.code === 'fr' || 
       locale.shortCode === 'fr-FR' || locale.code === 'fr-FR')
    );
    
    if (frenchLocale) {
      console.log('🇫🇷 French locale found!');
      console.log(`   ID: ${frenchLocale.id}`);
      console.log(`   Add this to translation-server.js LANGUAGE_CONFIG:`);
      console.log(`\n   fr: {`);
      console.log(`     name: 'French',`);
      console.log(`     localeId: '${frenchLocale.id}',`);
      console.log(`     baseInstructions: \`Use informal "tu" throughout. Keep "Challenge" untranslated. Natural conversational French.`);
      console.log(`CURRENCY: Convert all USD ($, US$) to EUR (€).\``);
      console.log(`   },\n`);
    } else {
      console.log('❌ French locale not found.');
      console.log('\nTo add French locale:');
      console.log('1. Go to Webflow Site Settings > Localization');
      console.log('2. Click "Add locale"');
      console.log('3. Select French (fr)');
      console.log('4. Configure the locale settings');
      console.log('5. Publish the site');
      console.log('6. Run this script again to get the locale ID');
    }
    
    // Save locales data for reference
    const fs = require('fs');
    const filename = `locales-data-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`\n💾 Saved full locale data to: ${filename}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n⚠️  Network error. Please check your internet connection.');
    } else if (error.message.includes('401')) {
      console.log('\n⚠️  Authentication failed. Please check your WEBFLOW_TOKEN.');
    }
  }
}

// Run the script
if (require.main === module) {
  getAllLocales();
}

module.exports = { getAllLocales };