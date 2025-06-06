#!/usr/bin/env node

// Complete the translation of /challenge page - run until done
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const PAGE_ID = '672de5d83bf4c27aff31c9a3'; // challenge page
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

async function completeTranslation() {
  console.log('\n🚀 Completing translation of /challenge page...\n');
  
  try {
    // 1. Get all English nodes
    console.log('1️⃣ Fetching all English content...');
    const englishNodes = [];
    let offset = 0;
    const limit = 100;
    
    while (true) {
      const response = await fetch(
        `https://api.webflow.com/v2/pages/${PAGE_ID}/dom?limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      englishNodes.push(...data.nodes);
      
      if (data.nodes.length < limit) break;
      offset += limit;
    }
    
    // Filter for text nodes
    const englishTextNodes = englishNodes
      .filter(n => n.type === 'text' && n.text?.text && n.text.text.trim().length > 2 && /[a-zA-Z]/.test(n.text.text))
      .map(n => ({
        id: n.id,
        text: n.text.text,
        html: n.text.html
      }));
    
    console.log(`   Total English text nodes: ${englishTextNodes.length}`);
    
    // 2. Get current German nodes to see what's already done
    console.log('\n2️⃣ Checking current progress...');
    const germanResponse = await fetch(
      `https://api.webflow.com/v2/pages/${PAGE_ID}/dom?localeId=${GERMAN_LOCALE_ID}&limit=300`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const germanData = await germanResponse.json();
    const translatedIds = new Set(germanData.nodes.filter(n => n.type === 'text' && n.text?.text).map(n => n.id));
    
    console.log(`   Already translated: ${translatedIds.size} nodes`);
    
    // 3. Find nodes that still need translation
    const nodesToTranslate = englishTextNodes.filter(n => !translatedIds.has(n.id));
    console.log(`   Still need to translate: ${nodesToTranslate.length} nodes`);
    
    if (nodesToTranslate.length === 0) {
      console.log('\n✅ All nodes are already translated!');
      await publishSite();
      return;
    }
    
    // 4. Translate remaining nodes in batches
    console.log('\n3️⃣ Translating remaining nodes...');
    const batchSize = 10;
    const allTranslations = [];
    
    for (let i = 0; i < nodesToTranslate.length; i += batchSize) {
      const batch = nodesToTranslate.slice(i, i + batchSize);
      const progress = ((i + batch.length) / nodesToTranslate.length * 100).toFixed(1);
      console.log(`   Batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(nodesToTranslate.length/batchSize)} (${progress}%)...`);
      
      try {
        const translations = await translateBatch(batch);
        allTranslations.push(...translations);
        
        // Apply this batch immediately
        if (translations.length > 0) {
          await applyTranslations(translations);
        }
      } catch (error) {
        console.error(`   ❌ Batch error: ${error.message}`);
      }
      
      // Small delay between batches
      if (i + batchSize < nodesToTranslate.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(`\n✅ Translated ${allTranslations.length} nodes`);
    
    // 5. Save final backup
    const backupFile = `complete-challenge-translation-${Date.now()}.json`;
    fs.writeFileSync(backupFile, JSON.stringify({
      pageId: PAGE_ID,
      timestamp: new Date().toISOString(),
      totalTranslated: translatedIds.size + allTranslations.length,
      newTranslations: allTranslations
    }, null, 2));
    console.log(`\n💾 Backup saved to ${backupFile}`);
    
    // 6. Publish
    await publishSite();
    
    console.log('\n✅ Translation complete!');
    console.log(`   Total nodes translated: ${translatedIds.size + allTranslations.length}`);
    console.log('\n🔗 Check the German page at:');
    console.log('   https://hairqare.co/de/challenge');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

async function translateBatch(nodes) {
  const texts = nodes.map(n => n.text);
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
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }
  
  const data = await response.json();
  const translatedText = data.choices[0].message.content;
  
  // Parse translations
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
        if (node.html && node.html !== node.text) {
          const htmlPattern = /^(<[^>]+>)(.*?)(<\/[^>]+>)$/;
          const htmlMatch = node.html.match(htmlPattern);
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

async function applyTranslations(translations) {
  const response = await fetch(
    `https://api.webflow.com/v2/pages/${PAGE_ID}/dom?localeId=${GERMAN_LOCALE_ID}`,
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
  
  if (!response.ok) {
    const error = await response.text();
    console.error(`Failed to apply translations: ${error}`);
  }
}

async function publishSite() {
  console.log('\n4️⃣ Publishing site...');
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
          publishToWebflowSubdomain: true
        })
      }
    );
    
    if (response.ok) {
      console.log('   ✅ Site published!');
    } else {
      const error = await response.text();
      console.log('   ⚠️  Publish failed:', error.substring(0, 100));
    }
  } catch (error) {
    console.log('   ⚠️  Publish error:', error.message);
  }
}

// Run
if (require.main === module) {
  completeTranslation();
}