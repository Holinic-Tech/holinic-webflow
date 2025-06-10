#!/usr/bin/env node

require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

async function verifyFrenchLiveContent() {
  console.log('🔍 Verifying French content on live site...\n');
  
  try {
    // Check the live French URL directly
    console.log('Checking live French page: https://hairqare.webflow.io/fr/the-haircare-challenge');
    
    const liveResponse = await fetch('https://hairqare.webflow.io/fr/the-haircare-challenge');
    
    if (liveResponse.ok) {
      const html = await liveResponse.text();
      
      // Look for French indicators in the HTML
      const frenchIndicators = [
        'le ', 'la ', 'les ', 'de ', 'du ', 'des ', 'et ', 'est ', 'sont ',
        'tu ', 'ton ', 'ta ', 'tes ', 'toi ', 'te ', 'vous ', 'votre ', 'vos ',
        'pour ', 'avec ', 'dans ', 'sur ', 'sous ', 'chez ', 'par ', 'sans ',
        'mais ', 'ou ', 'donc ', 'car ', 'ne ', 'pas ', 'plus ', 'très ', 'bien '
      ];
      
      let frenchWordCount = 0;
      frenchIndicators.forEach(word => {
        if (html.toLowerCase().includes(word)) {
          frenchWordCount++;
        }
      });
      
      console.log(`French words detected: ${frenchWordCount}/${frenchIndicators.length}`);
      
      // Look for specific challenge content
      const challengeText = html.match(/<title[^>]*>(.*?)<\/title>/i);
      if (challengeText) {
        console.log(`Page title: "${challengeText[1]}"`);
      }
      
      // Look for main heading
      const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
      if (h1Match) {
        console.log(`Main heading: "${h1Match[1].replace(/<[^>]*>/g, '')}"`);
      }
      
      // Check if it's the same as the German page
      console.log('\nChecking German page for comparison...');
      const germanResponse = await fetch('https://hairqare.webflow.io/de/the-haircare-challenge');
      if (germanResponse.ok) {
        const germanHtml = await germanResponse.text();
        const germanTitle = germanHtml.match(/<title[^>]*>(.*?)<\/title>/i);
        const germanH1 = germanHtml.match(/<h1[^>]*>(.*?)<\/h1>/i);
        
        if (germanTitle) {
          console.log(`German title: "${germanTitle[1]}"`);
        }
        if (germanH1) {
          console.log(`German heading: "${germanH1[1].replace(/<[^>]*>/g, '')}"`);
        }
      }
      
      // Check if French page content is identical to English (indicating no translation)
      console.log('\nChecking English page for comparison...');
      const englishResponse = await fetch('https://hairqare.webflow.io/the-haircare-challenge');
      if (englishResponse.ok) {
        const englishHtml = await englishResponse.text();
        const englishTitle = englishHtml.match(/<title[^>]*>(.*?)<\/title>/i);
        const englishH1 = englishHtml.match(/<h1[^>]*>(.*?)<\/h1>/i);
        
        if (englishTitle) {
          console.log(`English title: "${englishTitle[1]}"`);
        }
        if (englishH1) {
          console.log(`English heading: "${englishH1[1].replace(/<[^>]*>/g, '')}"`);
        }
        
        // Compare if French page is just showing English content
        if (challengeText && englishTitle && challengeText[1] === englishTitle[1]) {
          console.log('\n⚠️  WARNING: French page title is identical to English - French translations not applied!');
        }
      }
      
    } else {
      console.log(`❌ Failed to fetch French page: ${liveResponse.status} - ${liveResponse.statusText}`);
    }
    
    // Check if French locale needs to be properly initialized
    console.log('\n🔧 Checking if French locale needs initialization...');
    
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
    
    if (challengePage) {
      // Check if we can copy content from English to French locale
      console.log('Testing if we can read English content to copy to French...');
      
      const englishDomResponse = await fetch(
        `https://api.webflow.com/v2/pages/${challengePage.id}/dom?localeId=684230454832f0132d5f6cd0&limit=5`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json'
          }
        }
      );
      
      if (englishDomResponse.ok) {
        const englishDom = await englishDomResponse.json();
        console.log(`✅ English locale has ${englishDom.pagination?.total} nodes`);
        
        // Show sample English content
        const textNodes = englishDom.nodes?.filter(n => n.type === 'text' && n.text?.text);
        if (textNodes && textNodes.length > 0) {
          console.log('Sample English content:');
          textNodes.slice(0, 3).forEach(node => {
            console.log(`  - "${node.text.text.substring(0, 60)}..."`);
          });
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

verifyFrenchLiveContent();