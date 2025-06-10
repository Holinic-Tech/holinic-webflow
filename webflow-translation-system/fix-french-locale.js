require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const FRENCH_LOCALE_ID = '684683d87f6a3ae6079ec99f';

async function fixFrenchLocale() {
  console.log('🔧 Fixing French locale initialization...\n');
  
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
    
    if (!page) {
      throw new Error('Page not found');
    }
    
    console.log('📄 Page:', page.title);
    console.log('📍 Page ID:', page.id);
    
    // Get all English nodes
    console.log('\n📥 Fetching English nodes...');
    let allEnglishNodes = [];
    let offset = 0;
    const limit = 100;
    
    while (true) {
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
      allEnglishNodes = allEnglishNodes.concat(data.nodes);
      
      if (offset + limit >= data.pagination.total) break;
      offset += limit;
    }
    
    console.log(`✅ Retrieved ${allEnglishNodes.length} English nodes`);
    
    // Get French nodes to see what's missing
    console.log('\n📥 Fetching French nodes...');
    let allFrenchNodes = [];
    offset = 0;
    
    while (true) {
      const response = await fetch(
        `https://api.webflow.com/v2/pages/${page.id}/dom?localeId=${FRENCH_LOCALE_ID}&limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      if (!response.ok) {
        console.log('❌ Error fetching French nodes:', data);
        break;
      }
      
      allFrenchNodes = allFrenchNodes.concat(data.nodes);
      
      if (offset + limit >= data.pagination.total) break;
      offset += limit;
    }
    
    console.log(`📊 French locale has ${allFrenchNodes.length} nodes`);
    console.log(`📊 English locale has ${allEnglishNodes.length} nodes`);
    console.log(`📊 Missing ${allEnglishNodes.length - allFrenchNodes.length} nodes in French`);
    
    // Find text nodes that exist in English but not in French
    const frenchNodeIds = new Set(allFrenchNodes.map(n => n.id));
    const missingTextNodes = allEnglishNodes.filter(node => 
      node.type === 'text' && 
      node.text?.text && 
      !frenchNodeIds.has(node.id)
    );
    
    console.log(`\n🔍 Found ${missingTextNodes.length} text nodes missing in French`);
    
    if (missingTextNodes.length > 0) {
      console.log('\n❌ The French locale is incomplete!');
      console.log('⚠️  You need to initialize the French locale in Webflow Designer:');
      console.log('   1. Go to Webflow Designer → Site Settings → Localization');
      console.log('   2. Find French (Standard) locale');
      console.log('   3. Click "Create content for this locale"');
      console.log('   4. This will copy all English content to French');
      console.log('   5. Then re-run the French translation');
      console.log('\n📝 Sample missing nodes:');
      missingTextNodes.slice(0, 5).forEach(node => {
        console.log(`   - ${node.id}: "${node.text.text.substring(0, 60)}..."`);
      });
    } else {
      console.log('\n✅ French locale appears to be properly initialized');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

fixFrenchLocale();