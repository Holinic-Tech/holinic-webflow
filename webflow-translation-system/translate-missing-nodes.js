#!/usr/bin/env node

// Translate only the missing nodes (101+)
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

async function getMissingNodes() {
  console.log('\n🔍 Getting missing nodes (101-520)...\n');
  
  try {
    // Get the page
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
    
    console.log(`Page ID: ${page.id}`);
    
    // Get nodes starting from offset 100
    let missingNodes = [];
    let offset = 100; // Start from node 101
    const limit = 100;
    let hasMore = true;
    
    while (hasMore) {
      console.log(`Fetching nodes ${offset + 1}-${offset + limit}...`);
      
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
        throw new Error(`Failed to get DOM: ${response.statusText}`);
      }
      
      const data = await response.json();
      missingNodes = missingNodes.concat(data.nodes);
      
      console.log(`   Retrieved ${data.nodes.length} nodes`);
      
      if (offset + limit >= data.pagination.total) {
        hasMore = false;
        console.log(`   Total nodes in page: ${data.pagination.total}`);
      } else {
        offset += limit;
      }
    }
    
    console.log(`\n✅ Retrieved ${missingNodes.length} missing nodes`);
    
    // Extract text nodes
    const textNodes = [];
    missingNodes.forEach(node => {
      if (node.type === 'text' && node.text && node.text.text) {
        let plainText = node.text.text;
        if (node.text.html && node.text.html.includes('<')) {
          plainText = node.text.html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&');
        }
        
        textNodes.push({
          id: node.id,
          text: plainText,
          html: node.text.html,
          hasHtml: node.text.html && node.text.html !== node.text.text
        });
      }
    });
    
    console.log(`Text nodes to translate: ${textNodes.length}`);
    
    // Show which key strings we're translating
    console.log('\n🔍 Key strings found:');
    const keyStrings = [
      "Say the Challenge",
      "money-back guarantee",
      "No matter what you try"
    ];
    
    keyStrings.forEach(key => {
      const found = textNodes.filter(n => n.text.toLowerCase().includes(key.toLowerCase()));
      if (found.length > 0) {
        console.log(`   ✅ "${key}" - Found ${found.length} instance(s)`);
      }
    });
    
    return { pageId: page.id, textNodes };
    
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
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
            content: `${GERMAN_INSTRUCTIONS}\n\nTranslate each numbered item. Return ONLY numbered translations.` 
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

async function translateMissingNodes() {
  console.log('\n🌐 Translating ONLY missing nodes to German...\n');
  
  try {
    // 1. Get missing nodes
    const { pageId, textNodes } = await getMissingNodes();
    
    if (textNodes.length === 0) {
      console.log('No text nodes found to translate.');
      return;
    }
    
    // 2. Translate in batches
    console.log('\n🔄 Translating missing content...');
    const translations = [];
    const batchSize = 10;
    
    for (let i = 0; i < textNodes.length; i += batchSize) {
      const batch = textNodes.slice(i, i + batchSize);
      const progress = Math.min(i + batchSize, textNodes.length);
      console.log(`   Progress: ${progress}/${textNodes.length} nodes...`);
      
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
      
      // Small delay between batches
      if (i + batchSize < textNodes.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`\n✅ Translated ${translations.length} missing text nodes`);
    
    // 3. Show sample translations
    console.log('\n📝 Sample translations:');
    const samples = translations.slice(0, 5);
    samples.forEach(t => {
      const preview = t.text.replace(/<[^>]*>/g, '').substring(0, 60);
      console.log(`   "${preview}..."`);
    });
    
    // 4. Save backup
    const timestamp = Date.now();
    const backupFile = `missing-nodes-translation-de-${timestamp}.json`;
    fs.writeFileSync(backupFile, JSON.stringify({
      pageId: pageId,
      timestamp: new Date().toISOString(),
      nodeCount: translations.length,
      translations: translations
    }, null, 2));
    console.log(`\n💾 Backup saved: ${backupFile}`);
    
    // 5. Update page
    console.log('\n📤 Updating missing nodes...');
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
      console.log('✅ Missing nodes updated successfully');
    }
    
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
      console.log('⚠️  Publish failed');
    }
    
    console.log('\n✨ Missing translations complete!');
    console.log('The previously untranslated content should now be in German.');
    console.log('\n🔗 Check: https://hairqare.co/de/the-haircare-challenge\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Run
if (require.main === module) {
  translateMissingNodes();
}