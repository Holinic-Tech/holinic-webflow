#!/usr/bin/env node

// Get page DOM content
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function getPageDOM() {
  console.log('\n📄 Getting page DOM content...\n');
  
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
    
    console.log(`Page: ${mainPage.title}`);
    console.log(`ID: ${mainPage.id}\n`);
    
    // Get DOM content
    const domResponse = await fetch(
      `https://api.webflow.com/v2/pages/${mainPage.id}/dom`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (!domResponse.ok) {
      throw new Error(`DOM API error: ${domResponse.status}`);
    }
    
    const domData = await domResponse.json();
    console.log('✅ Got DOM data!\n');
    
    // Analyze the structure
    if (domData.nodes && Array.isArray(domData.nodes)) {
      console.log(`Total nodes: ${domData.nodes.length}`);
      
      // Find text nodes
      const textNodes = [];
      
      function findTextNodes(nodes) {
        nodes.forEach(node => {
          if (node.text && typeof node.text === 'string' && node.text.trim()) {
            textNodes.push({
              id: node.id,
              type: node.type,
              tag: node.tag,
              text: node.text
            });
          }
          if (node.children && Array.isArray(node.children)) {
            findTextNodes(node.children);
          }
        });
      }
      
      findTextNodes(domData.nodes);
      
      console.log(`\nFound ${textNodes.length} text nodes:\n`);
      
      // Show first 10 text nodes
      textNodes.slice(0, 10).forEach((node, i) => {
        console.log(`${i + 1}. [${node.tag || node.type}] "${node.text.substring(0, 60)}${node.text.length > 60 ? '...' : ''}"`);
      });
      
      if (textNodes.length > 10) {
        console.log(`\n... and ${textNodes.length - 10} more text nodes`);
      }
      
      // Check if we can update DOM
      console.log('\n\nDOM Structure Summary:');
      console.log(`- Can read: ✅ YES`);
      console.log(`- Can update: Need to test with PUT request`);
      console.log(`- Text nodes found: ${textNodes.length}`);
      
      // Save a sample for testing
      const fs = require('fs');
      fs.writeFileSync('sample-dom.json', JSON.stringify(domData, null, 2));
      console.log('\n💾 Full DOM saved to sample-dom.json for analysis');
      
    } else {
      console.log('❌ No nodes found in DOM data');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

getPageDOM();