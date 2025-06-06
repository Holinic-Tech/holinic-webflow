#!/usr/bin/env node

// Quick fix for German translations on /challenge page
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf';

// Translation fixes to apply
const TRANSLATION_FIXES = [
  { pattern: /14-Day Haircare Challenge/gi, replacement: '14-Tage-Haarpflege-Challenge' },
  { pattern: /14 days? haircare challenge/gi, replacement: '14-Tage-Haarpflege-Challenge' },
  { pattern: /Good hair days/gi, replacement: 'Tage mit perfektem Haar' },
  { pattern: /\$(\d+)/g, replacement: '€$1' },
  { pattern: /(\d+)\s*\$/g, replacement: '$1€' },
  { pattern: /US\$\s*(\d+)/g, replacement: '€$1' }
];

async function fixChallengeGerman() {
  console.log('\n🔧 Fixing German translations on /challenge page...\n');
  
  try {
    // 1. Find the challenge page
    console.log('1️⃣ Finding /challenge page...');
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
    const page = pagesData.pages.find(p => p.slug === 'challenge');
    
    if (!page) {
      console.error('❌ Page "challenge" not found!');
      return;
    }
    
    console.log(`✅ Found: ${page.title}`);
    console.log(`   ID: ${page.id}`);
    
    // 2. Get current German content
    console.log('\n2️⃣ Fetching current German content...');
    const allNodes = [];
    let offset = 0;
    const limit = 100;
    
    while (true) {
      const response = await fetch(
        `https://api.webflow.com/v2/pages/${page.id}/dom?localeId=${GERMAN_LOCALE_ID}&limit=${limit}&offset=${offset}`,
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
      
      if (data.nodes.length < limit) break;
      offset += limit;
    }
    
    console.log(`   Total nodes: ${allNodes.length}`);
    
    // 3. Find and fix issues
    console.log('\n3️⃣ Checking for fixes needed...');
    const nodesToFix = [];
    let fixCount = 0;
    
    allNodes.forEach(node => {
      if (node.type === 'text' && node.text && node.text.text) {
        const originalText = node.text.text;
        const originalHtml = node.text.html;
        let fixedText = originalText;
        let fixedHtml = originalHtml;
        let needsFix = false;
        
        // Apply all fixes
        TRANSLATION_FIXES.forEach(fix => {
          if (fix.pattern.test(fixedText)) {
            needsFix = true;
            fixedText = fixedText.replace(fix.pattern, fix.replacement);
            if (fixedHtml) {
              fixedHtml = fixedHtml.replace(fix.pattern, fix.replacement);
            }
          }
        });
        
        if (needsFix) {
          fixCount++;
          console.log(`   📝 Node ${node.id}:`);
          console.log(`      Before: "${originalText.substring(0, 60)}..."`);
          console.log(`      After:  "${fixedText.substring(0, 60)}..."`);
          
          nodesToFix.push({
            nodeId: node.id,
            text: fixedHtml || fixedText
          });
        }
      }
    });
    
    console.log(`\n✅ Found ${fixCount} nodes to fix`);
    
    if (nodesToFix.length === 0) {
      console.log('\n✨ No fixes needed - German translations look good!');
      return;
    }
    
    // 4. Apply fixes
    console.log('\n4️⃣ Applying fixes...');
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
    
    if (updateResponse.ok) {
      console.log('   ✅ Fixes applied successfully!');
    } else {
      const error = await updateResponse.text();
      console.error('   ❌ Update failed:', updateResponse.status);
      console.error('   Error:', error.substring(0, 200));
    }
    
    // 5. Save backup
    const backupFile = `fix-challenge-backup-${Date.now()}.json`;
    fs.writeFileSync(backupFile, JSON.stringify({
      pageId: page.id,
      pageSlug: page.slug,
      timestamp: new Date().toISOString(),
      fixes: nodesToFix
    }, null, 2));
    console.log(`\n💾 Backup saved to ${backupFile}`);
    
    // 6. Publish
    console.log('\n5️⃣ Publishing...');
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
            publishToWebflowSubdomain: true
          })
        }
      );
      console.log('   ✅ Published!');
    } catch (error) {
      console.log('   ⚠️  Publish error (may be rate limited)');
    }
    
    console.log('\n✅ German fixes complete!');
    console.log('\n🔗 Check the page at:');
    console.log('   https://hairqare.co/de/challenge');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Run
if (require.main === module) {
  fixChallengeGerman();
}