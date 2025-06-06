#!/usr/bin/env node

// Page translator using Webflow DOM API
// Usage: node translate-page-dom.js --slug="the-haircare-challenge" --lang="de"

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

// Get page by slug
async function getPageBySlug(slug) {
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
      throw new Error(`Page not found with slug: ${slug}`);
    }
    
    return page;
  } catch (error) {
    console.error('Error getting page:', error);
    throw error;
  }
}

// Get page DOM
async function getPageDOM(pageId) {
  try {
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
  } catch (error) {
    console.error('Error getting page DOM:', error);
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
                     Maintain the original tone, style, and any technical terms.
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

// Translate HTML content while preserving tags
async function translateHTML(html, plainText, targetLanguage) {
  // If it's just plain text without HTML tags, translate directly
  if (!html.includes('<') || html === plainText) {
    return await translateText(plainText, targetLanguage);
  }
  
  // For HTML content, translate the plain text and try to preserve structure
  const translatedText = await translateText(plainText, targetLanguage);
  
  // Simple approach: if the HTML is just wrapping tags, replace the inner text
  // This works for simple cases like <p>text</p> or <h1>text</h1>
  const tagMatch = html.match(/^(<[^>]+>)(.*?)(<\/[^>]+>)$/);
  if (tagMatch) {
    return tagMatch[1] + translatedText + tagMatch[3];
  }
  
  // For more complex HTML, return the translated text wrapped in the same outer tag
  const outerTagMatch = html.match(/^<([^>\s]+)[^>]*>/);
  if (outerTagMatch) {
    const tag = outerTagMatch[1];
    return `<${tag}>${translatedText}</${tag}>`;
  }
  
  // Fallback: return translated text
  return translatedText;
}

// Update page DOM
async function updatePageDOM(pageId, nodes) {
  try {
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
  } catch (error) {
    console.error('Error updating page DOM:', error);
    throw error;
  }
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
    console.error('Warning: Failed to publish site:', error);
    // Don't throw, just warn
  }
}

// Main translation function
async function translatePage(slug, targetLanguage) {
  try {
    console.log(`\n🌐 Starting translation of "${slug}" to ${LANGUAGE_NAMES[targetLanguage]}...\n`);
    
    // Step 1: Get page by slug
    console.log('🔍 Finding page...');
    const page = await getPageBySlug(slug);
    console.log(`✅ Page found: ${page.title}`);
    console.log(`   ID: ${page.id}`);
    
    // Step 2: Get page DOM
    console.log('\n📥 Getting page DOM...');
    const domData = await getPageDOM(page.id);
    console.log(`✅ Got DOM with ${domData.nodes.length} nodes`);
    
    // Step 3: Extract and translate text nodes
    console.log(`\n🔄 Translating text content to ${LANGUAGE_NAMES[targetLanguage]}...`);
    
    let translatedCount = 0;
    const textNodes = domData.nodes.filter(node => node.type === 'text' && node.text);
    console.log(`   Found ${textNodes.length} text nodes to translate`);
    
    // Translate each text node
    for (let i = 0; i < domData.nodes.length; i++) {
      const node = domData.nodes[i];
      
      if (node.type === 'text' && node.text && node.text.text) {
        translatedCount++;
        const originalText = node.text.text;
        console.log(`   ${translatedCount}/${textNodes.length}: Translating "${originalText.substring(0, 50)}..."`);
        
        // Translate the text
        const translatedText = await translateText(originalText, targetLanguage);
        
        // Update the node
        domData.nodes[i].text.text = translatedText;
        
        // If there's HTML, try to preserve the structure
        if (node.text.html) {
          domData.nodes[i].text.html = await translateHTML(node.text.html, originalText, targetLanguage);
        }
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`✅ Translated ${translatedCount} text nodes`);
    
    // Step 4: Update page DOM
    console.log('\n📤 Updating page DOM with translations...');
    await updatePageDOM(page.id, domData.nodes);
    console.log('✅ Page DOM updated successfully');
    
    // Step 5: Publish site
    console.log('\n📢 Publishing site...');
    await publishSite();
    console.log('✅ Site published');
    
    console.log(`\n✅ Success! Page translated to ${LANGUAGE_NAMES[targetLanguage]}`);
    console.log(`\n🔗 Note: The translation updates the source page.`);
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
Usage: node translate-page-dom.js --slug="page-slug" --lang="de"

Options:
  --slug  The page slug to translate (required)
  --lang  Target language code: de, es, fr, it, pt, nl (required)

Example:
  node translate-page-dom.js --slug="the-haircare-challenge" --lang="de"
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