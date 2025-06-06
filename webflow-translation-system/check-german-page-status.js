#!/usr/bin/env node

require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf';

async function checkGermanPageStatus() {
  console.log('🔍 Checking German page status...\n');
  
  try {
    // 1. List all pages
    console.log('📄 Fetching all pages...');
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
    const pages = pagesData.pages || [];
    
    // Find haircare challenge pages
    const challengePages = pages.filter(p => 
      p.slug && p.slug.includes('haircare-challenge')
    );
    
    console.log(`\n✅ Found ${challengePages.length} haircare challenge pages:`);
    challengePages.forEach(p => {
      console.log(`   - ${p.slug} (ID: ${p.id})`);
      console.log(`     Title: ${p.title}`);
      console.log(`     Archived: ${p.archived || false}`);
      console.log(`     Draft: ${p.draft || false}`);
    });
    
    // 2. Check for German locale pages
    console.log('\n🌐 Checking for German locale content...');
    const mainPage = pages.find(p => p.slug === 'the-haircare-challenge');
    
    if (mainPage) {
      console.log(`\n📍 Main page found: ${mainPage.slug}`);
      console.log(`   ID: ${mainPage.id}`);
      
      // Try to get DOM with German locale
      console.log('\n🔍 Attempting to fetch German locale DOM...');
      const germanDomResponse = await fetch(
        `https://api.webflow.com/v2/pages/${mainPage.id}/dom?localeId=${GERMAN_LOCALE_ID}`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json'
          }
        }
      );
      
      if (germanDomResponse.ok) {
        const germanDom = await germanDomResponse.json();
        console.log('✅ German locale DOM accessible');
        
        // Check first few text nodes
        let germanTextCount = 0;
        let sampleTexts = [];
        
        function checkNodes(nodes) {
          if (!nodes) return;
          nodes.forEach(node => {
            if (node.type === 'text' && node.text && node.text.text) {
              const text = node.text.text;
              if (text.includes('ä') || text.includes('ö') || text.includes('ü') || 
                  text.includes('ß') || text.includes('Haar')) {
                germanTextCount++;
                if (sampleTexts.length < 5) {
                  sampleTexts.push(text.substring(0, 50) + '...');
                }
              }
            }
            if (node.children) checkNodes(node.children);
          });
        }
        
        checkNodes(germanDom.nodes);
        console.log(`\n📊 German text nodes found: ${germanTextCount}`);
        if (sampleTexts.length > 0) {
          console.log('\n📝 Sample German texts:');
          sampleTexts.forEach(t => console.log(`   - ${t}`));
        }
      } else {
        console.log(`❌ German locale DOM not accessible: ${germanDomResponse.status}`);
        const error = await germanDomResponse.text();
        console.log(`   Error: ${error}`);
      }
    }
    
    // 3. Check site publishing status
    console.log('\n📢 Checking site publishing status...');
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
      console.log(`\n🌐 Site: ${siteData.displayName || siteData.shortName}`);
      console.log(`   Last published: ${siteData.lastPublished || 'Never'}`);
      console.log(`   Custom domains: ${siteData.customDomains?.length || 0}`);
      if (siteData.locales) {
        console.log(`   Locales enabled: ${siteData.locales.length}`);
        siteData.locales.forEach(locale => {
          console.log(`     - ${locale.displayName} (${locale.id})`);
        });
      }
    }
    
    console.log('\n✨ Status check complete!');
    console.log('\n🔗 Check these URLs:');
    console.log('   - https://hairqare.co/the-haircare-challenge (English)');
    console.log('   - https://hairqare.co/de/the-haircare-challenge (German)');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  }
}

// Run
checkGermanPageStatus();