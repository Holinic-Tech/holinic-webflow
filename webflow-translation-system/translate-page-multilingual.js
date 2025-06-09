#!/usr/bin/env node

// Progressive multilingual translation - supports German and French
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

// Locale configurations
const LOCALES = {
  de: {
    id: '684230454832f0132d5f6ccf',
    name: 'German',
    instructions: `Use informal "du" throughout. Keep "Challenge" untranslated when standalone. Natural conversational German.
"Hassle" → "Stress" (NOT "Ärger"). Keep "DIY" as is. Friendly and relatable tone.
KEY TRANSLATIONS:
- "14-Day Haircare Challenge" → "14-Tage-Haarpflege-Challenge"
- "Good hair days" → "Tage mit perfektem Haar"
- "Challenge" (standalone/capitalized) → keep as "Challenge"
- "Hairqare" → NEVER translate (brand name)
- "DIY" → keep as "DIY"
CURRENCY: Convert all USD ($, US$) to EUR (€). Examples: $47 → €47, 300 $ → 300€`,
    indicators: [
      'der', 'die', 'das', 'und', 'ist', 'sind', 'haben', 'werden', 'können',
      'dein', 'deine', 'deinem', 'deinen', 'deiner', 'du', 'dich', 'dir',
      'für', 'mit', 'bei', 'auf', 'aus', 'nach', 'zu', 'über', 'unter',
      'wenn', 'aber', 'oder', 'nicht', 'kein', 'keine', 'mehr', 'schon',
      'auch', 'noch', 'nur', 'sehr', 'gut', 'alle', 'machen', 'sehen'
    ]
  },
  fr: {
    id: '684683d87f6a3ae6079ec99f',
    name: 'French',
    instructions: `Use informal "tu" throughout - like talking to a girlfriend. Keep "Challenge" untranslated when standalone.
Write in friendly, conversational French that sounds natural for women aged 25-35. Avoid formal language.
KEY TRANSLATIONS:
- "14-Day Haircare Challenge" → "Challenge capillaire de 14 jours"
- "Good hair days" → "Des cheveux parfaits tous les jours"
- "Challenge" (standalone/capitalized) → keep as "Challenge"
- "Hairqare" → NEVER translate (brand name)
- "DIY" → keep as "DIY"
- "Hassle" → "Galère" or "Prise de tête" (NOT "Tracas")
TONE: Like chatting with your best friend - warm, encouraging, relatable. Use expressions young French women actually say.
CURRENCY: Convert all USD ($, US$) to EUR (€). Examples: $47 → €47, 300 $ → 300€`,
    indicators: [
      'le', 'la', 'les', 'un', 'une', 'de', 'du', 'des', 'et', 'est', 'sont',
      'tu', 'ton', 'ta', 'tes', 'toi', 'te', 'vous', 'votre', 'vos',
      'pour', 'avec', 'dans', 'sur', 'sous', 'chez', 'par', 'sans',
      'mais', 'ou', 'donc', 'car', 'ne', 'pas', 'plus', 'très', 'bien',
      'tout', 'tous', 'faire', 'avoir', 'être'
    ]
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
let targetLang = 'de'; // Default to German
let pageSlug = 'challenge'; // Default page

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--lang' && args[i + 1]) {
    targetLang = args[i + 1];
  }
  if (args[i] === '--page' && args[i + 1]) {
    pageSlug = args[i + 1];
  }
}

// Validate language
if (!LOCALES[targetLang]) {
  console.error(`❌ Unsupported language: ${targetLang}`);
  console.log('Supported languages:', Object.keys(LOCALES).join(', '));
  process.exit(1);
}

const LOCALE_CONFIG = LOCALES[targetLang];

function isLikelyTranslated(text, lang) {
  if (!text || text.length < 10) return false;
  
  const lowerText = text.toLowerCase();
  let wordCount = 0;
  
  // Count indicator words for the language
  LOCALE_CONFIG.indicators.forEach(word => {
    if (lowerText.includes(` ${word} `) || 
        lowerText.startsWith(`${word} `) || 
        lowerText.endsWith(` ${word}`)) {
      wordCount++;
    }
  });
  
  // If we find 2+ indicator words, it's likely already translated
  return wordCount >= 2;
}

async function getAllNodes() {
  console.log(`📥 Fetching nodes for page: ${pageSlug}...\n`);
  
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
  const page = pagesData.pages.find(p => p.slug === pageSlug);
  
  if (!page) {
    throw new Error(`Page not found: ${pageSlug}`);
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
            content: `${LOCALE_CONFIG.instructions}\n\nTranslate each numbered item to ${LOCALE_CONFIG.name}. Return ONLY numbered translations.` 
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
  console.log(`\n🔄 Applying translations to ${LOCALE_CONFIG.name} locale...\n`);
  
  const updatePayload = {
    locale: LOCALE_CONFIG.id,
    fields: {}
  };
  
  for (const translation of translations) {
    // For French locale, we need to use the nodeId directly as the key
    updatePayload.fields[translation.nodeId] = {
      text: translation.text
    };
  }
  
  try {
    const response = await fetch(
      `https://api.webflow.com/v2/pages/${pageId}/update`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(updatePayload)
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      console.error(`   ❌ Update failed: ${error}`);
      return false;
    }
    
    console.log(`   ✅ Applied ${translations.length} translations`);
    return true;
    
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function saveProgress(progress) {
  const filename = `translation-progress-${targetLang}-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(progress, null, 2));
  console.log(`💾 Progress saved to ${filename}`);
}

async function loadProgress() {
  try {
    const files = fs.readdirSync('.').filter(f => 
      f.startsWith(`translation-progress-${targetLang}-`) && f.endsWith('.json')
    );
    
    if (files.length === 0) return null;
    
    // Get the most recent file
    files.sort((a, b) => b.localeCompare(a));
    const latestFile = files[0];
    
    console.log(`📂 Loading progress from ${latestFile}...`);
    const progress = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
    return progress;
  } catch (error) {
    return null;
  }
}

async function publishPage(pageId) {
  console.log(`\n🚀 Publishing page...\n`);
  
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
    
    if (!response.ok) {
      const error = await response.text();
      console.error(`   ❌ Publish failed: ${error}`);
      return false;
    }
    
    console.log(`   ✅ Page published successfully!`);
    return true;
    
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log(`🌍 Starting ${LOCALE_CONFIG.name} translation for "${pageSlug}"...\n`);
  
  // Load previous progress if any
  const previousProgress = await loadProgress();
  let processedNodeIds = new Set();
  
  if (previousProgress) {
    processedNodeIds = new Set(previousProgress.processedNodeIds || []);
    console.log(`📊 Resuming from previous progress: ${processedNodeIds.size} nodes already processed\n`);
  }
  
  // Get all nodes
  const { pageId, nodes } = await getAllNodes();
  
  // Filter nodes that need translation
  const textNodes = nodes.filter(node => {
    // Skip if already processed
    if (processedNodeIds.has(node.id)) return false;
    
    // Only process text nodes
    if (node.type !== 'text') return false;
    
    // Handle both string and object text formats
    let textContent = '';
    if (typeof node.text === 'string') {
      textContent = node.text;
    } else if (node.text?.text) {
      textContent = node.text.text;
    } else {
      return false;
    }
    
    const trimmedText = textContent.trim();
    if (!trimmedText) return false;
    
    // Skip if already translated
    if (isLikelyTranslated(textContent, targetLang)) return false;
    
    // Skip nodes that are just numbers, single characters, or very short
    if (trimmedText.length < 3) return false;
    
    // Skip email addresses
    if (textContent.includes('@')) return false;
    
    return true;
  });
  
  console.log(`\n📝 Found ${textNodes.length} nodes to translate\n`);
  
  // Process in batches
  const BATCH_SIZE = 15;
  let totalTranslated = 0;
  
  for (let i = 0; i < textNodes.length; i += BATCH_SIZE) {
    const batch = textNodes.slice(i, Math.min(i + BATCH_SIZE, textNodes.length));
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(textNodes.length / BATCH_SIZE);
    
    console.log(`\n📦 Processing batch ${batchNum}/${totalBatches} (${batch.length} nodes)...`);
    
    // Extract texts to translate
    const textsToTranslate = batch.map(node => {
      if (typeof node.text === 'string') {
        return node.text;
      } else if (node.text?.text) {
        return node.text.text;
      }
      return '';
    });
    
    // Translate batch
    const translations = await translateBatch(textsToTranslate);
    
    // Prepare update data
    const updateData = batch.map((node, index) => ({
      nodeId: node.id,
      text: translations[index]
    }));
    
    // Apply translations
    const success = await updateNodesProgressively(pageId, updateData);
    
    if (success) {
      totalTranslated += batch.length;
      
      // Mark nodes as processed
      batch.forEach(node => processedNodeIds.add(node.id));
      
      // Save progress
      await saveProgress({
        pageId,
        pageSlug,
        targetLang,
        totalNodes: nodes.length,
        processedNodeIds: Array.from(processedNodeIds),
        lastUpdated: new Date().toISOString()
      });
    }
    
    // Small delay between batches
    if (i + BATCH_SIZE < textNodes.length) {
      console.log('   ⏳ Waiting 2 seconds before next batch...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log(`\n✅ Translation complete! Translated ${totalTranslated} nodes to ${LOCALE_CONFIG.name}.`);
  
  // Publish the page
  await publishPage(pageId);
  
  console.log(`\n🎉 All done! View your ${LOCALE_CONFIG.name} page at: https://hairqare.co/${targetLang}/${pageSlug}`);
}

main().catch(console.error);