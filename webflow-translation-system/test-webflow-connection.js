#!/usr/bin/env node

// Test Webflow API connection
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function testConnection() {
  console.log('\n🔍 Testing Webflow API Connection...\n');
  
  try {
    // Test 1: Get site info
    console.log('1. Testing site access...');
    const siteResponse = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (!siteResponse.ok) {
      throw new Error(`Site API error: ${siteResponse.status} ${siteResponse.statusText}`);
    }
    
    const siteData = await siteResponse.json();
    console.log(`✅ Site found: ${siteData.displayName} (${siteData.shortName})`);
    
    // Test 2: List pages
    console.log('\n2. Listing pages...');
    const pagesResponse = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}/pages?limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (!pagesResponse.ok) {
      throw new Error(`Pages API error: ${pagesResponse.status} ${pagesResponse.statusText}`);
    }
    
    const pagesData = await pagesResponse.json();
    console.log(`✅ Found ${pagesData.pages.length} pages:\n`);
    
    // Look for pages with language folders
    const languagePages = pagesData.pages.filter(page => 
      page.slug && (page.slug.includes('/de/') || page.slug.startsWith('de/'))
    );
    
    if (languagePages.length > 0) {
      console.log('📁 Pages in language folders:');
      languagePages.forEach(page => {
        console.log(`   - ${page.slug} (${page.title})`);
      });
    } else {
      console.log('❌ No pages found in language folders (e.g., /de/)');
    }
    
    // Show some regular pages
    console.log('\n📄 Sample pages:');
    pagesData.pages.slice(0, 5).forEach(page => {
      console.log(`   - ${page.slug || '(home)'} - ${page.title}`);
    });
    
    // Look for specific page
    console.log('\n3. Looking for "the-haircare-challenge" pages...');
    const challengePages = pagesData.pages.filter(page => 
      page.slug && page.slug.includes('haircare-challenge')
    );
    
    if (challengePages.length > 0) {
      console.log('✅ Found challenge pages:');
      challengePages.forEach(page => {
        console.log(`   - ${page.slug} (ID: ${page.id})`);
      });
    } else {
      console.log('❌ No "haircare-challenge" pages found');
    }
    
    console.log('\n✨ API connection successful!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nPlease check:');
    console.error('1. Your Webflow API token is valid');
    console.error('2. The token has the required permissions');
    console.error('3. The site ID is correct');
  }
}

testConnection();