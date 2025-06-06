#!/usr/bin/env node

require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf';

async function debugGermanPage() {
  console.log('🔍 Debugging German page status...\n');
  
  try {
    // 1. Get site info and locales
    console.log('1️⃣ Checking site locales...');
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
    console.log('Site ID:', siteData.id);
    console.log('Site name:', siteData.displayName);
    console.log('Last published:', siteData.lastPublished || 'Never');
    
    // 2. Get locales
    console.log('\n2️⃣ Getting locales...');
    const localesResponse = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}/locales`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (localesResponse.ok) {
      const localesData = await localesResponse.json();
      console.log('Locales found:', localesData.locales?.length || 0);
      localesData.locales?.forEach(locale => {
        console.log(`  - ${locale.displayName} (${locale.id}) - ${locale.enabled ? 'ENABLED' : 'DISABLED'}`);
      });
    } else {
      console.log('Could not fetch locales:', localesResponse.status);
    }
    
    // 3. Get the page
    console.log('\n3️⃣ Finding the-haircare-challenge page...');
    const pagesResponse = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}/pages`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const pagesData = await pagesResponse.json();
    const page = pagesData.pages.find(p => p.slug === 'the-haircare-challenge');
    
    if (!page) {
      console.log('❌ Page not found!');
      return;
    }
    
    console.log('✅ Found page:', page.title);
    console.log('   Page ID:', page.id);
    console.log('   Slug:', page.slug);
    
    // 4. Check German content
    console.log('\n4️⃣ Checking German content...');
    console.log('   Using locale ID:', GERMAN_LOCALE_ID);
    
    const domResponse = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/dom?localeId=${GERMAN_LOCALE_ID}&limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (domResponse.ok) {
      const domData = await domResponse.json();
      console.log(`   Total nodes: ${domData.pagination?.total || 0}`);
      
      // Show first few text nodes
      const textNodes = domData.nodes.filter(n => n.type === 'text' && n.text?.text);
      console.log(`   Sample text nodes (first 5):`);
      textNodes.slice(0, 5).forEach((node, i) => {
        console.log(`     ${i + 1}. "${node.text.text.substring(0, 50)}..."`);
      });
      
      // Check for German indicators
      const germanText = textNodes.filter(n => {
        const text = n.text.text.toLowerCase();
        return text.includes('der') || text.includes('die') || text.includes('das') || 
               text.includes('für') || text.includes('mit') || text.includes('€');
      });
      console.log(`   Nodes with German text: ${germanText.length}`);
    } else {
      console.log('❌ Could not fetch DOM:', domResponse.status);
      const error = await domResponse.text();
      console.log('   Error:', error);
    }
    
    // 5. Check default (English) content for comparison
    console.log('\n5️⃣ Checking default (English) content...');
    const defaultDomResponse = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/dom?limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (defaultDomResponse.ok) {
      const defaultDomData = await defaultDomResponse.json();
      const textNodes = defaultDomData.nodes.filter(n => n.type === 'text' && n.text?.text);
      console.log(`   Sample English text nodes (first 5):`);
      textNodes.slice(0, 5).forEach((node, i) => {
        console.log(`     ${i + 1}. "${node.text.text.substring(0, 50)}..."`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run
if (require.main === module) {
  debugGermanPage();
}