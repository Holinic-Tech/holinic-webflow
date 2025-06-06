#!/usr/bin/env node

// Translate only specific missing strings
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf';

// Specific strings to find and translate
const TARGET_STRINGS = [
  "Say the Challenge is life changing",
  "See our 100% money-back guarantee",
  "No matter what you try, the solution to your hair loss  remains out of reach. 😭"
];

// Pre-translated strings (to save API calls)
const TRANSLATIONS = {
  "Say the Challenge is life changing": "Sag, dass die Challenge lebensverändernd ist",
  "See our 100% money-back guarantee": "Sieh dir unsere 100% Geld-zurück-Garantie an",
  "No matter what you try, the solution to your hair loss  remains out of reach. 😭": "Egal was du versuchst, die Lösung für deinen Haarausfall bleibt unerreichbar. 😭"
};

async function findAndTranslateSpecificStrings() {
  console.log('\n🎯 Translating specific missing strings...\n');
  
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
    
    console.log(`Page ID: ${page.id}\n`);
    
    // Get nodes starting from offset 100 (where missing content is)
    console.log('Searching for target strings...\n');
    
    let foundNodes = [];
    let offset = 100;
    const limit = 100;
    let hasMore = true;
    
    while (hasMore && foundNodes.length < TARGET_STRINGS.length * 2) { // Allow for duplicates
      const response = await fetch(
        `https://api.webflow.com/v2/pages/${page.id}/dom?limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      
      // Search for target strings
      data.nodes.forEach(node => {
        if (node.type === 'text' && node.text) {
          const nodeText = node.text.text || '';
          
          TARGET_STRINGS.forEach(target => {
            if (nodeText.includes(target)) {
              console.log(`✅ Found: "${target.substring(0, 40)}..."`);
              console.log(`   Node ID: ${node.id}`);
              
              foundNodes.push({
                nodeId: node.id,
                originalText: nodeText,
                targetString: target,
                hasHtml: !!node.text.html
              });
            }
          });
        }
      });
      
      if (offset + limit >= data.pagination.total) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }
    
    console.log(`\n✅ Found ${foundNodes.length} nodes to translate`);
    
    if (foundNodes.length === 0) {
      console.log('❌ No target strings found!');
      return;
    }
    
    // Translate found nodes
    console.log('\n🔄 Applying translations...');
    const updates = [];
    
    foundNodes.forEach(node => {
      const translation = TRANSLATIONS[node.targetString];
      if (translation) {
        // Replace the target string with translation
        const translatedText = node.originalText.replace(node.targetString, translation);
        
        updates.push({
          nodeId: node.nodeId,
          text: translatedText
        });
        
        console.log(`   Translated: "${node.targetString.substring(0, 30)}..." → "${translation.substring(0, 30)}..."`);
      }
    });
    
    // Also translate any remaining English text in those nodes
    console.log('\n🔍 Checking for additional untranslated content nearby...');
    
    // Get a wider range around where we found the strings
    const extendedResponse = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/dom?limit=50&offset=${Math.max(100, offset - 50)}`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const extendedData = await extendedResponse.json();
    let additionalUpdates = 0;
    
    // Quick check for obvious English phrases that should be translated
    const englishIndicators = [
      "hair loss", "hair problems", "guarantee", "results", 
      "challenge", "transform", "solution", "try"
    ];
    
    extendedData.nodes.forEach(node => {
      if (node.type === 'text' && node.text?.text) {
        const text = node.text.text;
        const hasEnglish = englishIndicators.some(indicator => 
          text.toLowerCase().includes(indicator) && 
          !updates.find(u => u.nodeId === node.id)
        );
        
        if (hasEnglish && text.length > 20) {
          console.log(`   Found additional English text: "${text.substring(0, 50)}..."`);
          additionalUpdates++;
        }
      }
    });
    
    if (additionalUpdates > 0) {
      console.log(`\n⚠️  Found ${additionalUpdates} additional nodes with English text nearby.`);
      console.log('   Consider running the full translation script for complete coverage.');
    }
    
    // Save backup
    const backupFile = `specific-strings-translation-${Date.now()}.json`;
    fs.writeFileSync(backupFile, JSON.stringify({
      pageId: page.id,
      timestamp: new Date().toISOString(),
      updates: updates
    }, null, 2));
    console.log(`\n💾 Backup saved: ${backupFile}`);
    
    // Update page
    console.log('\n📤 Updating page...');
    const updateResponse = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/dom?localeId=${GERMAN_LOCALE_ID}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          nodes: updates
        })
      }
    );
    
    const result = await updateResponse.json();
    
    if (result.errors?.length > 0) {
      console.log(`⚠️  ${result.errors.length} errors occurred`);
    } else {
      console.log('✅ Specific strings updated successfully');
    }
    
    // Publish
    console.log('\n📢 Publishing...');
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
          publishTargets: ['live']
        })
      }
    );
    console.log('✅ Published');
    
    console.log('\n✨ Specific strings translated!');
    console.log('\n🔗 Check: https://hairqare.co/de/the-haircare-challenge');
    console.log('\n📝 Next steps:');
    console.log('   Run translate-complete-page.js for full translation of remaining content\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Run
if (require.main === module) {
  findAndTranslateSpecificStrings();
}