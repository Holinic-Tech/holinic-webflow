#!/usr/bin/env node

// Enhanced translation script with style instructions
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
    instructions: `
You are translating marketing content for a haircare brand. Follow these CRITICAL rules:

1. VOICE: Use informal "du" throughout - NEVER "Sie". Be friendly, casual, and relatable like talking to a friend.

2. NEVER TRANSLATE THESE:
   - "14-Day Haircare Challenge" (product name) 
   - "Challenge" when capitalized
   - "Hairqare" (brand name)
   - "DIY" (keep as DIY)

3. KEEP MODERN: Germans use "Challenge" not "Herausforderung". Many English words are adopted.

4. SPECIFIC TERMS:
   - "Hassle" → "Stress" (NOT "Ärger")
   - "14-Day Haircare Challenge" → "14-Tage-Haarpflege-Challenge"
   - Keep energy high and natural

5. ADAPT NATURALLY: Don't translate word-for-word. Make it sound like natural German conversation.

Examples:
- "Join the Challenge" → "Mach mit bei der Challenge" (NOT "Nehmen Sie an der Herausforderung teil")
- "Start your journey" → "Leg los" or "Starte deine Reise"
- "Transform your hair" → "Verwandle dein Haar"`
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
  const page = data.pages.find(p => p.slug === slug);
  
  if (!page) {
    throw new Error(`Page not found with slug: ${slug}`);
  }
  
  return page;
}

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
  
  return await response.json();
}

async function translateWithInstructions(text, targetLang) {
  if (!text || !text.trim()) return text;
  
  const config = LANGUAGE_CONFIG[targetLang];
  
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
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `${config.instructions}

IMPORTANT: Return ONLY the translation, no explanations or notes.`
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
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
    
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

async function batchTranslateWithInstructions(texts, targetLang) {
  if (texts.length === 0) return [];
  
  const config = LANGUAGE_CONFIG[targetLang];
  
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
            content: `${config.instructions}

Translate each numbered item. Return ONLY the numbered translations, nothing else.
Keep the same numbering format.`
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
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    const translatedText = data.choices[0].message.content;
    
    // Parse numbered translations
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
    console.error('Batch translation error:', error);
    return texts;
  }
}

async function updateLocalizedPage(pageId, localeId, nodes) {
  const response = await fetch(
    `https://api.webflow.com/v2/pages/${pageId}/dom?localeId=${localeId}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({ nodes })
    }
  );
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update page: ${error}`);
  }
  
  return await response.json();
}

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
    
    if (response.ok) {
      console.log('✅ Site published');
    }
  } catch (error) {
    console.error('Publish error:', error.message);
  }
}

async function retranslateGermanPage() {
  const targetLang = 'de';
  const config = LANGUAGE_CONFIG[targetLang];
  
  console.log('\n🔄 Re-translating German page with improved instructions...\n');
  console.log('Key improvements:');
  console.log('- Using informal "du" throughout');
  console.log('- Keeping "Challenge" untranslated');
  console.log('- Natural, conversational style');
  console.log('- Fixed missing translations\n');
  
  try {
    // 1. Get page
    const page = await getPageBySlug('the-haircare-challenge');
    console.log(`✅ Found page: ${page.title}`);
    
    // 2. Get DOM
    console.log('\n📥 Getting page content...');
    const domData = await getPageDOM(page.id);
    
    // Extract text nodes
    const textNodes = [];
    domData.nodes.forEach((node, index) => {
      if (node.type === 'text' && node.text && node.text.text) {
        // Extract plain text from HTML if needed
        let plainText = node.text.text;
        if (node.text.html && node.text.html.includes('<')) {
          // Simple HTML stripping for translation
          plainText = node.text.html.replace(/<[^>]*>/g, '');
          // Decode HTML entities
          plainText = plainText.replace(/&amp;/g, '&');
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
    
    console.log(`✅ Found ${textNodes.length} text nodes\n`);
    
    // 3. Translate in batches
    console.log('🔄 Translating with improved instructions...');
    const batchSize = 10;
    const allTranslations = [];
    
    for (let i = 0; i < textNodes.length; i += batchSize) {
      const batch = textNodes.slice(i, i + batchSize);
      const batchTexts = batch.map(node => node.text);
      
      console.log(`   Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(textNodes.length / batchSize)}...`);
      
      const translations = await batchTranslateWithInstructions(batchTexts, targetLang);
      
      batch.forEach((node, j) => {
        const translatedText = translations[j];
        
        // Prepare the update node
        let finalText = translatedText;
        
        // If original had HTML, try to preserve structure
        if (node.hasHtml && node.html) {
          // For simple cases, replace the text content within HTML
          const htmlPattern = /^(<[^>]+>)(.*?)(<\/[^>]+>)$/;
          const match = node.html.match(htmlPattern);
          if (match) {
            finalText = match[1] + translatedText + match[3];
          } else {
            // For complex HTML, just use the translated text
            finalText = translatedText;
          }
        }
        
        allTranslations.push({
          nodeId: node.id,
          text: finalText,
          preview: translatedText.substring(0, 50) + '...'
        });
      });
      
      if (i + batchSize < textNodes.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`\n✅ Translated ${allTranslations.length} text nodes`);
    
    // Show sample translations
    console.log('\n📝 Sample translations:');
    const samples = [
      'Join the 14-Day Haircare Challenge',
      'Make your own DIY shampoo',
      'Hassle',
      'Transform your hair'
    ];
    
    allTranslations.forEach(t => {
      const preview = t.text.replace(/<[^>]*>/g, '');
      if (samples.some(s => t.preview.toLowerCase().includes(s.toLowerCase()))) {
        console.log(`   "${preview.substring(0, 60)}..."`);
      }
    });
    
    // 4. Save backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `improved-translation-de-${timestamp}.json`;
    fs.writeFileSync(backupFile, JSON.stringify({
      pageId: page.id,
      language: targetLang,
      timestamp: new Date().toISOString(),
      translations: allTranslations
    }, null, 2));
    console.log(`\n💾 Backup saved: ${backupFile}`);
    
    // 5. Update the page
    console.log('\n📤 Updating German page...');
    const updateResult = await updateLocalizedPage(
      page.id,
      config.localeId,
      allTranslations.map(t => ({ nodeId: t.nodeId, text: t.text }))
    );
    
    if (updateResult.errors?.length > 0) {
      console.log('⚠️  Errors:', updateResult.errors);
    } else {
      console.log('✅ Page updated successfully');
    }
    
    // 6. Publish
    console.log('\n📢 Publishing...');
    await publishSite();
    
    console.log('\n✨ Re-translation complete!');
    console.log('\n🔗 Check the improved German version at:');
    console.log('   https://hairqare.co/de/the-haircare-challenge\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  retranslateGermanPage();
}