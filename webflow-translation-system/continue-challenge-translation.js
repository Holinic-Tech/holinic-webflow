#!/usr/bin/env node

// Continue translating /challenge page from where we left off
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const PAGE_ID = '672de5d83bf4c27aff31c9a3'; // challenge page

async function checkProgress() {
  console.log('\n🔍 Checking translation progress for /challenge page...\n');
  
  try {
    // Check German content
    const response = await fetch(
      `https://api.webflow.com/v2/pages/${PAGE_ID}/dom?localeId=684230454832f0132d5f6ccf&limit=300`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    const textNodes = data.nodes.filter(n => n.type === 'text' && n.text?.text);
    
    console.log(`✅ Current status:`);
    console.log(`   Total nodes in German locale: ${data.pagination.total}`);
    console.log(`   Text nodes with content: ${textNodes.length}`);
    
    if (textNodes.length > 0) {
      console.log(`\n📝 Sample German translations:`);
      textNodes.slice(0, 10).forEach((node, i) => {
        const text = node.text.text;
        // Check for German indicators or currency
        const isGerman = text.includes('€') || /der|die|das|und|für|mit/.test(text.toLowerCase());
        console.log(`   ${i + 1}. ${isGerman ? '🇩🇪' : '🇬🇧'} "${text.substring(0, 50)}..."`);
      });
    }
    
    // Publish to see the current state
    console.log('\n📢 Publishing current progress...');
    try {
      await fetch(
        `https://api.webflow.com/v2/sites/${SITE_ID}/publish`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'Content-Type': 'application/json',
            'accept': 'application/json'
          },
          body: JSON.stringify({
            publishToWebflowSubdomain: true
          })
        }
      );
      console.log('   ✅ Published!');
    } catch (error) {
      console.log('   ⚠️  Could not publish (rate limit?)');
    }
    
    console.log('\n🔗 Check the page at:');
    console.log('   https://hairqare.co/de/challenge');
    console.log('\n💡 Note: The translation script was processing 203 nodes.');
    console.log(`   Current progress: ${textNodes.length}/203 nodes`);
    
    if (textNodes.length < 203) {
      console.log('\n⏳ To continue translation, run:');
      console.log('   node translate-all-english-progressive.js');
    } else {
      console.log('\n✅ Translation appears to be complete!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run
if (require.main === module) {
  checkProgress();
}