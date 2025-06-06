#!/usr/bin/env node

// Rapidly complete the /challenge translation
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

async function rapidComplete() {
  console.log('\n⚡ Rapidly completing /challenge translation...\n');
  
  try {
    // 1. Quick status check
    const statusResponse = await fetch(
      `https://api.webflow.com/v2/pages/${PAGE_ID}/dom?localeId=${GERMAN_LOCALE_ID}&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const statusData = await statusResponse.json();
    const currentCount = statusData.pagination.total;
    
    console.log(`📊 Current German nodes: ${currentCount}`);
    console.log(`📊 Expected total: ~203 nodes`);
    
    if (currentCount >= 200) {
      console.log('\n✅ Translation appears complete!');
      await publishSite();
      return;
    }
    
    // 2. Get remaining untranslated nodes
    console.log('\n🔍 Finding remaining untranslated nodes...');
    
    // Get all English text nodes
    const englishNodes = [];
    let offset = 0;
    while (offset < 400) {
      const response = await fetch(
        `https://api.webflow.com/v2/pages/${PAGE_ID}/dom?limit=100&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json'
          }
        }
      );
      const data = await response.json();
      englishNodes.push(...data.nodes);
      offset += 100;
    }
    
    // Get German node IDs
    const germanNodes = [];
    offset = 0;
    while (offset < 300) {
      const response = await fetch(
        `https://api.webflow.com/v2/pages/${PAGE_ID}/dom?localeId=${GERMAN_LOCALE_ID}&limit=100&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json'
          }
        }
      );
      const data = await response.json();
      germanNodes.push(...data.nodes);
      if (data.nodes.length < 100) break;
      offset += 100;
    }
    
    const germanIds = new Set(germanNodes.map(n => n.id));
    
    // Find untranslated text nodes
    const untranslated = englishNodes
      .filter(n => 
        n.type === 'text' && 
        n.text?.text && 
        n.text.text.trim().length > 2 && 
        /[a-zA-Z]/.test(n.text.text) &&
        !germanIds.has(n.id)
      )
      .map(n => ({
        id: n.id,
        text: n.text.text,
        html: n.text.html
      }));
    
    console.log(`📊 Found ${untranslated.length} untranslated nodes`);
    
    if (untranslated.length === 0) {
      console.log('\n✅ All nodes are translated!');
      await publishSite();
      return;
    }
    
    // 3. Translate ALL remaining in parallel batches
    console.log('\n⚡ Translating all remaining nodes...');
    const batchSize = 10;
    const promises = [];
    
    for (let i = 0; i < untranslated.length; i += batchSize) {
      const batch = untranslated.slice(i, i + batchSize);
      promises.push(translateAndApplyBatch(batch, i/batchSize + 1));
      
      // Limit concurrent requests
      if (promises.length >= 3) {
        await Promise.all(promises);
        promises.length = 0;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Wait for remaining
    if (promises.length > 0) {
      await Promise.all(promises);
    }
    
    console.log('\n✅ All translations applied!');
    
    // 4. Final publish
    await publishSite();
    
    console.log('\n🎉 TRANSLATION COMPLETE!');
    console.log('🔗 Check: https://hairqare.co/de/challenge');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

async function translateAndApplyBatch(nodes, batchNum) {
  console.log(`   Batch ${batchNum}: Translating ${nodes.length} nodes...`);
  
  try {
    // Translate
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
      throw new Error(`OpenAI error: ${response.status}`);
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
    
    // Apply immediately
    if (translations.length > 0) {
      const applyResponse = await fetch(
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
      
      if (applyResponse.ok) {
        console.log(`   Batch ${batchNum}: ✅ Applied ${translations.length} translations`);
      } else {
        console.log(`   Batch ${batchNum}: ❌ Failed to apply`);
      }
    }
    
  } catch (error) {
    console.error(`   Batch ${batchNum}: ❌ Error - ${error.message}`);
  }
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
      console.log('   ✅ Published successfully!');
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
  rapidComplete();
}