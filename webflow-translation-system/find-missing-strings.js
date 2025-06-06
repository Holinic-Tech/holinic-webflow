#!/usr/bin/env node

// Find missing strings in translation
const fs = require('fs');

// Load the translation backup
const translationData = JSON.parse(fs.readFileSync('improved-translation-de-2025-06-06T02-21-49-212Z.json', 'utf8'));

// Strings that should have been translated
const searchStrings = [
  "Say the Challenge is life changing",
  "100% money-back guarantee",
  "No matter what you try",
  "remains out of reach"
];

console.log('🔍 Searching for missing translations...\n');

// Search in translations
searchStrings.forEach(searchStr => {
  console.log(`Searching for: "${searchStr}"`);
  
  const found = translationData.translations.filter(t => 
    t.text.toLowerCase().includes(searchStr.toLowerCase()) ||
    t.preview.toLowerCase().includes(searchStr.toLowerCase())
  );
  
  if (found.length > 0) {
    console.log('✅ FOUND in translations:');
    found.forEach(f => console.log(`   ${f.preview}`));
  } else {
    console.log('❌ NOT FOUND in translations');
  }
  console.log('');
});

// Check what's at the end of the translations
console.log('\n📋 Last 10 translations:');
translationData.translations.slice(-10).forEach((t, i) => {
  console.log(`${translationData.translations.length - 10 + i + 1}. ${t.preview}`);
});

// Load original DOM to check
if (fs.existsSync('sample-dom.json')) {
  console.log('\n🔍 Checking original DOM for these strings...\n');
  
  const domData = JSON.parse(fs.readFileSync('sample-dom.json', 'utf8'));
  
  searchStrings.forEach(searchStr => {
    console.log(`Searching DOM for: "${searchStr}"`);
    
    const found = domData.nodes.filter(node => {
      if (node.type === 'text' && node.text) {
        const text = node.text.text || '';
        const html = node.text.html || '';
        return text.toLowerCase().includes(searchStr.toLowerCase()) ||
               html.toLowerCase().includes(searchStr.toLowerCase());
      }
      return false;
    });
    
    if (found.length > 0) {
      console.log('✅ FOUND in DOM:');
      found.forEach(f => {
        console.log(`   Node ID: ${f.id}`);
        console.log(`   Text: "${f.text.text?.substring(0, 80)}..."`);
      });
    } else {
      console.log('❌ NOT FOUND in DOM');
    }
    console.log('');
  });
}