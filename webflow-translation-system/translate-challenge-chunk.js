#!/usr/bin/env node

// Translate /challenge page in manageable chunks
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

const CHUNK_SIZE = 30; // Process 30 nodes per run

async function translateNextChunk() {
  console.log('\n🔄 Translating next chunk for /challenge page...\n');
  
  try {
    // 1. Get all English nodes
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
    
    // 2. Get current German nodes
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
    
    console.log(`📊 Progress: ${translatedIds.size}/${englishTextNodes.length} nodes translated`);
    
    // 3. Find nodes that still need translation
    const nodesToTranslate = englishTextNodes.filter(n => !translatedIds.has(n.id));
    
    if (nodesToTranslate.length === 0) {
      console.log('\n✅ All nodes are translated!');
      await publishSite();
      console.log('\n🎉 Translation complete!');
      console.log('🔗 Check: https://hairqare.co/de/challenge');
      return true; // Done
    }
    
    // 4. Take next chunk
    const chunk = nodesToTranslate.slice(0, CHUNK_SIZE);
    console.log(`\n📦 Processing ${chunk.length} nodes...`);
    
    // 5. Translate in batches of 10
    const allTranslations = [];
    for (let i = 0; i < chunk.length; i += 10) {
      const batch = chunk.slice(i, i + 10);
      console.log(`   Batch ${Math.floor(i/10) + 1}/${Math.ceil(chunk.length/10)}...`);
      
      try {
        const translations = await translateBatch(batch);
        allTranslations.push(...translations);
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
      }
      
      if (i + 10 < chunk.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // 6. Apply translations
    if (allTranslations.length > 0) {
      console.log(`\n📝 Applying ${allTranslations.length} translations...`);
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
            nodes: allTranslations
          })
        }
      );
      
      if (response.ok) {
        console.log('   ✅ Applied successfully');
      } else {
        console.error('   ❌ Failed to apply');
      }
    }
    
    // 7. Save progress
    const progressFile = `challenge-progress-${Date.now()}.json`;
    fs.writeFileSync(progressFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      totalNodes: englishTextNodes.length,
      translatedSoFar: translatedIds.size + allTranslations.length,
      remainingNodes: nodesToTranslate.length - chunk.length
    }, null, 2));
    
    console.log(`\n💾 Progress saved to ${progressFile}`);
    console.log(`📊 New total: ${translatedIds.size + allTranslations.length}/${englishTextNodes.length}`);
    console.log(`⏳ Remaining: ${nodesToTranslate.length - chunk.length} nodes`);
    
    if (nodesToTranslate.length > chunk.length) {
      console.log('\n🔄 Run this script again to continue translation');
    }
    
    return false; // Not done yet
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return false;
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
    throw new Error(`OpenAI API error: ${response.status}`);
  }
  
  const data = await response.json();
  const translatedText = data.choices[0].message.content;
  
  const translations = [];
  const lines = translatedText.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^(\d+)\.\s+(.+)$/);
    if (match) {
      const index = parseInt(match[1]) - 1;
      if (index >= 0 && index < nodes.length) {
        const node = nodes[index];
        let finalText = match[2].trim();
        
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

async function publishSite() {
  console.log('\n📢 Publishing site...');
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
      console.log('   ✅ Published!');
    } else {
      console.log('   ⚠️  Publish failed (rate limit?)');
    }
  } catch (error) {
    console.log('   ⚠️  Publish error:', error.message);
  }
}

// Run continuously until done
async function runUntilComplete() {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    attempts++;
    console.log(`\n=== Attempt ${attempts}/${maxAttempts} ===`);
    
    const isDone = await translateNextChunk();
    
    if (isDone) {
      console.log('\n🎉 TRANSLATION COMPLETE!');
      break;
    }
    
    // Wait before next chunk
    console.log('\n⏳ Waiting 2 seconds before next chunk...');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  if (attempts >= maxAttempts) {
    console.log('\n⚠️  Reached max attempts. Run script again to continue.');
  }
}

// Run
if (require.main === module) {
  runUntilComplete();
}