#!/usr/bin/env node

// Get ALL DOM nodes using pagination
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function getAllDomNodes() {
  console.log('\n📄 Getting ALL DOM nodes with pagination...\n');
  
  try {
    // Get the page
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
    const page = pagesData.pages.find(p => p.slug === 'the-haircare-challenge');
    
    console.log(`Page: ${page.title}`);
    console.log(`Page ID: ${page.id}\n`);
    
    // Get all nodes with pagination
    let allNodes = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;
    
    while (hasMore) {
      console.log(`Fetching nodes ${offset} to ${offset + limit}...`);
      
      const response = await fetch(
        `https://api.webflow.com/v2/pages/${page.id}/dom?limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log(`   Received ${data.nodes.length} nodes`);
      console.log(`   Total available: ${data.pagination.total}`);
      
      allNodes = allNodes.concat(data.nodes);
      
      // Check if there are more nodes
      if (offset + limit >= data.pagination.total) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }
    
    console.log(`\n✅ Retrieved all ${allNodes.length} nodes\n`);
    
    // Count text nodes
    const textNodes = allNodes.filter(node => node.type === 'text' && node.text);
    console.log(`Text nodes: ${textNodes.length}`);
    
    // Save complete DOM
    const completeData = {
      pageId: page.id,
      nodes: allNodes,
      totalNodes: allNodes.length,
      textNodes: textNodes.length
    };
    
    fs.writeFileSync('complete-dom-all-nodes.json', JSON.stringify(completeData, null, 2));
    console.log('\n💾 Saved complete DOM to complete-dom-all-nodes.json');
    
    // Search for missing strings
    console.log('\n🔍 Searching for missing strings...\n');
    const searchStrings = [
      "Say the Challenge is life changing",
      "100% money-back guarantee",
      "No matter what you try",
      "remains out of reach"
    ];
    
    searchStrings.forEach(searchStr => {
      console.log(`Looking for: "${searchStr}"`);
      
      const found = textNodes.filter(node => {
        const text = node.text.text || '';
        const html = node.text.html || '';
        return text.toLowerCase().includes(searchStr.toLowerCase()) ||
               html.toLowerCase().includes(searchStr.toLowerCase());
      });
      
      if (found.length > 0) {
        console.log('✅ FOUND:');
        found.forEach(f => {
          console.log(`   Node ID: ${f.id}`);
          console.log(`   Text: "${f.text.text?.substring(0, 100)}..."`);
        });
      } else {
        console.log('❌ NOT FOUND');
      }
      console.log('');
    });
    
    // Show some nodes from different parts
    console.log('\n📊 Sample nodes from different sections:');
    const samples = [0, 100, 200, 300, 400, 500].filter(i => i < allNodes.length);
    samples.forEach(i => {
      const node = allNodes[i];
      if (node.type === 'text' && node.text?.text) {
        console.log(`Node ${i}: "${node.text.text.substring(0, 60)}..."`);
      }
    });
    
  } catch (error) {
    console.error('\nError:', error.message);
  }
}

getAllDomNodes();