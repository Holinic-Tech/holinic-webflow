#!/usr/bin/env node

// Progressive translation - saves and applies as it goes to avoid timeouts
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf';
const FRENCH_LOCALE_ID = '684683d87f6a3ae6079ec99f';

const GERMAN_INSTRUCTIONS = `Use informal "du" throughout. Keep "Challenge" untranslated when standalone. Natural conversational German.
"Hassle" → "Stress" (NOT "Ärger"). Keep "DIY" as is. Friendly and relatable tone.
KEY TRANSLATIONS:
- "14-Day Haircare Challenge" → "14-Tage-Haarpflege-Challenge"
- "Good hair days" → "Tage mit perfektem Haar"
- "Challenge" (standalone/capitalized) → keep as "Challenge"
- "Hairqare" → NEVER translate (brand name)
- "DIY" → keep as "DIY"
CURRENCY: Convert all USD ($, US$) to EUR (€). Examples: $47 → €47, 300 $ → 300€`;

const FRENCH_INSTRUCTIONS = `Use informal "tu" throughout - like talking to a girlfriend. Keep "Challenge" untranslated when standalone.
Write in friendly, conversational French that sounds natural for women aged 25-35. Avoid formal language.
KEY TRANSLATIONS:
- "14-Day Haircare Challenge" → "Challenge capillaire de 14 jours"
- "Good hair days" → "Des cheveux parfaits tous les jours"
- "Challenge" (standalone/capitalized) → keep as "Challenge"
- "Hairqare" → NEVER translate (brand name)
- "DIY" → keep as "DIY"
- "Hassle" → "Galère" or "Prise de tête" (NOT "Tracas")
TONE: Like chatting with your best friend - warm, encouraging, relatable. Use expressions young French women actually say.
CURRENCY: Convert all USD ($, US$) to EUR (€). Examples: $47 → €47, 300 $ → 300€`;

// Common German words to detect already translated content
const GERMAN_INDICATORS = [
  'der', 'die', 'das', 'und', 'ist', 'sind', 'haben', 'werden', 'können',
  'dein', 'deine', 'deinem', 'deinen', 'deiner', 'du', 'dich', 'dir',
  'für', 'mit', 'bei', 'auf', 'aus', 'nach', 'zu', 'über', 'unter',
  'wenn', 'aber', 'oder', 'nicht', 'kein', 'keine', 'mehr', 'schon',
  'auch', 'noch', 'nur', 'sehr', 'gut', 'alle', 'machen', 'sehen'
];

// Common French words to detect already translated content
const FRENCH_INDICATORS = [
  'le', 'la', 'les', 'un', 'une', 'de', 'du', 'des', 'et', 'est', 'sont',
  'tu', 'ton', 'ta', 'tes', 'toi', 'te', 'vous', 'votre', 'vos',
  'pour', 'avec', 'dans', 'sur', 'sous', 'chez', 'par', 'sans',
  'mais', 'ou', 'donc', 'car', 'ne', 'pas', 'plus', 'très', 'bien',
  'tout', 'tous', 'faire', 'avoir', 'être'
];

function isLikelyGerman(text) {
  if (!text || text.length < 10) return false;
  
  const lowerText = text.toLowerCase();
  let germanWordCount = 0;
  
  // Count German indicator words
  GERMAN_INDICATORS.forEach(word => {
    if (lowerText.includes(` ${word} `) || 
        lowerText.startsWith(`${word} `) || 
        lowerText.endsWith(` ${word}`)) {
      germanWordCount++;
    }
  });
  
  // If we find 2+ German words in the text, it's likely already translated
  return germanWordCount >= 2;
}

function isLikelyFrench(text) {
  if (!text || text.length < 10) return false;
  
  const lowerText = text.toLowerCase();
  let frenchWordCount = 0;
  
  // Count French indicator words
  FRENCH_INDICATORS.forEach(word => {
    if (lowerText.includes(` ${word} `) || 
        lowerText.startsWith(`${word} `) || 
        lowerText.endsWith(` ${word}`)) {
      frenchWordCount++;
    }
  });
  
  // If we find 2+ French words in the text, it's likely already translated
  return frenchWordCount >= 2;
}

async function getAllNodes() {
  console.log('📥 Fetching ALL 520 nodes...\n');
  
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
  
  let allNodes = [];
  let offset = 0;
  const limit = 100;
  
  while (true) {
    console.log(`   Fetching nodes ${offset + 1}-${Math.min(offset + limit, 520)}...`);
    
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
    allNodes = allNodes.concat(data.nodes);
    
    if (offset + limit >= data.pagination.total) break;
    offset += limit;
  }
  
  console.log(`\n✅ Retrieved all ${allNodes.length} nodes`);
  return { pageId: page.id, nodes: allNodes };
}

async function translateBatch(texts) {
  try {
    const headers = {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    };
    
    if (process.env.OPENAI_ORG_ID) {
      headers['OpenAI-Organization'] = process.env.OPENAI_ORG_ID;
    }
    if (process.env.OPENAI_PROJECT_ID) {
      headers['OpenAI-Project'] = process.env.OPENAI_PROJECT_ID;
    }
    
    const numberedTexts = texts.map((text, i) => `${i + 1}. ${text}`).join('\n');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { 
            role: 'system', 
            content: `${GERMAN_INSTRUCTIONS}\n\nTranslate each numbered item to German. Return ONLY numbered translations.` 
          },
          { role: 'user', content: numberedTexts }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })
    });
    
    const data = await response.json();
    const translatedText = data.choices[0].message.content;
    
    const translations = [];
    const lines = translatedText.split('\n');
    for (const line of lines) {
      const match = line.match(/^\d+\.\s+(.+)$/);
      if (match) {
        translations.push(match[1]);
      }
    }
    
    return translations.length === texts.length ? translations : texts;
    
  } catch (error) {
    console.error('Translation error:', error);
    return texts;
  }
}

async function updateNodesProgressively(pageId, translations) {
  const response = await fetch(
    `https://api.webflow.com/v2/pages/${pageId}/dom?localeId=${GERMAN_LOCALE_ID}`,
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
  
  const result = await response.json();
  return result;
}

async function translateAllEnglishProgressively() {
  console.log('\n🌐 Progressive Translation - ALL English text to German...\n');
  
  try {
    // 1. Get all nodes
    const { pageId, nodes } = await getAllNodes();
    
    // 2. Extract text nodes that need translation
    console.log('\n🔍 Analyzing text nodes...');
    const nodesToTranslate = [];
    let skippedGerman = 0;
    let skippedOther = 0;
    
    nodes.forEach(node => {
      if (node.type === 'text' && node.text && node.text.text) {
        const plainText = node.text.html ? 
          node.text.html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&') : 
          node.text.text;
        
        // Skip if already German
        if (isLikelyGerman(plainText)) {
          skippedGerman++;
          return;
        }
        
        // Skip if too short or no real text
        if (!plainText || plainText.trim().length < 3 || !/[a-zA-Z]/.test(plainText)) {
          skippedOther++;
          return;
        }
        
        nodesToTranslate.push({
          id: node.id,
          text: plainText,
          html: node.text.html,
          hasHtml: node.text.html && node.text.html !== node.text.text
        });
      }
    });
    
    console.log(`   Total text nodes: ${nodes.filter(n => n.type === 'text').length}`);
    console.log(`   Already German: ${skippedGerman}`);
    console.log(`   Too short/numeric: ${skippedOther}`);
    console.log(`   To translate: ${nodesToTranslate.length}`);
    
    if (nodesToTranslate.length === 0) {
      console.log('\n✅ All text appears to be already translated!');
      return;
    }
    
    // 3. Process in smaller chunks and save/apply progressively
    console.log('\n🔄 Translating and applying progressively...');
    const chunkSize = 50; // Process 50 nodes at a time
    const batchSize = 10; // Translate 10 at a time
    let totalTranslated = 0;
    
    for (let chunkStart = 0; chunkStart < nodesToTranslate.length; chunkStart += chunkSize) {
      const chunk = nodesToTranslate.slice(chunkStart, Math.min(chunkStart + chunkSize, nodesToTranslate.length));
      const chunkTranslations = [];
      
      console.log(`\n📦 Processing chunk ${Math.floor(chunkStart/chunkSize) + 1}/${Math.ceil(nodesToTranslate.length/chunkSize)}...`);
      
      // Translate this chunk
      for (let i = 0; i < chunk.length; i += batchSize) {
        const batch = chunk.slice(i, i + batchSize);
        const progress = chunkStart + i + batch.length;
        console.log(`   Translating: ${progress}/${nodesToTranslate.length} nodes...`);
        
        const batchTranslations = await translateBatch(batch.map(n => n.text));
        
        batch.forEach((node, j) => {
          const translatedText = batchTranslations[j];
          let finalText = translatedText;
          
          if (node.hasHtml && node.html) {
            const htmlPattern = /^(<[^>]+>)(.*?)(<\/[^>]+>)$/;
            const match = node.html.match(htmlPattern);
            if (match) {
              finalText = match[1] + translatedText + match[3];
            }
          }
          
          chunkTranslations.push({
            nodeId: node.id,
            text: finalText
          });
        });
        
        if (i + batchSize < chunk.length) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
      // Apply this chunk's translations
      console.log(`   Applying ${chunkTranslations.length} translations...`);
      const updateResult = await updateNodesProgressively(pageId, chunkTranslations);
      
      if (updateResult.errors?.length > 0) {
        console.log(`   ⚠️  ${updateResult.errors.length} errors in this chunk`);
      } else {
        console.log(`   ✅ Chunk applied successfully`);
      }
      
      totalTranslated += chunkTranslations.length;
      
      // Save progress
      const progressFile = `translation-progress-${Date.now()}.json`;
      fs.writeFileSync(progressFile, JSON.stringify({
        pageId: pageId,
        timestamp: new Date().toISOString(),
        totalNodes: nodesToTranslate.length,
        translatedSoFar: totalTranslated,
        lastChunk: chunkTranslations
      }, null, 2));
      console.log(`   💾 Progress saved: ${progressFile}`);
      
      // Small delay between chunks
      if (chunkStart + chunkSize < nodesToTranslate.length) {
        console.log(`   ⏳ Pausing before next chunk...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(`\n✅ Translated ${totalTranslated} nodes total`);
    
    // 4. Publish
    console.log('\n📢 Publishing...');
    try {
      await fetch(
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
      console.log('✅ Site published');
    } catch (err) {
      console.log('⚠️  Publish warning:', err.message);
    }
    
    console.log('\n✨ Progressive translation complete!');
    console.log('\n📊 Summary:');
    console.log(`   - Checked all ${nodes.length} nodes`);
    console.log(`   - Translated ${totalTranslated} English text nodes`);
    console.log(`   - Skipped ${skippedGerman} already German nodes`);
    console.log(`   - Skipped ${skippedOther} non-text nodes`);
    console.log('\n🔗 Check the fully translated page:');
    console.log('   https://hairqare.co/de/challenge\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Run
if (require.main === module) {
  translateAllEnglishProgressively();
}