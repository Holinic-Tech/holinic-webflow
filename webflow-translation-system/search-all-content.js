#!/usr/bin/env node

// Search all pages and collections
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function searchAllContent() {
  console.log('\n🔍 Comprehensive search for German content...\n');
  
  try {
    // 1. Check all pages again with detailed info
    console.log('1. Checking all pages...');
    const pagesResponse = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}/pages?limit=200`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const pagesData = await pagesResponse.json();
    
    // Look for any page that might serve /de/ content
    const interestingPages = pagesData.pages.filter(page => {
      const slug = (page.slug || '').toLowerCase();
      return slug.includes('challenge') && !slug.includes('offline') && !slug.includes('draft');
    });
    
    console.log(`Found ${interestingPages.length} challenge pages:`);
    interestingPages.forEach(page => {
      console.log(`   - ${page.slug} (${page.title})`);
    });
    
    // 2. Check collections
    console.log('\n2. Checking collections...');
    const collectionsResponse = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}/collections`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (collectionsResponse.ok) {
      const collectionsData = await collectionsResponse.json();
      console.log(`Found ${collectionsData.collections.length} collections`);
      
      // Look for language-related collections
      const langCollections = collectionsData.collections.filter(col => {
        const name = (col.displayName || '').toLowerCase();
        return name.includes('lang') || name.includes('trans') || name.includes('de') || name.includes('german');
      });
      
      if (langCollections.length > 0) {
        console.log('\nLanguage-related collections:');
        langCollections.forEach(col => {
          console.log(`   - ${col.displayName} (${col.slug})`);
        });
      }
    }
    
    // 3. Check for the main haircare challenge page details
    console.log('\n3. Checking main haircare challenge page...');
    const mainPage = pagesData.pages.find(p => p.slug === 'the-haircare-challenge');
    if (mainPage) {
      console.log(`Main page found:`);
      console.log(`   ID: ${mainPage.id}`);
      console.log(`   Title: ${mainPage.title}`);
      console.log(`   Slug: ${mainPage.slug}`);
      
      // Try to get its content to see if there's language routing
      console.log('\n   Getting page settings...');
      const pageDetailsResponse = await fetch(
        `https://api.webflow.com/v2/pages/${mainPage.id}`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json'
          }
        }
      );
      
      if (pageDetailsResponse.ok) {
        const pageDetails = await pageDetailsResponse.json();
        console.log(`   SEO Title: ${pageDetails.seo?.title || 'N/A'}`);
        console.log(`   Locales: ${JSON.stringify(pageDetails.locales || 'N/A')}`);
      }
    }
    
    // 4. Test creating the translation anyway
    console.log('\n4. Suggestion:');
    console.log('Since hairqare.co/de/the-haircare-challenge is accessible but not in Webflow API,');
    console.log('it might be handled by routing rules or redirects.');
    console.log('\nTry translating the main page and see if it affects the /de/ version:');
    console.log('node translate-existing-page.js --url="the-haircare-challenge" --lang="de"');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

searchAllContent();