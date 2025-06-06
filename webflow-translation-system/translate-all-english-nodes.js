#!/usr/bin/env node

// Translate ALL English text across all 520 nodes
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const GERMAN_LOCALE_ID = '684230454832f0132d5f6ccf';

const GERMAN_INSTRUCTIONS = `Use informal "du" throughout. Keep "Challenge" untranslated. Natural conversational German.
"Hassle" → "Stress" (NOT "Ärger"). Keep "DIY" as is. Friendly and relatable tone.
NEVER TRANSLATE: "14-Day Haircare Challenge", "Challenge" (capitalized), "Hairqare", "DIY"`;

// Common German words to detect already translated content
const GERMAN_INDICATORS = [
  'der', 'die', 'das', 'und', 'ist', 'sind', 'haben', 'werden', 'können',
  'dein', 'deine', 'deinem', 'deinen', 'deiner', 'du', 'dich', 'dir',
  'für', 'mit', 'bei', 'auf', 'aus', 'nach', 'zu', 'über', 'unter',
  'wenn', 'aber', 'oder', 'nicht', 'kein', 'keine', 'mehr', 'schon',
  'auch', 'noch', 'nur', 'sehr', 'gut', 'alle', 'machen', 'sehen'
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

function isLikelyEnglish(text) {
  if (!text || text.length < 5) return false;
  
  // Skip very short text or numbers/symbols only
  if (!/[a-zA-Z]{3,}/.test(text)) return false;
  
  // Skip if it's already German
  if (isLikelyGerman(text)) return false;
  
  // Common English indicators
  const englishIndicators = ['the', 'is', 'are', 'have', 'has', 'with', 'for', 'and', 'you', 'your'];
  const lowerText = text.toLowerCase();
  
  return englishIndicators.some(word => 
    lowerText.includes(` ${word} `) || 
    lowerText.startsWith(`${word} `) || 
    lowerText.endsWith(` ${word}`)
  );
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
  const page = pagesData.pages.find(p => p.slug === 'the-haircare-challenge');
  
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

async function translateAllEnglishNodes() {
  console.log('\n🌐 Translating ALL English text to German...\n');
  
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
    
    // 3. Show sample of what we're translating
    console.log('\n📝 Sample texts to translate:');
    nodesToTranslate.slice(0, 5).forEach(node => {
      console.log(`   "${node.text.substring(0, 50)}..."`);
    });
    
    // 4. Translate in batches
    console.log('\n🔄 Translating English content...');
    const translations = [];
    const batchSize = 10;
    
    for (let i = 0; i < nodesToTranslate.length; i += batchSize) {
      const batch = nodesToTranslate.slice(i, i + batchSize);
      const progress = Math.min(i + batchSize, nodesToTranslate.length);
      console.log(`   Progress: ${progress}/${nodesToTranslate.length} nodes...`);
      
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
        
        translations.push({
          nodeId: node.id,
          text: finalText
        });
      });
      
      if (i + batchSize < nodesToTranslate.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`\n✅ Translated ${translations.length} nodes`);
    
    // 5. Save complete backup
    const timestamp = Date.now();
    const backupFile = `complete-english-translation-de-${timestamp}.json`;
    fs.writeFileSync(backupFile, JSON.stringify({
      pageId: pageId,
      timestamp: new Date().toISOString(),
      totalNodes: nodes.length,
      translatedNodes: translations.length,
      skippedGerman: skippedGerman,
      skippedOther: skippedOther,
      translations: translations
    }, null, 2));
    console.log(`\n💾 Complete backup saved: ${backupFile}`);
    
    // 6. Update page
    console.log('\n📤 Updating all English nodes...');
    const updateResponse = await fetch(
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
    
    const result = await updateResponse.json();
    
    if (result.errors?.length > 0) {
      console.log(`⚠️  ${result.errors.length} errors occurred`);
      result.errors.slice(0, 5).forEach(err => {
        console.log(`   - ${err.nodeId}: ${err.error}`);
      });
    } else {
      console.log('✅ All English nodes updated successfully');
    }
    
    // 7. Publish
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
            publishTargets: ['live']
          })
        }
      );
      console.log('✅ Site published');
    } catch (err) {
      console.log('⚠️  Publish warning:', err.message);
    }
    
    console.log('\n✨ Complete translation finished!');
    console.log('\n📊 Summary:');
    console.log(`   - Checked all ${nodes.length} nodes`);
    console.log(`   - Translated ${translations.length} English text nodes`);
    console.log(`   - Skipped ${skippedGerman} already German nodes`);
    console.log(`   - Skipped ${skippedOther} non-text nodes`);
    console.log('\n🔗 Check the fully translated page:');
    console.log('   https://hairqare.co/de/the-haircare-challenge\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Run
if (require.main === module) {
  translateAllEnglishNodes();
}