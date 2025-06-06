#!/usr/bin/env node

// List all pages in Webflow site
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function listAllPages() {
  console.log('\n📄 Listing ALL pages in Webflow site...\n');
  
  try {
    let allPages = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;
    
    while (hasMore) {
      const response = await fetch(
        `https://api.webflow.com/v2/sites/${SITE_ID}/pages?limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      allPages = allPages.concat(data.pages);
      
      // Check if there are more pages
      hasMore = data.pages.length === limit;
      offset += limit;
    }
    
    console.log(`✅ Found ${allPages.length} total pages\n`);
    
    // Group by language
    const pagesByLang = {
      'German (/de/)': [],
      'Spanish (/es/)': [],
      'French (/fr/)': [],
      'Italian (/it/)': [],
      'Portuguese (/pt/)': [],
      'Dutch (/nl/)': [],
      'Other': []
    };
    
    allPages.forEach(page => {
      const slug = page.slug || '(home)';
      
      if (slug.includes('/de/') || slug.startsWith('de/') || slug.startsWith('de-')) {
        pagesByLang['German (/de/)'].push(page);
      } else if (slug.includes('/es/') || slug.startsWith('es/') || slug.startsWith('es-')) {
        pagesByLang['Spanish (/es/)'].push(page);
      } else if (slug.includes('/fr/') || slug.startsWith('fr/') || slug.startsWith('fr-')) {
        pagesByLang['French (/fr/)'].push(page);
      } else if (slug.includes('/it/') || slug.startsWith('it/') || slug.startsWith('it-')) {
        pagesByLang['Italian (/it/)'].push(page);
      } else if (slug.includes('/pt/') || slug.startsWith('pt/') || slug.startsWith('pt-')) {
        pagesByLang['Portuguese (/pt/)'].push(page);
      } else if (slug.includes('/nl/') || slug.startsWith('nl/') || slug.startsWith('nl-')) {
        pagesByLang['Dutch (/nl/)'].push(page);
      } else {
        pagesByLang['Other'].push(page);
      }
    });
    
    // Display grouped pages
    Object.entries(pagesByLang).forEach(([lang, pages]) => {
      if (pages.length > 0) {
        console.log(`\n${lang}: ${pages.length} pages`);
        if (lang !== 'Other') {
          pages.slice(0, 5).forEach(page => {
            console.log(`   - ${page.slug} (${page.title})`);
          });
          if (pages.length > 5) {
            console.log(`   ... and ${pages.length - 5} more`);
          }
        }
      }
    });
    
    // Look for haircare challenge pages
    console.log('\n\n🔍 Looking for "haircare-challenge" pages:');
    const challengePages = allPages.filter(page => 
      page.slug && page.slug.includes('haircare-challenge')
    );
    
    challengePages.forEach(page => {
      console.log(`   - ${page.slug} (${page.title})`);
    });
    
    // Look for pages with /de/ structure
    console.log('\n\n🔍 Looking for pages with /de/ folder structure:');
    const dePages = allPages.filter(page => 
      page.slug && page.slug.includes('/de/')
    );
    
    if (dePages.length > 0) {
      dePages.forEach(page => {
        console.log(`   - ${page.slug} (${page.title})`);
      });
    } else {
      console.log('   ❌ No pages found with /de/ folder structure');
      console.log('\n   ℹ️  You need to manually create the German page:');
      console.log('   1. In Webflow, duplicate "the-haircare-challenge"');
      console.log('   2. Change the slug to include /de/ folder');
      console.log('   3. Publish the page');
      console.log('   4. Then run the translation script');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listAllPages();