#!/usr/bin/env node

require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const ENGLISH_LOCALE_ID = '684230454832f0132d5f6cd0';
const FRENCH_LOCALE_ID = '684683d87f6a3ae6079ec99f';

async function initializeFrenchContent() {
  console.log('🚀 Initializing French locale with content from English...\n');
  
  try {
    // Get challenge page
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
    const challengePage = pagesData.pages?.find(p => p.slug === 'challenge');
    
    if (!challengePage) {
      throw new Error('Challenge page not found');
    }
    
    console.log(`Found challenge page: ${challengePage.id}`);
    
    // First, check current state of both locales
    console.log('\n📊 Checking current locale states...');
    
    const englishResponse = await fetch(
      `https://api.webflow.com/v2/pages/${challengePage.id}/dom?localeId=${ENGLISH_LOCALE_ID}&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const frenchResponse = await fetch(
      `https://api.webflow.com/v2/pages/${challengePage.id}/dom?localeId=${FRENCH_LOCALE_ID}&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (englishResponse.ok && frenchResponse.ok) {
      const englishData = await englishResponse.json();
      const frenchData = await frenchResponse.json();
      
      console.log(`English locale nodes: ${englishData.pagination?.total || 0}`);
      console.log(`French locale nodes: ${frenchData.pagination?.total || 0}`);
      
      if (frenchData.pagination?.total === 0) {
        console.log('\n⚠️  French locale is empty - this explains why translations don\'t show up!');
        console.log('We need to copy content from English to French first.');
        
        // Unfortunately, Webflow API v2 doesn't have a direct "copy locale" endpoint
        // The typical workflow is to use the Webflow Designer to enable and copy content
        console.log('\n📝 SOLUTION NEEDED:');
        console.log('1. Go to Webflow Designer → Site Settings → Localization');
        console.log('2. For the French locale, click "Create content for this locale"');
        console.log('3. This will copy all content from the primary locale to French');
        console.log('4. Then re-run the French translation script');
        
        console.log('\nAlternatively, we can try to manually copy content via API...');
        
        // Let's try to copy content manually
        await copyContentToFrench(challengePage.id);
        
      } else {
        console.log('✅ French locale already has content');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

async function copyContentToFrench(pageId) {
  console.log('\n🔄 Attempting to copy English content to French locale...');
  
  try {
    // Get all English content
    console.log('Reading all English content...');
    let allEnglishNodes = [];
    let offset = 0;
    const limit = 100;
    
    while (true) {
      const response = await fetch(
        `https://api.webflow.com/v2/pages/${pageId}/dom?localeId=${ENGLISH_LOCALE_ID}&limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      allEnglishNodes = allEnglishNodes.concat(data.nodes);
      
      console.log(`  Retrieved ${allEnglishNodes.length} nodes so far...`);
      
      if (offset + limit >= data.pagination.total) break;
      offset += limit;
    }
    
    console.log(`\n✅ Got ${allEnglishNodes.length} English nodes`);
    
    // Now try to create the same structure in French
    console.log('Copying structure to French locale...');
    
    // We'll copy text nodes to French locale
    const textNodes = allEnglishNodes.filter(node => 
      node.type === 'text' && node.text && node.text.text
    );
    
    console.log(`Found ${textNodes.length} text nodes to copy`);
    
    if (textNodes.length > 0) {
      // Copy in batches
      const BATCH_SIZE = 20;
      
      for (let i = 0; i < textNodes.length; i += BATCH_SIZE) {
        const batch = textNodes.slice(i, i + BATCH_SIZE);
        console.log(`\nCopying batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(textNodes.length / BATCH_SIZE)}...`);
        
        const updateNodes = batch.map(node => ({
          id: node.id,
          text: node.text
        }));
        
        const updateResponse = await fetch(
          `https://api.webflow.com/v2/pages/${pageId}/dom?localeId=${FRENCH_LOCALE_ID}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
              'Content-Type': 'application/json',
              'accept': 'application/json'
            },
            body: JSON.stringify({
              nodes: updateNodes
            })
          }
        );
        
        if (updateResponse.ok) {
          console.log(`  ✅ Copied ${updateNodes.length} nodes`);
        } else {
          const errorText = await updateResponse.text();
          console.log(`  ❌ Failed to copy batch: ${updateResponse.status} - ${errorText}`);
        }
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Check if content was copied
      console.log('\n🔍 Verifying French locale now has content...');
      const verifyResponse = await fetch(
        `https://api.webflow.com/v2/pages/${pageId}/dom?localeId=${FRENCH_LOCALE_ID}&limit=1`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json'
          }
        }
      );
      
      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        console.log(`French locale now has: ${verifyData.pagination?.total || 0} nodes`);
        
        if (verifyData.pagination?.total > 0) {
          console.log('✅ Success! French locale now has content');
          console.log('\n🔄 Now you can run the French translation script again:');
          console.log('node translate-french-progressive.js challenge');
        }
      }
    }
    
  } catch (error) {
    console.error('Error copying content:', error);
  }
}

initializeFrenchContent();