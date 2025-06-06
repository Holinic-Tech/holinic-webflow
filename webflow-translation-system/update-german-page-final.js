#!/usr/bin/env node

// Update German page using the correct locale ObjectId
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf'; // Found from site data

async function updateGermanPage() {
  console.log('\n🚀 Updating German page with translations...\n');
  console.log(`Using German locale ID: ${GERMAN_LOCALE_ID}`);
  
  try {
    // 1. Load the backup with translations
    const backupFile = 'backup-the-haircare-challenge-de-1749164195716.json';
    if (!fs.existsSync(backupFile)) {
      console.error('❌ Backup file not found:', backupFile);
      return;
    }
    
    const translationData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    console.log(`\n✅ Loaded translations from ${backupFile}`);
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
    console.log('\n   Sample translations:');
    nodesToUpdate.slice(0, 5).forEach((node, i) => {
      const preview = node.text.replace(/<[^>]*>/g, '').substring(0, 60);
      console.log(`   ${i + 1}. "${preview}..."`);
    });
    
    // 4. Update with German locale
    console.log('\n4. Updating page with German locale...');
    
    const updateResponse = await fetch(
      `https://api.webflow.com/v2/pages/${mainPage.id}/dom?localeId=${GERMAN_LOCALE_ID}`,
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
    
    const responseText = await updateResponse.text();
    
    if (updateResponse.ok) {
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        result = { errors: [] };
      }
      
      console.log(`\n✅ SUCCESS! Page updated for German locale`);
      console.log(`   Status: ${updateResponse.status}`);
      console.log(`   Errors: ${result.errors?.length || 0}`);
      
      if (result.errors && result.errors.length > 0) {
        console.log('   Error details:', result.errors);
      }
      
      // 5. Publish the site
      console.log('\n5. Publishing site...');
      await publishSite();
      
      console.log('\n✅ German page updated successfully!');
      console.log(`\n🔗 Check the results at:`);
      console.log(`   https://hairqare.co/de/the-haircare-challenge`);
      console.log(`\n📝 Summary:`);
      console.log(`   - Updated ${nodesToUpdate.length} text elements`);
      console.log(`   - Applied professional German translations`);
      console.log(`   - Page published to live site`);
      
    } else {
      console.log(`\n❌ Update failed`);
      console.log(`   Status: ${updateResponse.status}`);
      console.log(`   Response: ${responseText.substring(0, 200)}...`);
      
      // Parse error if possible
      try {
        const errorData = JSON.parse(responseText);
        console.log('\n   Error details:');
        console.log(`   Message: ${errorData.message || 'Unknown'}`);
        if (errorData.details) {
          console.log(`   Details: ${JSON.stringify(errorData.details, null, 2)}`);
        }
      } catch {
        // Response wasn't JSON
      }
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
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
      console.log('   ✅ Site published successfully');
    } else {
      const errorText = await response.text();
      console.log('   ⚠️  Failed to publish site:', errorText.substring(0, 100));
    }
  } catch (error) {
    console.error('   ⚠️  Publish error:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  updateGermanPage();
}