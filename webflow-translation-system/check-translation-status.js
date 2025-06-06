#!/usr/bin/env node

// Check translation status and available options
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function checkTranslationStatus() {
  console.log('\n📊 Webflow Translation System Status\n');
  console.log('='.repeat(50));
  
  try {
    // 1. Check API connection
    console.log('\n1️⃣ API Connection:');
    const siteResponse = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (siteResponse.ok) {
      const siteData = await siteResponse.json();
      console.log(`   ✅ Connected to: ${siteData.displayName}`);
      
      // 2. Check locales
      console.log('\n2️⃣ Available Locales:');
      if (siteData.locales?.secondary) {
        console.log(`   ✅ Primary: ${siteData.locales.primary.displayName} (${siteData.locales.primary.tag})`);
        siteData.locales.secondary.forEach(locale => {
          console.log(`   ✅ ${locale.displayName}: /${locale.subdirectory}/ (ID: ${locale.id})`);
        });
      } else {
        console.log('   ❌ No localization configured');
      }
    } else {
      console.log('   ❌ API connection failed');
    }
    
    // 3. Check translation scripts
    console.log('\n3️⃣ Translation Scripts:');
    const scripts = [
      'translate-any-page.js',
      'translate-with-instructions.js',
      'find-locale-id.js',
      'list-all-pages.js'
    ];
    
    scripts.forEach(script => {
      if (fs.existsSync(script)) {
        console.log(`   ✅ ${script}`);
      } else {
        console.log(`   ❌ ${script} (missing)`);
      }
    });
    
    // 4. Check translation instructions
    console.log('\n4️⃣ Translation Guidelines:');
    if (fs.existsSync('TRANSLATION_INSTRUCTIONS.md')) {
      console.log('   ✅ Style guide found');
      // Count languages configured
      const instructions = fs.readFileSync('TRANSLATION_INSTRUCTIONS.md', 'utf8');
      const languages = instructions.match(/### (German|Spanish|French|Italian|Portuguese|Dutch)/g);
      if (languages) {
        console.log(`   📝 Guidelines for: ${languages.length} languages`);
      }
    } else {
      console.log('   ❌ Style guide missing');
    }
    
    // 5. Check recent translations
    console.log('\n5️⃣ Recent Translations:');
    const files = fs.readdirSync('.');
    const translationFiles = files
      .filter(f => f.includes('translation-') && f.endsWith('.json'))
      .sort()
      .reverse()
      .slice(0, 5);
    
    if (translationFiles.length > 0) {
      translationFiles.forEach(file => {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        console.log(`   📄 ${data.pageSlug || 'unknown'} → ${data.language} (${new Date(data.timestamp).toLocaleDateString()})`);
      });
    } else {
      console.log('   No translation backups found');
    }
    
    // 6. Quick start guide
    console.log('\n' + '='.repeat(50));
    console.log('\n🚀 Quick Start:\n');
    console.log('To translate a page:');
    console.log('node translate-any-page.js --slug="page-slug" --lang="de"\n');
    console.log('To see all pages:');
    console.log('node list-all-pages.js\n');
    console.log('To find locale IDs:');
    console.log('node find-locale-id.js\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

checkTranslationStatus();