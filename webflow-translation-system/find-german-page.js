#!/usr/bin/env node

// Find German haircare challenge page
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function findGermanPage() {
  console.log('\n🔍 Searching for German haircare challenge page...\n');
  
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
      hasMore = data.pages.length === limit;
      offset += limit;
    }
    
    // Look for pages that might be German versions
    const possibleGermanPages = allPages.filter(page => {
      const slug = (page.slug || '').toLowerCase();
      const title = (page.title || '').toLowerCase();
      
      return (
        // Check for German indicators in slug
        (slug.includes('de') && slug.includes('haircare')) ||
        (slug.includes('de') && slug.includes('challenge')) ||
        // Check for path-like structures
        slug === 'de/the-haircare-challenge' ||
        slug === 'de-the-haircare-challenge' ||
        // Check title for German
        title.includes('german') ||
        title.includes('deutsch')
      );
    });
    
    if (possibleGermanPages.length > 0) {
      console.log('✅ Found possible German pages:');
      possibleGermanPages.forEach(page => {
        console.log(`\n   Slug: "${page.slug}"`);
        console.log(`   Title: "${page.title}"`);
        console.log(`   ID: ${page.id}`);
        console.log(`   Draft: ${page.isDraft}`);
      });
    } else {
      console.log('❌ No German haircare challenge pages found');
    }
    
    // Also look for any page with exact slug
    console.log('\n\n🔍 Looking for exact slug matches:');
    const exactSlugs = [
      'de/the-haircare-challenge',
      'de-the-haircare-challenge',
      'the-haircare-challenge-de'
    ];
    
    exactSlugs.forEach(searchSlug => {
      const found = allPages.find(page => page.slug === searchSlug);
      if (found) {
        console.log(`\n✅ Found: ${searchSlug}`);
        console.log(`   Title: ${found.title}`);
        console.log(`   ID: ${found.id}`);
      } else {
        console.log(`❌ Not found: ${searchSlug}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

findGermanPage();