#!/usr/bin/env node

// Find ALL dollar signs in German content
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const PAGE_ID = '672de5d83bf4c27aff31c9a3'; // challenge page
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf';

async function findAllDollarSigns() {
  console.log('\n💵 Finding ALL dollar signs in German content...\n');
  
  try {
    // Get ALL nodes (not just first 100)
    const allNodes = [];
    let offset = 0;
    const limit = 100;
    
    while (offset < 500) { // Make sure we get everything
      const response = await fetch(
        `https://api.webflow.com/v2/pages/${PAGE_ID}/dom?localeId=${GERMAN_LOCALE_ID}&limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) break;
      
      const data = await response.json();
      allNodes.push(...data.nodes);
      
      console.log(`Fetched nodes ${offset + 1}-${offset + data.nodes.length}...`);
      
      if (data.nodes.length < limit) break;
      offset += limit;
    }
    
    console.log(`\nTotal German nodes: ${allNodes.length}`);
    
    // Search for dollar signs in ALL node types and properties
    console.log('\n🔍 Searching for $ symbols...\n');
    const dollarNodes = [];
    
    allNodes.forEach(node => {
      let foundDollar = false;
      let location = '';
      let content = '';
      
      // Check text content
      if (node.text?.text && node.text.text.includes('$')) {
        foundDollar = true;
        location = 'text.text';
        content = node.text.text;
      }
      // Check HTML content
      else if (node.text?.html && node.text.html.includes('$')) {
        foundDollar = true;
        location = 'text.html';
        content = node.text.html;
      }
      // Check other properties
      else {
        const nodeStr = JSON.stringify(node);
        if (nodeStr.includes('$')) {
          foundDollar = true;
          location = 'other property';
          content = nodeStr.substring(0, 200);
        }
      }
      
      if (foundDollar) {
        dollarNodes.push({
          id: node.id,
          type: node.type,
          location: location,
          content: content
        });
      }
    });
    
    if (dollarNodes.length > 0) {
      console.log(`❌ Found ${dollarNodes.length} nodes with $ symbols:\n`);
      dollarNodes.forEach((node, i) => {
        console.log(`${i + 1}. Node ${node.id} (${node.type})`);
        console.log(`   Location: ${node.location}`);
        console.log(`   Content: "${node.content.substring(0, 100)}..."`);
        console.log('');
      });
      
      // Prepare fixes
      console.log('🔧 Preparing fixes...\n');
      const fixes = [];
      
      dollarNodes.forEach(node => {
        if (node.location === 'text.text' || node.location === 'text.html') {
          const originalNode = allNodes.find(n => n.id === node.id);
          if (originalNode && originalNode.text) {
            let fixedText = originalNode.text.text || '';
            let fixedHtml = originalNode.text.html || fixedText;
            
            // Apply currency fixes
            fixedText = fixedText.replace(/\$(\d+)/g, '€$1');
            fixedHtml = fixedHtml.replace(/\$(\d+)/g, '€$1');
            
            fixes.push({
              nodeId: node.id,
              text: fixedHtml
            });
            
            console.log(`Fix for ${node.id}:`);
            console.log(`   Before: "${originalNode.text.text}"`);
            console.log(`   After:  "${fixedText}"`);
          }
        }
      });
      
      if (fixes.length > 0) {
        console.log(`\n📝 Applying ${fixes.length} fixes...`);
        
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
          console.log('✅ Fixes applied!');
          
          // Publish
          console.log('\n📢 Publishing...');
          await fetch(
            `https://api.webflow.com/v2/sites/${process.env.WEBFLOW_SITE_ID}/publish`,
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
          console.log('✅ Published!');
        } else {
          console.error('❌ Failed to apply fixes');
        }
      }
      
    } else {
      console.log('✅ No dollar signs found in German content!');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Run
if (require.main === module) {
  findAllDollarSigns();
}