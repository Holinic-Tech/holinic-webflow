#!/usr/bin/env node

// Get complete page content and search for missing strings
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function getFullPageContent() {
  console.log('\n📄 Getting complete page content...\n');
  
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
    
    if (!page) {
      console.error('Page not found');
      return;
    }
    
    console.log(`Found page: ${page.title}`);
    console.log(`Page ID: ${page.id}\n`);
    
    // Get DOM content
    const domResponse = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/dom`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const domData = await domResponse.json();
    
    // Save complete DOM
    fs.writeFileSync('complete-dom.json', JSON.stringify(domData, null, 2));
    console.log('💾 Saved complete DOM to complete-dom.json\n');
    
    // Count all nodes
    console.log(`Total nodes: ${domData.nodes.length}`);
    
    // Extract ALL text content
    const allTextContent = [];
    let textNodeCount = 0;
    
    function extractText(node, path = '') {
      // Check node text
      if (node.text && (node.text.text || node.text.html)) {
        textNodeCount++;
        const content = node.text.text || node.text.html;
        allTextContent.push({
          id: node.id,
          type: node.type,
          path: path,
          content: content
        });
      }
      
      // Check all properties for text
      Object.keys(node).forEach(key => {
        if (typeof node[key] === 'string' && node[key].length > 10 && 
            !['id', 'type', 'nodeId'].includes(key)) {
          if (node[key].includes(' ')) {  // Likely text content
            allTextContent.push({
              id: node.id,
              type: node.type,
              property: key,
              content: node[key]
            });
          }
        }
      });
      
      // Recurse through children
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach((child, i) => {
          extractText(child, `${path}[${i}]`);
        });
      }
      
      // Check other array properties
      ['nodes', 'items'].forEach(prop => {
        if (node[prop] && Array.isArray(node[prop])) {
          node[prop].forEach((item, i) => {
            extractText(item, `${path}.${prop}[${i}]`);
          });
        }
      });
    }
    
    // Extract from all nodes
    domData.nodes.forEach((node, i) => {
      extractText(node, `nodes[${i}]`);
    });
    
    console.log(`\nFound ${textNodeCount} text nodes`);
    console.log(`Total text content pieces: ${allTextContent.length}\n`);
    
    // Search for missing strings
    const searchStrings = [
      "Say the Challenge is life changing",
      "100% money-back guarantee", 
      "money-back guarantee",
      "No matter what you try",
      "remains out of reach",
      "😭"
    ];
    
    console.log('🔍 Searching for missing strings:\n');
    
    searchStrings.forEach(searchStr => {
      console.log(`Looking for: "${searchStr}"`);
      
      const found = allTextContent.filter(item => 
        item.content.toLowerCase().includes(searchStr.toLowerCase())
      );
      
      if (found.length > 0) {
        console.log('✅ FOUND:');
        found.forEach(f => {
          console.log(`   ID: ${f.id}`);
          console.log(`   Type: ${f.type}`);
          if (f.property) console.log(`   Property: ${f.property}`);
          console.log(`   Content: "${f.content.substring(0, 100)}..."`);
        });
      } else {
        console.log('❌ NOT FOUND');
      }
      console.log('');
    });
    
    // Save all text content for inspection
    fs.writeFileSync('all-text-content.json', JSON.stringify(allTextContent, null, 2));
    console.log('💾 Saved all text content to all-text-content.json');
    
    // Look for emojis or special content
    console.log('\n🔍 Looking for emojis or special characters:\n');
    const emojiContent = allTextContent.filter(item => 
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(item.content)
    );
    
    console.log(`Found ${emojiContent.length} items with emojis`);
    emojiContent.slice(0, 5).forEach(item => {
      console.log(`   "${item.content.substring(0, 80)}..."`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getFullPageContent();