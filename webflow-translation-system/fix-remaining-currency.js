#!/usr/bin/env node

// Fix remaining USD symbols on /challenge German page
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const PAGE_ID = '672de5d83bf4c27aff31c9a3'; // challenge page
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf';

async function fixRemainingCurrency() {
  console.log('\n💰 Fixing remaining currency symbols on /challenge German page...\n');
  
  try {
    // Get all German nodes
    console.log('📥 Fetching German content...');
    const allNodes = [];
    let offset = 0;
    const limit = 100;
    
    while (true) {
      const response = await fetch(
        `https://api.webflow.com/v2/pages/${PAGE_ID}/dom?localeId=${GERMAN_LOCALE_ID}&limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch DOM: ${response.status}`);
      }
      
      const data = await response.json();
      allNodes.push(...data.nodes);
      
      if (data.nodes.length < limit) break;
      offset += limit;
    }
    
    console.log(`   Total German nodes: ${allNodes.length}`);
    
    // Find nodes with USD symbols
    console.log('\n🔍 Finding nodes with USD symbols...');
    const nodesToFix = [];
    
    allNodes.forEach(node => {
      if (node.type === 'text' && node.text && node.text.text) {
        const text = node.text.text;
        const html = node.text.html;
        
        // Check for any USD patterns
        if (/\$\d+/.test(text) || /\d+\$/.test(text) || /US\$/.test(text)) {
          let fixedText = text;
          let fixedHtml = html || text;
          
          // Apply all currency fixes
          fixedText = fixedText.replace(/\$(\d+)/g, '€$1');
          fixedText = fixedText.replace(/(\d+)\s*\$/g, '$1€');
          fixedText = fixedText.replace(/US\$\s*(\d+)/g, '€$1');
          
          if (html) {
            fixedHtml = fixedHtml.replace(/\$(\d+)/g, '€$1');
            fixedHtml = fixedHtml.replace(/(\d+)\s*\$/g, '$1€');
            fixedHtml = fixedHtml.replace(/US\$\s*(\d+)/g, '€$1');
          }
          
          if (fixedText !== text) {
            console.log(`   📝 Node ${node.id}:`);
            console.log(`      Before: "${text}"`);
            console.log(`      After:  "${fixedText}"`);
            
            nodesToFix.push({
              nodeId: node.id,
              text: fixedHtml
            });
          }
        }
      }
    });
    
    console.log(`\n✅ Found ${nodesToFix.length} nodes to fix`);
    
    if (nodesToFix.length === 0) {
      console.log('\n✨ No currency fixes needed!');
      return;
    }
    
    // Apply fixes
    console.log('\n📝 Applying fixes...');
    const updateResponse = await fetch(
      `https://api.webflow.com/v2/pages/${PAGE_ID}/dom?localeId=${GERMAN_LOCALE_ID}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          nodes: nodesToFix
        })
      }
    );
    
    if (updateResponse.ok) {
      console.log('   ✅ Fixes applied successfully!');
    } else {
      const error = await updateResponse.text();
      console.error('   ❌ Update failed:', updateResponse.status);
      console.error('   Error:', error.substring(0, 200));
    }
    
    // Save backup
    const backupFile = `currency-fix-backup-${Date.now()}.json`;
    fs.writeFileSync(backupFile, JSON.stringify({
      pageId: PAGE_ID,
      timestamp: new Date().toISOString(),
      fixes: nodesToFix
    }, null, 2));
    console.log(`\n💾 Backup saved to ${backupFile}`);
    
    // Publish
    console.log('\n📢 Publishing...');
    try {
      const publishResponse = await fetch(
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
      
      if (publishResponse.ok) {
        console.log('   ✅ Published!');
      } else {
        const error = await publishResponse.text();
        console.log('   ⚠️  Publish failed:', error.substring(0, 100));
      }
    } catch (error) {
      console.log('   ⚠️  Publish error:', error.message);
    }
    
    console.log('\n✅ Currency fixes complete!');
    console.log('🔗 Check: https://hairqare.co/de/challenge');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Run
if (require.main === module) {
  fixRemainingCurrency();
}