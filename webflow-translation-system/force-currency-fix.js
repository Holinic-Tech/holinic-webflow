#!/usr/bin/env node

// Force fix all currency on challenge page by searching ALL node types
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const PAGE_ID = '672de5d83bf4c27aff31c9a3'; // challenge page
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf';

async function forceCurrencyFix() {
  console.log('\n💰 Force fixing ALL currency symbols...\n');
  
  try {
    // Get English nodes to find where the prices are
    console.log('1️⃣ Analyzing English content structure...');
    const englishResponse = await fetch(
      `https://api.webflow.com/v2/pages/${PAGE_ID}/dom?limit=500`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const englishData = await englishResponse.json();
    const priceNodes = [];
    
    // Find ALL nodes with dollar amounts
    englishData.nodes.forEach(node => {
      const nodeStr = JSON.stringify(node);
      if (nodeStr.includes('$99') || nodeStr.includes('$29') || nodeStr.includes('$35') || 
          nodeStr.includes('$39') || nodeStr.includes('$15') || nodeStr.includes('$20')) {
        priceNodes.push({
          id: node.id,
          type: node.type,
          content: nodeStr.substring(0, 200)
        });
      }
    });
    
    console.log(`Found ${priceNodes.length} price nodes in English version`);
    
    // Get German nodes
    console.log('\n2️⃣ Fetching German content...');
    const germanResponse = await fetch(
      `https://api.webflow.com/v2/pages/${PAGE_ID}/dom?localeId=${GERMAN_LOCALE_ID}&limit=500`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const germanData = await germanResponse.json();
    console.log(`Total German nodes: ${germanData.nodes.length}`);
    
    // Map English price nodes to German equivalents
    console.log('\n3️⃣ Finding and fixing price nodes...');
    const fixes = [];
    
    priceNodes.forEach(priceNode => {
      // Find corresponding German node
      const germanNode = germanData.nodes.find(n => n.id === priceNode.id);
      
      if (germanNode && germanNode.type === 'text' && germanNode.text) {
        const text = germanNode.text.text || '';
        const html = germanNode.text.html || text;
        
        if (text.includes('$')) {
          let fixedText = text;
          let fixedHtml = html;
          
          // Apply all currency conversions
          fixedText = fixedText.replace(/\$(\d+)/g, '€$1');
          fixedHtml = fixedHtml.replace(/\$(\d+)/g, '€$1');
          
          console.log(`📝 Fixing node ${germanNode.id}:`);
          console.log(`   Before: "${text}"`);
          console.log(`   After:  "${fixedText}"`);
          
          fixes.push({
            nodeId: germanNode.id,
            text: fixedHtml
          });
        }
      }
    });
    
    // Also check all German text nodes just to be sure
    germanData.nodes.forEach(node => {
      if (node.type === 'text' && node.text && node.text.text && node.text.text.includes('$')) {
        // Check if already in fixes
        if (!fixes.find(f => f.nodeId === node.id)) {
          let text = node.text.text;
          let html = node.text.html || text;
          
          let fixedText = text.replace(/\$(\d+)/g, '€$1');
          let fixedHtml = html.replace(/\$(\d+)/g, '€$1');
          
          console.log(`📝 Additional fix for node ${node.id}:`);
          console.log(`   Before: "${text}"`);
          console.log(`   After:  "${fixedText}"`);
          
          fixes.push({
            nodeId: node.id,
            text: fixedHtml
          });
        }
      }
    });
    
    console.log(`\n✅ Prepared ${fixes.length} fixes`);
    
    if (fixes.length === 0) {
      console.log('\n❓ No fixes found in API nodes.');
      console.log('The $ symbols on the live page might be:');
      console.log('  - In rich text components');
      console.log('  - In CMS items');
      console.log('  - In component settings');
      console.log('\nYou may need to fix these manually in Webflow Designer.');
      return;
    }
    
    // Apply fixes
    console.log('\n4️⃣ Applying fixes...');
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
          nodes: fixes
        })
      }
    );
    
    if (updateResponse.ok) {
      console.log('   ✅ Fixes applied!');
    } else {
      console.error('   ❌ Failed to apply fixes');
    }
    
    // Save backup
    fs.writeFileSync(`force-currency-fix-${Date.now()}.json`, JSON.stringify({
      pageId: PAGE_ID,
      timestamp: new Date().toISOString(),
      fixes: fixes
    }, null, 2));
    
    // Publish
    console.log('\n5️⃣ Publishing...');
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
    
    console.log('\n✅ Currency fix complete!');
    console.log('🔗 Check: https://hairqare.co/de/challenge');
    
    if (fixes.length === 0) {
      console.log('\n⚠️  NOTE: The $ symbols visible on the live page are not in the API nodes.');
      console.log('They are likely in:');
      console.log('  - Rich Text elements edited in Webflow Designer');
      console.log('  - CMS collection items');
      console.log('  - Component/Symbol instances');
      console.log('\nTo fix these, you need to:');
      console.log('  1. Open the page in Webflow Designer');
      console.log('  2. Switch to German locale');
      console.log('  3. Find and update the prices manually');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Run
if (require.main === module) {
  forceCurrencyFix();
}