#!/usr/bin/env node

require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf';

async function checkChallengeStatus() {
  console.log('\n🔍 Checking /challenge page translation status...\n');
  
  try {
    // Find the page
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
    const page = pagesData.pages.find(p => p.slug === 'challenge');
    
    console.log(`Page: ${page.title}`);
    console.log(`ID: ${page.id}`);
    console.log(`Slug: ${page.slug}`);
    
    // Check English content
    console.log('\n📄 English content:');
    const englishResponse = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/dom?limit=100`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const englishData = await englishResponse.json();
    const englishTextNodes = englishData.nodes.filter(n => n.type === 'text' && n.text?.text);
    console.log(`   Total nodes: ${englishData.pagination.total}`);
    console.log(`   Text nodes: ${englishTextNodes.length}`);
    console.log(`   Sample texts:`);
    englishTextNodes.slice(0, 5).forEach((node, i) => {
      console.log(`     ${i + 1}. "${node.text.text.substring(0, 50)}..."`);
    });
    
    // Check German content
    console.log('\n🇩🇪 German content:');
    const germanResponse = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/dom?localeId=${GERMAN_LOCALE_ID}&limit=100`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const germanData = await germanResponse.json();
    const germanTextNodes = germanData.nodes.filter(n => n.type === 'text' && n.text?.text);
    console.log(`   Total nodes: ${germanData.pagination.total}`);
    console.log(`   Text nodes: ${germanTextNodes.length}`);
    
    if (germanTextNodes.length > 0) {
      console.log(`   Sample texts:`);
      germanTextNodes.slice(0, 5).forEach((node, i) => {
        console.log(`     ${i + 1}. "${node.text.text.substring(0, 50)}..."`);
      });
    } else {
      console.log('   ⚠️  No text nodes found in German locale!');
    }
    
    // Check live URL
    console.log('\n🌐 Checking live URLs:');
    const urls = [
      'https://hairqare.co/challenge',
      'https://hairqare.co/de/challenge'
    ];
    
    for (const url of urls) {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        console.log(`   ${url}: ${response.status} ${response.statusText}`);
      } catch (error) {
        console.log(`   ${url}: Error - ${error.message}`);
      }
    }
    
    console.log('\n💡 Summary:');
    if (germanTextNodes.length === 0) {
      console.log('   ❌ The /challenge page has NOT been translated to German yet');
      console.log('   📝 Need to run full translation script');
    } else if (germanTextNodes.length < englishTextNodes.length) {
      console.log('   ⚠️  The /challenge page is PARTIALLY translated');
      console.log(`   📊 ${germanTextNodes.length}/${englishTextNodes.length} text nodes translated`);
    } else {
      console.log('   ✅ The /challenge page appears to be translated');
      console.log('   🔍 Check if specific fixes are needed');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Run
if (require.main === module) {
  checkChallengeStatus();
}