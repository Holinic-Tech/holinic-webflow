require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const FRENCH_LOCALE_ID = '684683d87f6a3ae6079ec99f';

async function testSingleNode() {
  console.log('🧪 Testing single node translation...\n');
  
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
    
    // Get first text node
    const domResponse = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/dom?limit=20`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const domData = await domResponse.json();
    const textNode = domData.nodes.find(n => n.type === 'text' && n.text?.text && n.text.text.length > 10);
    
    if (!textNode) {
      throw new Error('No suitable text node found');
    }
    
    console.log('📝 Original text:', textNode.text.text);
    console.log('🆔 Node ID:', textNode.id);
    
    // Test translation
    const testTranslation = {
      nodes: [
        {
          nodeId: textNode.id,
          text: 'TEST FRANÇAIS - ' + new Date().toISOString()
        }
      ]
    };
    
    console.log('\n🔄 Applying test translation...');
    const updateResponse = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/dom?localeId=${FRENCH_LOCALE_ID}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(testTranslation)
      }
    );
    
    const updateResult = await updateResponse.json();
    
    if (updateResponse.ok) {
      console.log('✅ Translation successful!');
      console.log('📊 Result:', updateResult);
      
      // Publish the site
      console.log('\n🚀 Publishing site...');
      const publishResponse = await fetch(
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
      
      if (publishResponse.ok) {
        console.log('✅ Site published successfully!');
        console.log('\n🔗 Check the French page: https://hairqare.webflow.io/fr/the-haircare-challenge');
        console.log('   You should see the test text at the top of the page');
      } else {
        console.log('❌ Publishing failed:', await publishResponse.text());
      }
      
    } else {
      console.log('❌ Translation failed');
      console.log('📊 Status:', updateResponse.status);
      console.log('📊 Response:', updateResult);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testSingleNode();