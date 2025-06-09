#!/usr/bin/env node

// Progressive French translation - based on working German script
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const FRENCH_LOCALE_ID = '684683d87f6a3ae6079ec99f';

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

// Common French words to detect already translated content
const FRENCH_INDICATORS = [
  'le', 'la', 'les', 'un', 'une', 'de', 'du', 'des', 'et', 'est', 'sont',
  'tu', 'ton', 'ta', 'tes', 'toi', 'te', 'vous', 'votre', 'vos',
  'pour', 'avec', 'dans', 'sur', 'sous', 'chez', 'par', 'sans',
  'mais', 'ou', 'donc', 'car', 'ne', 'pas', 'plus', 'très', 'bien',
  'tout', 'tous', 'faire', 'avoir', 'être'
];

function isLikelyFrench(text) {
  if (!text || text.length < 10) return false;
  
  const lowerText = text.toLowerCase();
  let frenchWordCount = 0;
  
  FRENCH_INDICATORS.forEach(word => {
    if (lowerText.includes(` ${word} `) || 
        lowerText.startsWith(`${word} `) || 
        lowerText.endsWith(` ${word}`)) {
      frenchWordCount++;
    }
  });
  
  return frenchWordCount >= 2;
}

async function getAllNodes() {
  console.log('📥 Fetching all nodes...\n');
  
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
  // Get page slug from command line argument or default to 'challenge'
  const targetSlug = process.argv[2] || 'challenge';
  const page = pagesData.pages.find(p => p.slug === targetSlug);
  
  if (!page) {
    throw new Error(`Page not found: ${targetSlug}`);
  }
  
  let allNodes = [];
  let offset = 0;
  const limit = 100;
  
  while (true) {
    console.log(`   Fetching nodes ${offset + 1}-${offset + limit}...`);
    
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
    
    const numberedTexts = texts.map((text, i) => `${i + 1}. ${text}`).join('\n');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { 
            role: 'system', 
            content: `${FRENCH_INSTRUCTIONS}\n\nTranslate each numbered item to French. Return ONLY numbered translations.` 
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

async function updateNodesInDom(pageId, translations) {
  const response = await fetch(
    `https://api.webflow.com/v2/pages/${pageId}/dom?localeId=${FRENCH_LOCALE_ID}`,
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

async function translateAllFrenchProgressively() {
  const pageSlug = process.argv[2] || 'challenge';
  console.log(`\n🇫🇷 Progressive Translation - ALL English text to French for "${pageSlug}"...\n`);
  
  try {
    // 1. Get all nodes
    const { pageId, nodes } = await getAllNodes();
    
    // 2. Extract text nodes that need translation
    console.log('\n🔍 Analyzing text nodes...');
    const nodesToTranslate = [];
    let skippedFrench = 0;
    let skippedOther = 0;
    
    nodes.forEach(node => {
      if (node.type === 'text' && node.text && node.text.text) {
        const plainText = node.text.html ? 
          node.text.html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&') : 
          node.text.text;
        
        // Skip if already French
        if (isLikelyFrench(plainText)) {
          skippedFrench++;
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
    console.log(`   To translate: ${nodesToTranslate.length}`);
    console.log(`   Already French: ${skippedFrench}`);
    console.log(`   Skipped (too short/no text): ${skippedOther}\n`);
    
    if (nodesToTranslate.length === 0) {
      console.log('✅ No nodes need translation!');
      return;
    }
    
    // 3. Load previous progress if exists
    const progressFile = './french-translation-progress.json';
    let processedIds = new Set();
    
    if (fs.existsSync(progressFile)) {
      const progress = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
      processedIds = new Set(progress.processedIds || []);
      console.log(`📂 Loaded progress: ${processedIds.size} nodes already processed\n`);
    }
    
    // 4. Process in batches
    const BATCH_SIZE = 20;
    let totalTranslated = 0;
    let totalBatches = Math.ceil(nodesToTranslate.length / BATCH_SIZE);
    
    for (let i = 0; i < nodesToTranslate.length; i += BATCH_SIZE) {
      const batch = nodesToTranslate.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      
      // Skip if all nodes in batch are already processed
      const unprocessed = batch.filter(node => !processedIds.has(node.id));
      if (unprocessed.length === 0) {
        console.log(`⏭️  Batch ${batchNum}/${totalBatches}: Already processed, skipping...`);
        continue;
      }
      
      console.log(`\n📦 Processing batch ${batchNum}/${totalBatches} (${unprocessed.length} nodes)...`);
      
      // Translate the batch
      const textsToTranslate = unprocessed.map(node => node.text);
      const translations = await translateBatch(textsToTranslate);
      
      // Show sample translations
      console.log('\n   Sample translations:');
      for (let j = 0; j < Math.min(3, translations.length); j++) {
        console.log(`   "${textsToTranslate[j].substring(0, 40)}..." → "${translations[j].substring(0, 40)}..."`);
      }
      
      // Prepare update data
      const updateNodes = unprocessed.map((node, index) => {
        const translatedText = translations[index];
        let finalText = translatedText;
        
        // If node had HTML, preserve the HTML structure
        if (node.hasHtml && node.html) {
          const htmlPattern = /^(<[^>]+>)(.*?)(<\/[^>]+>)$/;
          const match = node.html.match(htmlPattern);
          if (match) {
            finalText = match[1] + translatedText + match[3];
          } else {
            // For more complex HTML, try to replace just the text content
            finalText = node.html.replace(node.text, translatedText);
          }
        }
        
        return {
          nodeId: node.id,
          text: finalText
        };
      });
      
      // Apply translations
      console.log('\n   Applying translations...');
      const result = await updateNodesInDom(pageId, updateNodes);
      
      if (result.errors && result.errors.length > 0) {
        console.log(`   ⚠️  Some errors occurred:`, result.errors);
      } else {
        console.log(`   ✅ Successfully updated ${updateNodes.length} nodes`);
        totalTranslated += updateNodes.length;
        
        // Mark as processed
        unprocessed.forEach(node => processedIds.add(node.id));
        
        // Save progress
        fs.writeFileSync(progressFile, JSON.stringify({
          processedIds: Array.from(processedIds),
          totalProcessed: processedIds.size,
          lastUpdated: new Date().toISOString()
        }, null, 2));
      }
      
      // Small delay between batches
      if (i + BATCH_SIZE < nodesToTranslate.length) {
        console.log('   ⏳ Waiting 2 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`\n✅ Translation complete! Translated ${totalTranslated} nodes.`);
    
    // 5. Publish the site
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
      const pageSlug = process.argv[2] || 'challenge';
      console.log(`\n🎉 View your French page at: https://hairqare.co/fr/${pageSlug}`);
    } else {
      console.log('⚠️  Publishing failed:', await publishResponse.text());
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the translation
translateAllFrenchProgressively();