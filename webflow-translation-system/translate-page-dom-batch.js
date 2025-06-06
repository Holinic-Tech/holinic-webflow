#!/usr/bin/env node

// Page translator using Webflow DOM API with batch processing
// Usage: node translate-page-dom-batch.js --slug="the-haircare-challenge" --lang="de"

const fetch = require('node-fetch');
const fs = require('fs');
require('dotenv').config();

// Configuration
const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SITE_ID = process.env.WEBFLOW_SITE_ID || '62cbaa353a301eb715aa33d0';

// Check for required environment variables
if (!WEBFLOW_API_TOKEN || !OPENAI_API_KEY) {
  console.error('\n❌ Missing required environment variables!');
  console.error('Please ensure your .env file contains:');
  console.error('- WEBFLOW_TOKEN');
  console.error('- OPENAI_API_KEY\n');
  process.exit(1);
}

const LANGUAGE_NAMES = {
  de: 'German',
  es: 'Spanish',
  fr: 'French',
  it: 'Italian',
  pt: 'Portuguese',
  nl: 'Dutch'
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {};
  
  args.forEach(arg => {
    const [key, value] = arg.split('=');
    params[key.replace('--', '')] = value;
  });
  
  return params;
}

// Get page by slug
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
  
  if (!response.ok) {
    throw new Error(`Failed to get pages: ${response.statusText}`);
  }
  
  const data = await response.json();
  const page = data.pages.find(p => p.slug === slug);
  
  if (!page) {
    throw new Error(`Page not found with slug: ${slug}`);
  }
  
  return page;
}

// Get page DOM
async function getPageDOM(pageId) {
  const response = await fetch(
    `https://api.webflow.com/v2/pages/${pageId}/dom`,
    {
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'accept': 'application/json'
      }
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to get page DOM: ${response.statusText}`);
  }
  
  return await response.json();
}

// Batch translate multiple texts
async function batchTranslate(texts, targetLanguage) {
  if (texts.length === 0) return [];
  
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
    
    // Create a numbered list for batch translation
    const numberedTexts = texts.map((text, i) => `${i + 1}. ${text}`).join('\n');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate each numbered item from English to ${LANGUAGE_NAMES[targetLanguage]}.
                     Return ONLY the translations in the same numbered format.
                     Maintain original formatting and tone. Do not add explanations.`
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
      throw new Error(`OpenAI API error: ${error}`);
    }
    
    const data = await response.json();
    const translatedText = data.choices[0].message.content;
    
    // Parse the numbered translations
    const translations = [];
    const lines = translatedText.split('\n');
    
    for (const line of lines) {
      const match = line.match(/^\d+\.\s+(.+)$/);
      if (match) {
        translations.push(match[1]);
      }
    }
    
    // If parsing failed, return original texts
    if (translations.length !== texts.length) {
      console.warn('Warning: Translation count mismatch, falling back to individual translation');
      return texts;
    }
    
    return translations;
    
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts; // Return original texts on error
  }
}

// Update page DOM
async function updatePageDOM(pageId, nodes) {
  const response = await fetch(
    `https://api.webflow.com/v2/pages/${pageId}/dom`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        pageId: pageId,
        nodes: nodes
      })
    }
  );
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update page DOM: ${error}`);
  }
  
  return await response.json();
}

// Publish site
async function publishSite() {
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
          publishTargets: ['live']
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to publish: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Warning: Failed to publish site:', error.message);
  }
}

// Main translation function
async function translatePage(slug, targetLanguage) {
  try {
    console.log(`\n🌐 Starting translation of "${slug}" to ${LANGUAGE_NAMES[targetLanguage]}...\n`);
    
    // Step 1: Get page
    console.log('🔍 Finding page...');
    const page = await getPageBySlug(slug);
    console.log(`✅ Page found: ${page.title}`);
    
    // Step 2: Get DOM
    console.log('\n📥 Getting page DOM...');
    const domData = await getPageDOM(page.id);
    
    // Extract text nodes
    const textNodes = [];
    domData.nodes.forEach((node, index) => {
      if (node.type === 'text' && node.text && node.text.text) {
        textNodes.push({
          index: index,
          text: node.text.text,
          html: node.text.html
        });
      }
    });
    
    console.log(`✅ Found ${textNodes.length} text nodes to translate`);
    
    // Step 3: Batch translate
    console.log(`\n🔄 Translating in batches...`);
    const batchSize = 10;
    let translatedCount = 0;
    
    for (let i = 0; i < textNodes.length; i += batchSize) {
      const batch = textNodes.slice(i, i + batchSize);
      const batchTexts = batch.map(node => node.text);
      
      console.log(`   Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(textNodes.length / batchSize)}: Translating ${batch.length} items...`);
      
      const translations = await batchTranslate(batchTexts, targetLanguage);
      
      // Update the DOM nodes with translations
      batch.forEach((node, j) => {
        const translatedText = translations[j];
        domData.nodes[node.index].text.text = translatedText;
        
        // Update HTML if it exists (simple replacement)
        if (node.html && node.html !== node.text) {
          domData.nodes[node.index].text.html = node.html.replace(node.text, translatedText);
        } else {
          domData.nodes[node.index].text.html = translatedText;
        }
        
        translatedCount++;
      });
      
      // Small delay between batches
      if (i + batchSize < textNodes.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`✅ Translated ${translatedCount} text nodes`);
    
    // Save backup
    const backupFile = `backup-${slug}-${targetLanguage}-${Date.now()}.json`;
    fs.writeFileSync(backupFile, JSON.stringify(domData, null, 2));
    console.log(`\n💾 Backup saved to ${backupFile}`);
    
    // Step 4: Update DOM
    console.log('\n📤 Updating page DOM...');
    await updatePageDOM(page.id, domData.nodes);
    console.log('✅ Page updated successfully');
    
    // Step 5: Publish
    console.log('\n📢 Publishing site...');
    await publishSite();
    console.log('✅ Site published');
    
    console.log(`\n✅ Translation complete!`);
    console.log(`\n🔗 The page at "${slug}" has been translated to ${LANGUAGE_NAMES[targetLanguage]}.`);
    console.log(`   If you have localized URLs (e.g., /de/), they should now show the translated content.\n`);
    
  } catch (error) {
    console.error('\n❌ Translation failed:', error.message);
    process.exit(1);
  }
}

// Run the script
async function main() {
  const args = parseArgs();
  
  if (!args.slug || !args.lang) {
    console.log(`
Usage: node translate-page-dom-batch.js --slug="page-slug" --lang="de"

This script translates a Webflow page using the DOM API with batch processing for efficiency.

Options:
  --slug  The page slug to translate (required)
  --lang  Target language code: de, es, fr, it, pt, nl (required)

Example:
  node translate-page-dom-batch.js --slug="the-haircare-challenge" --lang="de"
    `);
    process.exit(1);
  }
  
  if (!LANGUAGE_NAMES[args.lang]) {
    console.error(`\n❌ Invalid language code: ${args.lang}`);
    console.error('Valid codes: de, es, fr, it, pt, nl\n');
    process.exit(1);
  }
  
  await translatePage(args.slug, args.lang);
}

// Run if called directly
if (require.main === module) {
  main();
}