#!/usr/bin/env node

// Test translating main page to see effect on /de/ route
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function testMainPageContent() {
  console.log('\n🔍 Testing main haircare challenge page content...\n');
  
  try {
    // 1. Find the main page
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
    const mainPage = pagesData.pages.find(p => p.slug === 'the-haircare-challenge');
    
    if (!mainPage) {
      console.error('❌ Main page not found');
      return;
    }
    
    console.log(`✅ Found main page: ${mainPage.title}`);
    console.log(`   ID: ${mainPage.id}`);
    console.log(`   Slug: ${mainPage.slug}`);
    
    // 2. Get page content
    console.log('\n2. Getting page content...');
    const contentResponse = await fetch(
      `https://api.webflow.com/v2/pages/${mainPage.id}/content`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (!contentResponse.ok) {
      throw new Error(`Content API error: ${contentResponse.status}`);
    }
    
    const content = await contentResponse.json();
    console.log(`✅ Got content with ${content.nodes.length} nodes`);
    
    // 3. Show sample text nodes
    console.log('\n3. Sample text content:');
    const textNodes = content.nodes.filter(n => n.type === 'text' && n.text);
    textNodes.slice(0, 5).forEach((node, i) => {
      console.log(`   ${i + 1}. "${node.text.substring(0, 50)}${node.text.length > 50 ? '...' : ''}"`);
    });
    
    console.log(`\n   Total text nodes: ${textNodes.length}`);
    
    // 4. Suggestion
    console.log('\n4. Next steps:');
    console.log('Since /de/ routes exist but not as separate pages, they might be:');
    console.log('   a) Handled by Webflow\'s hosting/routing rules');
    console.log('   b) Using a custom solution outside the CMS');
    console.log('   c) Proxied from the main page');
    console.log('\nYou could try:');
    console.log('   1. Create a new page with slug "de-the-haircare-challenge"');
    console.log('   2. Translate that page');
    console.log('   3. Set up a redirect from /de/the-haircare-challenge to /de-the-haircare-challenge');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testMainPageContent();