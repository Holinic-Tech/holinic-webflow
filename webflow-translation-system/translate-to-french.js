#!/usr/bin/env node

// French translation script with proper locale handling
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

async function getAllNodes(pageSlug) {
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
    
    // Use locale header for proper French content
    const response = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/dom?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json',
          'X-Locale-Id': FRENCH_LOCALE_ID
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

async function updateNodesProgressively(pageId, translations) {
  console.log(`\n🔄 Applying French translations...\n`);
  
  // For Webflow API v2, we need to update each node individually
  let successCount = 0;
  
  for (const translation of translations) {
    try {
      // Update via DOM API with locale header
      const response = await fetch(
        `https://api.webflow.com/v2/pages/${pageId}/dom/nodes/${translation.nodeId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'X-Locale-Id': FRENCH_LOCALE_ID
          },
          body: JSON.stringify({
            text: translation.text
          })
        }
      );
      
      if (response.ok) {
        successCount++;
      } else {
        console.log(`   ⚠️  Failed to update node ${translation.nodeId}`);
      }
    } catch (error) {
      console.log(`   ⚠️  Error updating node: ${error.message}`);
    }
  }
  
  console.log(`   ✅ Updated ${successCount}/${translations.length} nodes`);
  return successCount > 0;
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

async function saveProgress(progress) {
  const filename = `french-translation-progress-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(progress, null, 2));
  console.log(`💾 Progress saved to ${filename}`);
}

async function main() {
  const pageSlug = process.argv[2] || 'challenge';
  
  console.log(`🇫🇷 Starting French translation for "${pageSlug}"...\n`);
  
  // Get all nodes
  const { pageId, nodes } = await getAllNodes(pageSlug);
  
  // Filter nodes that need translation
  const textNodes = nodes.filter(node => {
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
    if (!trimmedText || trimmedText.length < 3) return false;
    
    // Skip if already in French
    if (isLikelyFrench(textContent)) return false;
    
    // Skip email addresses
    if (textContent.includes('@')) return false;
    
    return true;
  });
  
  console.log(`\n📝 Found ${textNodes.length} nodes to translate\n`);
  
  if (textNodes.length === 0) {
    console.log('No nodes need translation. The page might already be in French.');
    return;
  }
  
  // Process in batches
  const BATCH_SIZE = 15;
  let totalTranslated = 0;
  let processedNodes = [];
  
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
    
    // Show some translations
    console.log('\n   Sample translations:');
    for (let j = 0; j < Math.min(3, translations.length); j++) {
      console.log(`   "${textsToTranslate[j].substring(0, 40)}..." → "${translations[j].substring(0, 40)}..."`);
    }
    
    // Prepare update data
    const updateData = batch.map((node, index) => ({
      nodeId: node.id,
      text: translations[index]
    }));
    
    // Apply translations
    const success = await updateNodesProgressively(pageId, updateData);
    
    if (success) {
      totalTranslated += batch.length;
      processedNodes = processedNodes.concat(updateData);
      
      // Save progress
      await saveProgress({
        pageId,
        pageSlug,
        totalNodes: nodes.length,
        processedNodes,
        lastUpdated: new Date().toISOString()
      });
    }
    
    // Small delay between batches
    if (i + BATCH_SIZE < textNodes.length) {
      console.log('   ⏳ Waiting 2 seconds before next batch...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log(`\n✅ Translation complete! Translated ${totalTranslated} nodes to French.`);
  
  // Publish the page
  await publishPage(pageId);
  
  console.log(`\n🎉 All done! View your French page at: https://hairqare.co/fr/${pageSlug}`);
}

main().catch(console.error);