#!/usr/bin/env node

// Complete page translation with pagination support
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

// Load translation instructions
const TRANSLATION_INSTRUCTIONS = fs.readFileSync('TRANSLATION_INSTRUCTIONS.md', 'utf8');

const LANGUAGE_CONFIG = {
  de: {
    name: 'German',
    localeId: '684230454832f0132d5f6ccf',
    instructions: `Use informal "du" throughout. Keep "Challenge" untranslated when standalone. Natural conversational German.
    "Hassle" → "Stress" (NOT "Ärger"). Keep "DIY" as is. Friendly and relatable tone.
    KEY TRANSLATIONS:
    - "14-Day Haircare Challenge" → "14-Tage-Haarpflege-Challenge"
    - "Good hair days" → "Tage mit perfektem Haar"
    - "Challenge" (standalone/capitalized) → keep as "Challenge"
    - "Hairqare" → NEVER translate (brand name)
    - "DIY" → keep as "DIY"
    CURRENCY: Convert all USD ($, US$) to EUR (€). Examples: $47 → €47, 300 $ → 300€`
  },
  fr: {
    name: 'French',
    localeId: '684683d87f6a3ae6079ec99f',
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
    CURRENCY: Convert all USD ($, US$) to EUR (€). Examples: $47 → €47, 300 $ → 300€`
  }
};

async function getPageBySlug(slug) {
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
  return data.pages.find(p => p.slug === slug);
}

async function getAllDomNodes(pageId) {
  console.log('📥 Getting ALL page content with pagination...');
  
  let allNodes = [];
  let offset = 0;
  const limit = 100;
  let hasMore = true;
  
  while (hasMore) {
    console.log(`   Fetching nodes ${offset + 1}-${offset + limit}...`);
    
    const response = await fetch(
      `https://api.webflow.com/v2/pages/${pageId}/dom?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get DOM: ${response.statusText}`);
    }
    
    const data = await response.json();
    allNodes = allNodes.concat(data.nodes);
    
    if (offset + limit >= data.pagination.total) {
      hasMore = false;
      console.log(`   Total nodes retrieved: ${data.pagination.total}`);
    } else {
      offset += limit;
    }
  }
  
  return allNodes;
}

async function translateBatch(texts, targetLang, config) {
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
    
    const instructions = `${config.instructions}

BRAND TERMS (NEVER TRANSLATE):
- "14-Day Haircare Challenge" or "14 Day Haircare Challenge" (product name)
- "Challenge" when capitalized
- "Hairqare" (brand name)
- "DIY"

Return ONLY numbered translations, nothing else.`;
    
    const numberedTexts = texts.map((text, i) => `${i + 1}. ${text}`).join('\n');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: instructions },
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

async function updatePageWithPagination(pageId, localeId, translations) {
  console.log('\n📤 Updating page (handling pagination)...');
  
  // Webflow expects all nodes in a single update
  const response = await fetch(
    `https://api.webflow.com/v2/pages/${pageId}/dom?localeId=${localeId}`,
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
  
  if (result.errors?.length > 0) {
    console.log(`⚠️  ${result.errors.length} errors occurred`);
    // Show first few errors
    result.errors.slice(0, 5).forEach(err => {
      console.log(`   - Node ${err.nodeId}: ${err.error}`);
    });
    if (result.errors.length > 5) {
      console.log(`   ... and ${result.errors.length - 5} more errors`);
    }
  } else {
    console.log('✅ Page updated successfully');
  }
  
  return result;
}

async function translateCompletePage(pageSlug, targetLang) {
  const config = LANGUAGE_CONFIG[targetLang];
  
  if (!config) {
    throw new Error(`Language not supported: ${targetLang}. Supported languages: ${Object.keys(LANGUAGE_CONFIG).join(', ')}`);
  }
  
  console.log(`\n🌐 Translating COMPLETE page "${pageSlug}" to ${config.name}...\n`);
  
  try {
    // 1. Get page
    const page = await getPageBySlug(pageSlug);
    if (!page) throw new Error(`Page not found: ${pageSlug}`);
    
    console.log(`✅ Found page: ${page.title}`);
    
    // 2. Get ALL nodes
    const allNodes = await getAllDomNodes(page.id);
    
    // Extract text nodes
    const textNodes = [];
    allNodes.forEach((node, index) => {
      if (node.type === 'text' && node.text && node.text.text) {
        let plainText = node.text.text;
        if (node.text.html && node.text.html.includes('<')) {
          plainText = node.text.html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&');
        }
        
        textNodes.push({
          index: index,
          id: node.id,
          text: plainText,
          html: node.text.html,
          hasHtml: node.text.html && node.text.html !== node.text.text
        });
      }
    });
    
    console.log(`\n✅ Found ${textNodes.length} text nodes (from ${allNodes.length} total nodes)\n`);
    
    // 3. Translate in batches
    console.log('🔄 Translating...');
    const translations = [];
    const batchSize = 10;
    
    for (let i = 0; i < textNodes.length; i += batchSize) {
      const batch = textNodes.slice(i, i + batchSize);
      const progress = Math.min(i + batchSize, textNodes.length);
      console.log(`   Progress: ${progress}/${textNodes.length} nodes...`);
      
      const batchTranslations = await translateBatch(
        batch.map(n => n.text),
        targetLang,
        config
      );
      
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
      
      if (i + batchSize < textNodes.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`\n✅ Translated ${translations.length} text nodes`);
    
    // Check for specific strings
    console.log('\n🔍 Verifying key translations:');
    const keyPhrases = [
      "Say the Challenge",
      "money-back guarantee",
      "No matter what you try"
    ];
    
    keyPhrases.forEach(phrase => {
      const found = translations.filter(t => 
        t.text.toLowerCase().includes(phrase.toLowerCase())
      );
      console.log(`   "${phrase}": ${found.length > 0 ? '✅ Included' : '❌ Check translation'}`);
    });
    
    // 4. Save backup
    const timestamp = Date.now();
    const backupFile = `complete-translation-${pageSlug}-${targetLang}-${timestamp}.json`;
    fs.writeFileSync(backupFile, JSON.stringify({
      pageId: page.id,
      pageSlug: pageSlug,
      language: targetLang,
      timestamp: new Date().toISOString(),
      totalNodes: allNodes.length,
      textNodes: textNodes.length,
      translations: translations
    }, null, 2));
    console.log(`\n💾 Backup saved: ${backupFile}`);
    
    // 5. Update page
    const updateResult = await updatePageWithPagination(page.id, config.localeId, translations);
    
    // 6. Publish
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
      console.log('⚠️  Publish failed:', err.message);
    }
    
    console.log('\n✨ Complete page translation finished!');
    console.log(`\n🔗 Check the ${config.name} version at:`,);
    console.log(`   https://hairqare.co/de/${pageSlug}\n`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Main
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🌐 Complete Page Translator (with pagination support)

Usage: node translate-complete-page.js <page-slug> <language-code>

Examples:
  node translate-complete-page.js the-haircare-challenge de
  node translate-complete-page.js pricing de
  node translate-complete-page.js about-us de

This script handles pages of ANY size by using pagination.
    `);
    process.exit(1);
  }
  
  const pageSlug = args[0];
  const targetLang = args[1] || 'de';
  
  await translateCompletePage(pageSlug, targetLang);
}

if (require.main === module) {
  main();
}