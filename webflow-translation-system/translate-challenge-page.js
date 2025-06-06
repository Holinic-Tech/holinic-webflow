#!/usr/bin/env node

// Translate the /challenge page to German
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf';

const GERMAN_INSTRUCTIONS = `Use informal "du" throughout. Keep "Challenge" untranslated when standalone. Natural conversational German.
"Hassle" → "Stress" (NOT "Ärger"). Keep "DIY" as is. Friendly and relatable tone.
KEY TRANSLATIONS:
- "14-Day Haircare Challenge" → "14-Tage-Haarpflege-Challenge"
- "Good hair days" → "Tage mit perfektem Haar"
- "Challenge" (standalone/capitalized) → keep as "Challenge"
- "Hairqare" → NEVER translate (brand name)
- "DIY" → keep as "DIY"
CURRENCY: Convert all USD ($, US$) to EUR (€). Examples: $47 → €47, 300 $ → 300€`;

async function translateChallengePage() {
  console.log('\n🌐 Translating /challenge page to German...\n');
  
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
      console.error('❌ Page with slug "challenge" not found!');
      console.log('\nAvailable pages:');
      pagesData.pages.forEach(p => {
        console.log(`  - ${p.slug} (${p.title})`);
      });
      return;
    }
    
    console.log(`✅ Found page: ${page.title}`);
    console.log(`   Page ID: ${page.id}`);
    console.log(`   Slug: ${page.slug}`);
    
    // 2. Fetch all nodes with pagination
    console.log('\n2️⃣ Fetching page content...');
    const allNodes = [];
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
      
      if (!response.ok) {
        throw new Error(`Failed to fetch DOM: ${response.status}`);
      }
      
      const data = await response.json();
      allNodes.push(...data.nodes);
      console.log(`   Fetched nodes ${offset + 1}-${offset + data.nodes.length}`);
      
      if (data.nodes.length < limit || allNodes.length >= data.pagination.total) {
        break;
      }
      
      offset += limit;
    }
    
    console.log(`   Total nodes: ${allNodes.length}`);
    
    // 3. Filter text nodes to translate
    console.log('\n3️⃣ Analyzing text nodes...');
    const textNodes = allNodes.filter(node => 
      node.type === 'text' && 
      node.text && 
      node.text.text && 
      node.text.text.trim().length > 2 &&
      /[a-zA-Z]/.test(node.text.text)
    );
    
    console.log(`   Found ${textNodes.length} text nodes to translate`);
    
    // Show sample texts
    console.log('\n   Sample texts:');
    textNodes.slice(0, 5).forEach((node, i) => {
      console.log(`   ${i + 1}. "${node.text.text.substring(0, 60)}..."`);
    });
    
    // 4. Translate in batches
    console.log('\n4️⃣ Translating content...');
    const batchSize = 10;
    const translations = [];
    
    for (let i = 0; i < textNodes.length; i += batchSize) {
      const batch = textNodes.slice(i, i + batchSize);
      console.log(`   Translating batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(textNodes.length/batchSize)}...`);
      
      try {
        const batchTranslations = await translateBatch(batch);
        translations.push(...batchTranslations);
      } catch (error) {
        console.error(`   ❌ Batch error: ${error.message}`);
      }
      
      // Small delay between batches
      if (i + batchSize < textNodes.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`   ✅ Translated ${translations.length} nodes`);
    
    // 5. Save backup
    const timestamp = Date.now();
    const backupData = {
      pageId: page.id,
      pageSlug: page.slug,
      pageTitle: page.title,
      timestamp: new Date().toISOString(),
      translations: translations
    };
    const backupFile = `backup-challenge-de-${timestamp}.json`;
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    console.log(`\n5️⃣ Backup saved to ${backupFile}`);
    
    // 6. Apply translations
    console.log('\n6️⃣ Applying translations to German locale...');
    
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
          nodes: translations
        })
      }
    );
    
    if (updateResponse.ok) {
      console.log('   ✅ Translations applied successfully!');
    } else {
      const error = await updateResponse.text();
      console.error('   ❌ Update failed:', updateResponse.status);
      console.error('   Error:', error.substring(0, 200));
    }
    
    // 7. Publish
    console.log('\n7️⃣ Publishing site...');
    try {
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
        console.log('   ✅ Site published!');
      } else {
        console.log('   ⚠️  Publish failed (rate limit?)');
      }
    } catch (error) {
      console.log('   ⚠️  Publish error:', error.message);
    }
    
    console.log('\n✅ Translation complete!');
    console.log('\n🔗 Check the German page at:');
    console.log('   https://hairqare.co/de/challenge');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

async function translateBatch(nodes) {
  const texts = nodes.map(node => node.text.text);
  const numberedTexts = texts.map((text, i) => `${i + 1}. ${text}`).join('\n');
  
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
          content: `${GERMAN_INSTRUCTIONS}\n\nTranslate each numbered item to German. Return ONLY the numbered translations.`
        },
        {
          role: 'user',
          content: numberedTexts
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    })
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }
  
  const data = await response.json();
  const translatedText = data.choices[0].message.content;
  
  // Parse numbered translations
  const translations = [];
  const lines = translatedText.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^(\d+)\.\s+(.+)$/);
    if (match) {
      const index = parseInt(match[1]) - 1;
      if (index >= 0 && index < nodes.length) {
        const node = nodes[index];
        let finalText = match[2].trim();
        
        // Preserve HTML if present
        if (node.text.html && node.text.html !== node.text.text) {
          const htmlPattern = /^(<[^>]+>)(.*?)(<\/[^>]+>)$/;
          const htmlMatch = node.text.html.match(htmlPattern);
          if (htmlMatch) {
            finalText = htmlMatch[1] + finalText + htmlMatch[3];
          }
        }
        
        translations.push({
          nodeId: node.id,
          text: finalText
        });
      }
    }
  }
  
  return translations;
}

// Run
if (require.main === module) {
  translateChallengePage();
}