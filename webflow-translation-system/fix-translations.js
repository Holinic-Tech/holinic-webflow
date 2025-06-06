#!/usr/bin/env node
// Fix specific translation issues on German page
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf';

// Translation fixes to apply
const TRANSLATION_FIXES = [
  // Fix 14-Day Haircare Challenge
  { 
    pattern: /14-Day Haircare Challenge/gi, 
    replacement: '14-Tage-Haarpflege-Challenge' 
  },
  { 
    pattern: /14 Day Haircare Challenge/gi, 
    replacement: '14-Tage-Haarpflege-Challenge' 
  },
  { 
    pattern: /14-Tage-Haarpflege Challenge/gi,  // Fix partial translations
    replacement: '14-Tage-Haarpflege-Challenge' 
  },
  // Fix Good hair days
  { 
    pattern: /Good hair days/gi, 
    replacement: 'Tage mit perfektem Haar' 
  },
  { 
    pattern: /Gute Haartage/gi,  // Fix if translated literally
    replacement: 'Tage mit perfektem Haar' 
  },
  // Fix any remaining currency
  { 
    pattern: /\$(\d+)/g, 
    replacement: '€$1' 
  },
  { 
    pattern: /(\d+)\s*\$/g, 
    replacement: '$1€' 
  },
  { 
    pattern: /US\$\s*(\d+)/g, 
    replacement: '€$1' 
  }
];

async function fetchDom(pageId) {
  const domUrl = `https://api.webflow.com/v2/sites/${SITE_ID}/pages/${pageId}/dom?locale=${GERMAN_LOCALE_ID}`;
  
  const response = await fetch(domUrl, {
    headers: {
      'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch DOM: ${response.status}`);
  }

  return response.json();
}

async function fetchAllNodes(pageId) {
  const allNodes = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const domUrl = `https://api.webflow.com/v2/sites/${SITE_ID}/pages/${pageId}/dom?locale=${GERMAN_LOCALE_ID}&limit=${limit}&offset=${offset}`;
    
    const response = await fetch(domUrl, {
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch DOM: ${response.status}`);
    }

    const data = await response.json();
    allNodes.push(...data.nodes);

    if (data.nodes.length < limit || allNodes.length >= data.totalNodes) {
      break;
    }

    offset += limit;
  }

  return allNodes;
}

async function updateNode(nodeId, text) {
  const updateUrl = `https://api.webflow.com/v2/sites/${SITE_ID}/dom/nodes/${nodeId}?locale=${GERMAN_LOCALE_ID}`;
  
  const response = await fetch(updateUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update node: ${response.status} - ${error}`);
  }

  return response.json();
}

async function main() {
  console.log('🔧 Fixing German translations...\n');

  try {
    // First, let's find the page
    const pagesUrl = `https://api.webflow.com/v2/sites/${SITE_ID}/pages`;
    const pagesResponse = await fetch(pagesUrl, {
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const { pages } = await pagesResponse.json();
    const targetPage = pages.find(p => p.slug === 'the-haircare-challenge');
    
    if (!targetPage) {
      throw new Error('Page not found');
    }

    console.log(`Page ID: ${targetPage.id}`);
    console.log('Fetching all nodes...\n');

    const allNodes = await fetchAllNodes(targetPage.id);
    console.log(`Total nodes: ${allNodes.length}\n`);

    const nodesToUpdate = [];
    let foundCount = 0;

    // Check all text nodes
    allNodes.forEach(node => {
      if (node.type === 'text' && node.text) {
        const originalText = node.text.text || '';
        const originalHtml = node.text.html;
        let updatedText = originalText;
        let updatedHtml = originalHtml;
        let hasChanges = false;

        // Apply all fixes
        TRANSLATION_FIXES.forEach(({ pattern, replacement }) => {
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
          console.log(`📝 Node ${node.id}:`);
          console.log(`   Before: "${originalText}"`);
          console.log(`   After:  "${updatedText}"`);

          // Use HTML format if the node originally had HTML
          const finalText = updatedHtml || updatedText;
          
          nodesToUpdate.push({
            nodeId: node.id,
            text: finalText,
            originalText: originalText
          });
        }
      }
    });

    console.log(`\n✅ Found ${foundCount} nodes to update\n`);

    if (nodesToUpdate.length > 0) {
      console.log('Applying updates...\n');

      // Create backup
      const timestamp = Date.now();
      const backupData = {
        timestamp: new Date().toISOString(),
        nodes: nodesToUpdate
      };
      fs.writeFileSync(`translation-fixes-backup-${timestamp}.json`, JSON.stringify(backupData, null, 2));

      for (const update of nodesToUpdate) {
        try {
          console.log(`Updating node ${update.nodeId}...`);
          await updateNode(update.nodeId, update.text);
          console.log('✅ Success');
        } catch (error) {
          console.error(`❌ Failed: ${error.message}`);
        }
      }

      console.log('\n✅ All updates applied!');
    } else {
      console.log('No nodes need updating.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();