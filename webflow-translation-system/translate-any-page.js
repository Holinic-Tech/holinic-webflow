#!/usr/bin/env node

// Flexible translation script for any page and language
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

// Load translation instructions
const TRANSLATION_INSTRUCTIONS = fs.readFileSync('TRANSLATION_INSTRUCTIONS.md', 'utf8');

// Configure languages here - add new ones as needed
const LANGUAGE_CONFIG = {
  de: {
    name: 'German',
    localeId: '684230454832f0132d5f6ccf',
    instructions: `Use informal "du" throughout. Keep "Challenge" untranslated. Natural conversational German.`
  },
  es: {
    name: 'Spanish',
    localeId: 'REPLACE_WITH_SPANISH_LOCALE_ID',
    instructions: `Use informal "tú" throughout. Keep "Challenge" untranslated. Natural conversational Spanish.`
  },
  fr: {
    name: 'French',
    localeId: '684683d87f6a3ae6079ec99f',
    instructions: `Use informal "tu" throughout. Keep "Challenge" untranslated. Natural conversational French.`
  }
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
  const page = data.pages.find(p => p.slug === slug);
  
  if (!page) {
    // List available pages
    console.log('\n❌ Page not found. Available pages:');
    data.pages.slice(0, 10).forEach(p => {
      console.log(`   - ${p.slug} (${p.title})`);
    });
    throw new Error(`\nPage not found with slug: ${slug}`);
  }
  
  return page;
}

async function translatePage(pageSlug, targetLang) {
  const config = LANGUAGE_CONFIG[targetLang];
  
  if (!config) {
    console.error(`\n❌ Language not configured: ${targetLang}`);
    console.log('Available languages:', Object.keys(LANGUAGE_CONFIG).join(', '));
    return;
  }
  
  if (config.localeId.includes('REPLACE')) {
    console.error(`\n❌ Please update the locale ID for ${config.name} in the script`);
    console.log('Run "node find-locale-id.js" to find the correct locale ID');
    return;
  }
  
  console.log(`\n🌐 Translating "${pageSlug}" to ${config.name}...\n`);
  
  try {
    // 1. Get page
    const page = await getPageBySlug(pageSlug);
    console.log(`✅ Found page: ${page.title}`);
    
    // 2. Get DOM
    console.log('\n📥 Getting page content...');
    const domResponse = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/dom`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );
    
    const domData = await domResponse.json();
    
    // Extract text nodes
    const textNodes = [];
    domData.nodes.forEach((node, index) => {
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
    
    console.log(`✅ Found ${textNodes.length} text nodes`);
    
    // Check for components
    const componentNodes = domData.nodes.filter(n => n.type === 'component-instance');
    if (componentNodes.length > 0) {
      console.log(`\n⚠️  WARNING: Found ${componentNodes.length} component instance(s)`);
      console.log('   Components may contain text that cannot be translated via API');
      console.log('   These must be translated manually in Webflow Designer:');
      componentNodes.forEach(comp => {
        console.log(`   - Component ID: ${comp.componentId}`);
      });
    }
    console.log('');
    
    // 3. Translate
    console.log('🔄 Translating...');
    const translations = [];
    const batchSize = 10;
    
    for (let i = 0; i < textNodes.length; i += batchSize) {
      const batch = textNodes.slice(i, i + batchSize);
      console.log(`   Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(textNodes.length / batchSize)}...`);
      
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
    
    // 4. Save backup
    const timestamp = Date.now();
    const backupFile = `translation-${pageSlug}-${targetLang}-${timestamp}.json`;
    fs.writeFileSync(backupFile, JSON.stringify({
      pageId: page.id,
      pageSlug: pageSlug,
      language: targetLang,
      timestamp: new Date().toISOString(),
      translations: translations
    }, null, 2));
    console.log(`\n💾 Backup saved: ${backupFile}`);
    
    // 5. Update page
    console.log('\n📤 Updating page...');
    const updateResponse = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/dom?localeId=${config.localeId}`,
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
      console.log('⚠️  Some errors occurred:', result.errors.length, 'nodes failed');
    } else {
      console.log('✅ Page updated successfully');
    }
    
    // 6. Publish
    console.log('\n📢 Publishing...');
    await publishSite();
    
    console.log('\n✨ Translation complete!');
    console.log(`\n🔗 Check the ${config.name} version at your site\n`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
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
    
    const instructions = `
${config.instructions}

BRAND TERMS (NEVER TRANSLATE):
- "14-Day Haircare Challenge" (product name)
- "Challenge" when capitalized
- "Hairqare" (brand name)

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
    
    // Parse translations
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

async function publishSite() {
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
  } catch (error) {
    console.error('Publish error:', error.message);
  }
}

// Main
async function main() {
  const args = parseArgs();
  
  if (!args.slug || !args.lang) {
    console.log(`
🌐 Webflow Page Translator

Usage: node translate-any-page.js --slug="page-slug" --lang="language-code"

Options:
  --slug  The page slug to translate (required)
  --lang  Target language: de, es, fr, it, pt, nl (required)

Examples:
  node translate-any-page.js --slug="the-haircare-challenge" --lang="de"
  node translate-any-page.js --slug="about-us" --lang="es"
  node translate-any-page.js --slug="pricing" --lang="fr"

Available languages:
${Object.entries(LANGUAGE_CONFIG).map(([code, config]) => 
  `  ${code} - ${config.name} ${config.localeId.includes('REPLACE') ? '(needs locale ID)' : '✓'}`
).join('\n')}

To add a new language:
1. Enable the locale in Webflow
2. Run "node find-locale-id.js" to get the locale ID
3. Update LANGUAGE_CONFIG in this script
    `);
    process.exit(1);
  }
  
  await translatePage(args.slug, args.lang);
}

if (require.main === module) {
  main();
}