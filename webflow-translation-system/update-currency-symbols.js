#!/usr/bin/env node

// Update currency symbols from USD to EUR for European languages
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf';

// Currency patterns to search for
const CURRENCY_PATTERNS = [
  { pattern: /(\d+)\s*\$/g, replacement: '$1€' },  // 300 $ → 300€
  { pattern: /\$\s*(\d+)/g, replacement: '€$1' },  // $47 → €47
  { pattern: /US\$\s*(\d+)/g, replacement: '€$1' },
  { pattern: /USD\s*(\d+)/g, replacement: '€$1' },
  { pattern: /(\d+)\s*US\$/g, replacement: '$1€' },
  { pattern: /(\d+)\s*USD/g, replacement: '$1 EUR' },
  { pattern: /\bdollars?\b/gi, replacement: 'Euro' },
  { pattern: /\bDollars?\b/g, replacement: 'Euro' }
];

async function findAndUpdateCurrency(pageSlug, localeId) {
  console.log('\n💱 Finding and updating currency symbols...\n');
  
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
    const page = pagesData.pages.find(p => p.slug === pageSlug);
    
    if (!page) {
      throw new Error(`Page not found: ${pageSlug}`);
    }
    
    console.log(`Page ID: ${page.id}`);
    
    // Get all nodes with pagination
    let allNodes = [];
    let offset = 0;
    const limit = 100;
    
    console.log('Fetching all nodes...');
    while (true) {
      const response = await fetch(
        `https://api.webflow.com/v2/pages/${page.id}/dom?localeId=${localeId}&limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      allNodes = allNodes.concat(data.nodes);
      
      if (offset + limit >= data.pagination.total) break;
      offset += limit;
    }
    
    console.log(`\n📊 Total nodes: ${allNodes.length}`);
    
    // Find nodes with currency symbols
    const nodesToUpdate = [];
    let foundCount = 0;
    
    allNodes.forEach(node => {
      if (node.type === 'text' && node.text) {
        const originalText = node.text.text || '';
        const originalHtml = node.text.html;
        let updatedText = originalText;
        let updatedHtml = originalHtml;
        let hasChanges = false;
        
        // Apply all currency patterns
        CURRENCY_PATTERNS.forEach(({ pattern, replacement }) => {
          const before = updatedText;
          updatedText = updatedText.replace(pattern, replacement);
          if (before !== updatedText) {
            hasChanges = true;
          }
          
          // Also update HTML if present
          if (updatedHtml) {
            updatedHtml = updatedHtml.replace(pattern, replacement);
          }
        });
        
        if (hasChanges) {
          foundCount++;
          console.log(`\n🔍 Found currency in node ${node.id}:`);
          console.log(`   Before: "${originalText}"`);
          console.log(`   After:  "${updatedText}"`);
          
          // Use HTML format if the node originally had HTML
          const finalText = updatedHtml || updatedText;
          
          nodesToUpdate.push({
            nodeId: node.id,
            text: finalText,
            originalText: originalText,
            hasHtml: !!originalHtml
          });
        }
      }
    });
    
    if (nodesToUpdate.length === 0) {
      console.log('\n✅ No USD currency symbols found to update.');
      return;
    }
    
    console.log(`\n📝 Found ${foundCount} nodes with currency to update`);
    
    // Save backup
    const timestamp = Date.now();
    const backupFile = `currency-update-backup-${timestamp}.json`;
    fs.writeFileSync(backupFile, JSON.stringify({
      pageId: page.id,
      pageSlug: pageSlug,
      localeId: localeId,
      timestamp: new Date().toISOString(),
      updates: nodesToUpdate
    }, null, 2));
    console.log(`\n💾 Backup saved: ${backupFile}`);
    
    // Update the page
    console.log('\n📤 Updating currency symbols...');
    const updateResponse = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/dom?localeId=${localeId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          nodes: nodesToUpdate.map(n => ({
            nodeId: n.nodeId,
            text: n.text
          }))
        })
      }
    );
    
    const result = await updateResponse.json();
    
    if (result.errors?.length > 0) {
      console.log(`⚠️  ${result.errors.length} errors occurred`);
      result.errors.slice(0, 5).forEach(err => {
        console.log(`   - ${err.nodeId}: ${err.error}`);
      });
    } else {
      console.log('✅ Currency symbols updated successfully');
    }
    
    // Publish
    console.log('\n📢 Publishing...');
    try {
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
      console.log('✅ Site published');
    } catch (err) {
      console.log('⚠️  Publish warning:', err.message);
    }
    
    console.log('\n✨ Currency update complete!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Updated ${nodesToUpdate.length} nodes`);
    console.log(`   - Changed USD ($) to EUR (€)`);
    console.log('\n🔗 Check the updated page:');
    console.log(`   https://hairqare.co/de/${pageSlug}\n`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Main
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
💱 Currency Symbol Updater

Usage: node update-currency-symbols.js <page-slug> [locale-id]

Examples:
  node update-currency-symbols.js the-haircare-challenge
  node update-currency-symbols.js the-haircare-challenge ${GERMAN_LOCALE_ID}

This script will:
- Find all USD currency symbols ($, US$, USD)
- Convert them to EUR (€, EUR)
- Update the page and publish
    `);
    process.exit(1);
  }
  
  const pageSlug = args[0];
  const localeId = args[1] || GERMAN_LOCALE_ID;
  
  await findAndUpdateCurrency(pageSlug, localeId);
}

if (require.main === module) {
  main();
}