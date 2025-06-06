#!/usr/bin/env node

// Update German page using DOM API with locale
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function updateGermanPage() {
  console.log('\n🚀 Updating German page with translations...\n');
  
  try {
    // 1. Load the backup with translations
    const backupFile = 'backup-the-haircare-challenge-de-1749164195716.json';
    if (!fs.existsSync(backupFile)) {
      console.error('❌ Backup file not found:', backupFile);
      return;
    }
    
    const translationData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    console.log(`✅ Loaded translations from ${backupFile}`);
    console.log(`   Total nodes: ${translationData.nodes.length}`);
    
    // 2. Get the page
    console.log('\n2. Finding the haircare challenge page...');
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
      console.error('❌ Page not found');
      return;
    }
    
    console.log(`✅ Found page: ${mainPage.title}`);
    console.log(`   Page ID: ${mainPage.id}`);
    
    // 3. Prepare update payload
    console.log('\n3. Preparing update payload...');
    
    // Filter only text nodes that have translations
    const nodesToUpdate = translationData.nodes
      .filter(node => node.type === 'text' && node.text && node.text.text)
      .map(node => ({
        nodeId: node.id,
        text: node.text.html || node.text.text
      }));
    
    console.log(`   Prepared ${nodesToUpdate.length} text nodes for update`);
    
    // Show first few updates
    console.log('\n   Sample updates:');
    nodesToUpdate.slice(0, 3).forEach((node, i) => {
      console.log(`   ${i + 1}. ${node.text.substring(0, 60)}...`);
    });
    
    // 4. Try different locale IDs (common ones)
    const possibleLocaleIds = ['de', 'de-DE', 'de_DE', 'german'];
    
    console.log('\n4. Attempting to update with German locale...');
    
    for (const localeId of possibleLocaleIds) {
      console.log(`\n   Trying locale ID: ${localeId}`);
      
      const updateResponse = await fetch(
        `https://api.webflow.com/v2/pages/${mainPage.id}/dom?localeId=${localeId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'Content-Type': 'application/json',
            'accept': 'application/json'
          },
          body: JSON.stringify({
            nodes: nodesToUpdate
          })
        }
      );
      
      if (updateResponse.ok) {
        const result = await updateResponse.json();
        console.log(`   ✅ SUCCESS! Updated with locale ID: ${localeId}`);
        console.log(`   Errors: ${result.errors?.length || 0}`);
        
        if (result.errors && result.errors.length > 0) {
          console.log('   Errors:', result.errors);
        }
        
        // 5. Publish the site
        console.log('\n5. Publishing site...');
        await publishSite();
        
        console.log('\n✅ German page updated successfully!');
        console.log(`\n🔗 Check the results at:`);
        console.log(`   https://hairqare.co/de/the-haircare-challenge`);
        
        return;
      } else {
        const errorText = await updateResponse.text();
        console.log(`   ❌ Failed (${updateResponse.status}): ${errorText.substring(0, 100)}...`);
      }
    }
    
    console.log('\n❌ Could not update with any locale ID');
    console.log('\nPossible issues:');
    console.log('1. The locale ID might be different than expected');
    console.log('2. The page might need to be duplicated for the German locale');
    console.log('3. Permissions might be insufficient');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
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
      console.log('   ✅ Site published');
    } else {
      console.log('   ⚠️ Failed to publish site');
    }
  } catch (error) {
    console.error('   ⚠️ Publish error:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  updateGermanPage();
}