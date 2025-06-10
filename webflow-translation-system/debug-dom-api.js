require('dotenv').config();
const fetch = require('node-fetch');

async function debugDOMAPI() {
  console.log('🔍 Testing DOM API calls...\n');
  
  try {
    // Get pages
    const pagesResponse = await fetch(
      `https://api.webflow.com/v2/sites/${process.env.WEBFLOW_SITE_ID}/pages`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.WEBFLOW_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const pagesData = await pagesResponse.json();
    const page = pagesData.pages.find(p => p.slug === 'the-haircare-challenge');
    
    if (!page) {
      throw new Error('Page not found');
    }
    
    console.log('✅ Page found:', page.title);
    console.log('   Page ID:', page.id);
    
    // Test DOM fetch
    console.log('\n🔍 Testing DOM fetch...');
    const domResponse = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/dom?limit=5`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.WEBFLOW_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const domData = await domResponse.json();
    
    if (domResponse.ok) {
      console.log('✅ DOM fetch successful');
      console.log('   Total nodes:', domData.pagination.total);
      console.log('   Sample node:');
      const textNode = domData.nodes.find(n => n.type === 'text' && n.text?.text);
      if (textNode) {
        console.log('     Type:', textNode.type);
        console.log('     ID:', textNode.id);
        console.log('     Text:', textNode.text.text.substring(0, 50) + '...');
        
        // Test different DOM update formats
        console.log('\n🔍 Testing French locale DOM update formats...');
        
        // Format 1: nodeId + text
        console.log('   Testing format 1 (nodeId + text)...');
        const testUpdate1 = {
          nodes: [
            {
              nodeId: textNode.id,
              text: 'TEST FRENCH TEXT 1 - ' + new Date().toISOString()
            }
          ]
        };
        
        let updateResponse = await fetch(
          `https://api.webflow.com/v2/pages/${page.id}/dom?localeId=684683d87f6a3ae6079ec99f`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.WEBFLOW_TOKEN}`,
              'Content-Type': 'application/json',
              'accept': 'application/json'
            },
            body: JSON.stringify(testUpdate1)
          }
        );
        
        let updateResult = await updateResponse.json();
        
        if (updateResponse.ok) {
          console.log('   ✅ Format 1 successful:', updateResult);
          return;
        } else {
          console.log('   ❌ Format 1 failed:', updateResult.message);
        }
        
        // Format 2: nodeId + value
        console.log('   Testing format 2 (nodeId + value)...');
        const testUpdate2 = {
          nodes: [
            {
              nodeId: textNode.id,
              value: 'TEST FRENCH TEXT 2 - ' + new Date().toISOString()
            }
          ]
        };
        
        updateResponse = await fetch(
          `https://api.webflow.com/v2/pages/${page.id}/dom?localeId=684683d87f6a3ae6079ec99f`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.WEBFLOW_TOKEN}`,
              'Content-Type': 'application/json',
              'accept': 'application/json'
            },
            body: JSON.stringify(testUpdate2)
          }
        );
        
        updateResult = await updateResponse.json();
        
        if (updateResponse.ok) {
          console.log('   ✅ Format 2 successful:', updateResult);
        } else {
          console.log('   ❌ Format 2 failed:', updateResult.message);
        }
      }
    } else {
      console.log('❌ DOM fetch failed:', domData);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

debugDOMAPI();