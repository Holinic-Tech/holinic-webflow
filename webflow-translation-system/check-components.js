#!/usr/bin/env node

// Check component instances for missing content
const fs = require('fs');

const domData = JSON.parse(fs.readFileSync('complete-dom.json', 'utf8'));

console.log('\n🔍 Analyzing Component Instances...\n');

// Find all component instances
const componentInstances = domData.nodes.filter(node => node.type === 'component-instance');

console.log(`Found ${componentInstances.length} component instances\n`);

componentInstances.forEach((comp, i) => {
  console.log(`Component ${i + 1}:`);
  console.log(`  ID: ${comp.id}`);
  console.log(`  Type: ${comp.type}`);
  
  // Show all properties
  Object.keys(comp).forEach(key => {
    if (!['id', 'type'].includes(key)) {
      const value = JSON.stringify(comp[key]);
      if (value.length > 100) {
        console.log(`  ${key}: ${value.substring(0, 100)}...`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }
  });
  
  console.log('');
});

// Count nodes by type
console.log('\n📊 Node Type Summary:');
const typeCounts = {};
domData.nodes.forEach(node => {
  typeCounts[node.type] = (typeCounts[node.type] || 0) + 1;
});

Object.entries(typeCounts).forEach(([type, count]) => {
  console.log(`  ${type}: ${count}`);
});

console.log('\n⚠️  Component instances may contain the missing content!');
console.log('These need to be translated within the component definition in Webflow.');

// Look for any hidden text in other properties
console.log('\n🔍 Checking for text in other properties...\n');

const searchStrings = [
  "Say the Challenge",
  "money-back guarantee",
  "No matter what you try"
];

domData.nodes.forEach((node, i) => {
  const nodeStr = JSON.stringify(node);
  
  searchStrings.forEach(search => {
    if (nodeStr.toLowerCase().includes(search.toLowerCase())) {
      console.log(`Found "${search}" in node ${i}:`);
      console.log(JSON.stringify(node, null, 2).substring(0, 500) + '...\n');
    }
  });
});