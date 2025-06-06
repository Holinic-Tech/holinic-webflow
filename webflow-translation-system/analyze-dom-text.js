#!/usr/bin/env node

// Analyze DOM text content
const fs = require('fs');

try {
  const domData = JSON.parse(fs.readFileSync('sample-dom.json', 'utf8'));
  
  console.log('\n📄 Analyzing DOM text content...\n');
  
  const textNodes = [];
  
  // Extract text nodes
  domData.nodes.forEach(node => {
    if (node.type === 'text' && node.text) {
      textNodes.push({
        id: node.id,
        htmlText: node.text.html,
        plainText: node.text.text
      });
    }
  });
  
  console.log(`Found ${textNodes.length} text nodes:\n`);
  
  // Show first 15 text nodes
  textNodes.slice(0, 15).forEach((node, i) => {
    console.log(`${i + 1}. "${node.plainText.substring(0, 80)}${node.plainText.length > 80 ? '...' : ''}"`);
  });
  
  if (textNodes.length > 15) {
    console.log(`\n... and ${textNodes.length - 15} more text nodes`);
  }
  
  // Check structure
  console.log('\n\n✅ DOM Update Strategy:');
  console.log('1. For each text node, translate node.text.text');
  console.log('2. Update node.text.html with translated content (preserving HTML tags)');
  console.log('3. PUT the updated nodes back to the DOM endpoint');
  
  console.log('\n📝 Note: This is using the DOM API which is different from the Content API');
  console.log('The DOM API allows direct manipulation of page elements.');
  
} catch (error) {
  console.error('Error:', error.message);
}