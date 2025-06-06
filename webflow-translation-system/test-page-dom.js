#!/usr/bin/env node

// Test getting page DOM content
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function testPageDOM() {
  console.log('\n🔍 Testing page DOM access...\n');
  
  try {
    // Get the main page
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
    
    console.log(`Found page: ${mainPage.title}`);
    console.log(`Page ID: ${mainPage.id}`);
    
    // Try different endpoints
    console.log('\n1. Testing /pages/{page_id}/dom endpoint...');
    const domResponse = await fetch(
      `https://api.webflow.com/v2/pages/${mainPage.id}/dom`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    console.log(`   Response: ${domResponse.status} ${domResponse.statusText}`);
    
    // Try v1 API
    console.log('\n2. Testing v1 API /sites/{site_id}/pages/{page_id} endpoint...');
    const v1Response = await fetch(
      `https://api.webflow.com/sites/${SITE_ID}/pages/${mainPage.id}`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    console.log(`   Response: ${v1Response.status} ${v1Response.statusText}`);
    
    if (v1Response.ok) {
      const v1Data = await v1Response.json();
      console.log(`   ✅ V1 API works!`);
      console.log(`   Page name: ${v1Data.name}`);
      console.log(`   Slug: ${v1Data.slug}`);
    }
    
    // Check available endpoints
    console.log('\n3. Available options:');
    console.log('   - The /content endpoint requires Designer API access');
    console.log('   - The site might be using static pages without CMS');
    console.log('   - Translation might need to be done differently');
    
    console.log('\n4. Alternative approach:');
    console.log('   Since we cannot access page content via API, consider:');
    console.log('   a) Using Webflow\'s Designer to manually create /de/ pages');
    console.log('   b) Using a different translation workflow');
    console.log('   c) Checking if the site uses CMS collections instead');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testPageDOM();