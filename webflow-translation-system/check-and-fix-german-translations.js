#!/usr/bin/env node

// Check and fix specific German translation issues
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
  // Fix any remaining USD currency
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

async function checkAndFixGerman() {
  console.log('🔍 Checking and fixing German translations...\n');

  try {
    // 1. Get the page
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
      throw new Error('Page not found');
    }
    
    console.log(`Found page: ${page.title} (${page.id})`);
    console.log(`Using German locale ID: ${GERMAN_LOCALE_ID}\n`);
    
    // 2. Get all DOM nodes with pagination
    console.log('Fetching all DOM nodes...');
    const allNodes = await fetchAllNodes(page.id);
    console.log(`Total nodes: ${allNodes.length}\n`);
    
    // 3. Find nodes that need fixing
    const nodesToFix = [];
    const issues = {
      currency: [],
      challengeTranslation: [],
      goodHairDays: []
    };
    
    allNodes.forEach(node => {
      if (node.type === 'text' && node.text) {
        const originalText = node.text.text || '';
        const originalHtml = node.text.html;
        let updatedText = originalText;
        let updatedHtml = originalHtml;
        let hasChanges = false;
        
        // Check for issues before fixing
        const content = originalHtml || originalText;
        if (content.match(/\$\d+/) || content.match(/\d+\s*\$/) || content.match(/US\$/)) {
          issues.currency.push({
            nodeId: node.id,
            text: content.substring(0, 100) + (content.length > 100 ? '...' : '')
          });
        }
        
        if (content.match(/14-Day Haircare Challenge/i) || 
            content.match(/14 Day Haircare Challenge/i) ||
            content.match(/14-Tage-Haarpflege Challenge/i)) {
          issues.challengeTranslation.push({
            nodeId: node.id,
            text: content.substring(0, 100) + (content.length > 100 ? '...' : '')
          });
        }
        
        if (content.match(/Good hair days/i) || content.match(/Gute Haartage/i)) {
          issues.goodHairDays.push({
            nodeId: node.id,
            text: content.substring(0, 100) + (content.length > 100 ? '...' : '')
          });
        }
        
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
          console.log(`📝 Node ${node.id}:`);
          console.log(`   Before: "${originalText.substring(0, 80)}..."`);
          console.log(`   After:  "${updatedText.substring(0, 80)}..."`);
          
          nodesToFix.push({
            nodeId: node.id,
            text: updatedHtml || updatedText
          });
        }
      }
    });
    
    // Report issues found
    console.log('\n📊 Issues found:');
    console.log(`   💵 Currency symbols: ${issues.currency.length}`);
    console.log(`   📅 "14-Day Haircare Challenge": ${issues.challengeTranslation.length}`);
    console.log(`   💇 "Good hair days": ${issues.goodHairDays.length}`);
    console.log(`\n✅ Found ${nodesToFix.length} nodes to fix\n`);
    
    if (nodesToFix.length === 0) {
      console.log('No fixes needed!');
      return;
    }
    
    // 4. Create backup
    const timestamp = Date.now();
    const backupData = {
      timestamp: new Date().toISOString(),
      issues: issues,
      fixes: nodesToFix
    };
    fs.writeFileSync(`german-fixes-backup-${timestamp}.json`, JSON.stringify(backupData, null, 2));
    console.log(`💾 Backup saved to german-fixes-backup-${timestamp}.json\n`);
    
    // 5. Apply fixes
    console.log('Applying fixes...');
    
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
          nodes: nodesToFix
        })
      }
    );
    
    const responseText = await updateResponse.text();
    
    if (updateResponse.ok) {
      console.log('\n✅ SUCCESS! German page updated');
      
      // 6. Publish the site
      console.log('\nPublishing site...');
      await publishSite();
      
      console.log('\n✅ German translations fixed!');
      console.log(`\n🔗 Check the results at:`);
      console.log(`   https://hairqare.co/de/the-haircare-challenge`);
      
    } else {
      console.log('\n❌ Update failed');
      console.log(`   Status: ${updateResponse.status}`);
      console.log(`   Response: ${responseText.substring(0, 200)}...`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function fetchAllNodes(pageId) {
  const allNodes = [];
  let offset = 0;
  const limit = 100;
  
  while (true) {
    const response = await fetch(
      `https://api.webflow.com/v2/pages/${pageId}/dom?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch DOM: ${response.status}`);
    }
    
    const data = await response.json();
    allNodes.push(...data.nodes);
    
    if (data.nodes.length < limit || allNodes.length >= data.pagination.total) {
      break;
    }
    
    offset += limit;
  }
  
  return allNodes;
}

async function publishSite() {
  try {
    const response = await fetch(
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
    
    if (response.ok) {
      console.log('✅ Site published successfully');
    } else {
      const errorText = await response.text();
      console.log('⚠️  Failed to publish site:', errorText.substring(0, 100));
    }
  } catch (error) {
    console.error('⚠️  Publish error:', error.message);
  }
}

checkAndFixGerman();