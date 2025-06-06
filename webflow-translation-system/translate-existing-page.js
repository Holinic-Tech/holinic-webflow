#!/usr/bin/env node

// Simple page translator using Webflow Data API
// Usage: node translate-existing-page.js --url="hairqare.co/de/the-haircare-challenge" --lang="de"

const fetch = require('node-fetch');
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

// Extract page slug from URL
function extractPageSlug(url) {
  // Remove protocol if present
  let cleanUrl = url.replace(/^https?:\/\//, '');
  
  // Remove domain if present (anything before the first /)
  if (cleanUrl.includes('/')) {
    cleanUrl = cleanUrl.substring(cleanUrl.indexOf('/') + 1);
  }
  
  // Remove leading slash if present
  cleanUrl = cleanUrl.replace(/^\//, '');
  
  return cleanUrl;
}

// Get page ID from slug
async function getPageIdFromSlug(slug) {
  try {
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
      // Try without language prefix
      const slugWithoutLang = slug.replace(/^[a-z]{2}\//, '');
      const pageAlt = data.pages.find(p => p.slug === slugWithoutLang);
      if (pageAlt) return pageAlt.id;
      
      throw new Error(`Page not found with slug: ${slug}`);
    }
    
    return page.id;
  } catch (error) {
    console.error('Error getting page ID:', error);
    throw error;
  }
}

// Get page content
async function getPageContent(pageId) {
  try {
    const response = await fetch(
      `https://api.webflow.com/v2/pages/${pageId}/content`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get page content: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting page content:', error);
    throw error;
  }
}

// Translate text using OpenAI
async function translateText(text, targetLanguage) {
  if (!text || !text.trim()) return text;
  
  try {
    const headers = {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    };
    
    // Add OpenAI organization and project headers if available
    if (process.env.OPENAI_ORG_ID) {
      headers['OpenAI-Organization'] = process.env.OPENAI_ORG_ID;
    }
    if (process.env.OPENAI_PROJECT_ID) {
      headers['OpenAI-Project'] = process.env.OPENAI_PROJECT_ID;
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator specializing in website content. 
                     Translate the following text from English to ${LANGUAGE_NAMES[targetLanguage]}.
                     Maintain the original formatting, HTML tags if present, and tone.
                     Do not add explanations or notes, just provide the translation.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
    
  } catch (error) {
    console.error('Translation error for text:', text.substring(0, 50) + '...');
    console.error(error);
    // Return original text if translation fails
    return text;
  }
}

// Process and translate nodes
async function translateNodes(nodes, targetLanguage) {
  const translatedNodes = [];
  let translationCount = 0;
  
  for (const node of nodes) {
    // Only translate text nodes
    if (node.type === 'text' && node.text) {
      console.log(`Translating text ${++translationCount}/${nodes.filter(n => n.type === 'text').length}: "${node.text.substring(0, 50)}..."`);
      
      const translatedText = await translateText(node.text, targetLanguage);
      
      translatedNodes.push({
        nodeId: node.nodeId,
        text: translatedText
      });
      
      // Add small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return translatedNodes;
}

// Update page content
async function updatePageContent(pageId, nodes) {
  try {
    const response = await fetch(
      `https://api.webflow.com/v2/pages/${pageId}/content`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          nodes: nodes
        })
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update page: ${error}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating page:', error);
    throw error;
  }
}

// Main translation function
async function translatePage(url, targetLanguage) {
  try {
    console.log(`\n🌐 Starting translation of ${url} to ${LANGUAGE_NAMES[targetLanguage]}...\n`);
    
    // Step 1: Extract slug from URL
    const slug = extractPageSlug(url);
    console.log(`📄 Page slug: ${slug}`);
    
    // Step 2: Get page ID
    console.log('🔍 Finding page ID...');
    const pageId = await getPageIdFromSlug(slug);
    console.log(`✅ Page ID: ${pageId}`);
    
    // Step 3: Get page content
    console.log('📥 Getting page content...');
    const content = await getPageContent(pageId);
    console.log(`✅ Found ${content.nodes.length} nodes`);
    
    // Step 4: Translate text nodes
    console.log(`🔄 Translating text content to ${LANGUAGE_NAMES[targetLanguage]}...`);
    const translatedNodes = await translateNodes(content.nodes, targetLanguage);
    console.log(`✅ Translated ${translatedNodes.length} text nodes`);
    
    // Step 5: Update page
    console.log('📤 Updating page with translations...');
    await updatePageContent(pageId, translatedNodes);
    
    console.log(`\n✅ Success! Page translated to ${LANGUAGE_NAMES[targetLanguage]}`);
    console.log(`🔗 View at: https://${url}\n`);
    
  } catch (error) {
    console.error('\n❌ Translation failed:', error.message);
    process.exit(1);
  }
}

// Run the script
async function main() {
  const args = parseArgs();
  
  if (!args.url || !args.lang) {
    console.log(`
Usage: node translate-existing-page.js --url="hairqare.co/de/the-haircare-challenge" --lang="de"

Options:
  --url   The full URL of the page to translate (required)
  --lang  Target language code: de, es, fr, it, pt, nl (required)

Example:
  node translate-existing-page.js --url="hairqare.co/de/the-haircare-challenge" --lang="de"
    `);
    process.exit(1);
  }
  
  if (!LANGUAGE_NAMES[args.lang]) {
    console.error(`\n❌ Invalid language code: ${args.lang}`);
    console.error('Valid codes: de, es, fr, it, pt, nl\n');
    process.exit(1);
  }
  
  await translatePage(args.url, args.lang);
}

// Run if called directly
if (require.main === module) {
  main();
}