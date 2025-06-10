#!/usr/bin/env node

// Test French translation setup
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const FRENCH_LOCALE_ID = '684683d87f6a3ae6079ec99f';

async function testFrenchSetup() {
  console.log('🔍 Testing French Translation Setup...\n');
  
  // 1. Test Webflow API
  console.log('1️⃣ Testing Webflow API access...');
  try {
    const response = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (response.ok) {
      console.log('✅ Webflow API access confirmed\n');
    } else {
      console.log('❌ Webflow API access failed\n');
      return;
    }
  } catch (error) {
    console.log('❌ Error:', error.message, '\n');
    return;
  }
  
  // 2. Check French locale
  console.log('2️⃣ Checking French locale configuration...');
  try {
    const response = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}/locales`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    const frenchLocale = data.locales?.find(l => l.id === FRENCH_LOCALE_ID);
    
    if (frenchLocale) {
      console.log('✅ French locale found:', {
        id: frenchLocale.id,
        code: frenchLocale.cmsLocaleId,
        displayName: frenchLocale.displayName,
        enabled: frenchLocale.enabled,
        subdirectory: frenchLocale.subdirectory
      }, '\n');
    } else {
      console.log('❌ French locale not found\n');
      console.log('Available locales:', data.locales?.map(l => ({
        displayName: l.displayName,
        id: l.id
      })), '\n');
    }
  } catch (error) {
    console.log('❌ Error:', error.message, '\n');
  }
  
  // 3. Test OpenAI translation
  console.log('3️⃣ Testing French translation with OpenAI...');
  try {
    const testText = "Good hair days are possible with the right routine";
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { 
            role: 'system', 
            content: `Translate to French using informal "tu", like talking to a girlfriend aged 25-35. Keep it friendly and conversational.` 
          },
          { role: 'user', content: testText }
        ],
        temperature: 0.3,
        max_tokens: 100
      })
    });
    
    const data = await response.json();
    const translation = data.choices[0].message.content;
    
    console.log('✅ Translation test successful:');
    console.log(`   English: "${testText}"`);
    console.log(`   French: "${translation}"\n`);
  } catch (error) {
    console.log('❌ Translation error:', error.message, '\n');
  }
  
  // 4. Check for French pages
  console.log('4️⃣ Checking for existing French pages...');
  try {
    const response = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}/pages`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    const challengePage = data.pages?.find(p => p.slug === 'challenge');
    
    if (challengePage) {
      console.log('✅ Found challenge page\n');
      
      // Check if French version exists
      console.log('5️⃣ Checking French page content...');
      const domResponse = await fetch(
        `https://api.webflow.com/v2/pages/${challengePage.id}/dom?locale=${FRENCH_LOCALE_ID}`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json'
          }
        }
      );
      
      const domData = await domResponse.json();
      console.log(`   Total nodes in French locale: ${domData.pagination?.total || 0}`);
      
      if (domData.pagination?.total === 0) {
        console.log('   ⚠️  French page structure not created yet');
        console.log('   ℹ️  You need to open the page in Webflow Designer, switch to French locale, and save\n');
      } else {
        console.log('   ✅ French page structure exists and ready for translation\n');
      }
    }
  } catch (error) {
    console.log('❌ Error:', error.message, '\n');
  }
  
  console.log('📋 Summary:');
  console.log('- French locale ID: ' + FRENCH_LOCALE_ID);
  console.log('- To translate a page, run:');
  console.log('  node translate-page-multilingual.js --lang fr --page challenge');
  console.log('\n🎉 French translation system is ready!');
}

testFrenchSetup();