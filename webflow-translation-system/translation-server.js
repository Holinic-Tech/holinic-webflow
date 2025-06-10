#!/usr/bin/env node

// Translation Dashboard Server
require('dotenv').config();
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Environment variables
const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

// Language configurations
const LANGUAGE_CONFIG = {
  de: {
    name: 'German',
    localeId: '684230454832f0132d5f6ccf',
    baseInstructions: `Use informal "du" throughout. Keep "Challenge" untranslated when standalone. Natural conversational German.
"Hassle" → "Stress" (NOT "Ärger"). Keep "DIY" as is. Friendly and relatable tone.
KEY TRANSLATIONS:
- "14-Day Haircare Challenge" → "14-Tage-Haarpflege-Challenge"
- "Good hair days" → "Tage mit perfektem Haar"
- "Challenge" (standalone/capitalized) → keep as "Challenge"
- "Hairqare" → NEVER translate (brand name)
- "DIY" → keep as "DIY"
CURRENCY: Convert all USD ($, US$) to EUR (€). Examples: $47 → €47, 300 $ → 300€`
  },
  es: {
    name: 'Spanish',
    localeId: '', // You'll need to add the actual locale IDs
    baseInstructions: `Use informal "tú" throughout. Keep "Challenge" untranslated. Natural conversational Spanish.
CURRENCY: Convert all USD ($, US$) to EUR (€).`
  },
  fr: {
    name: 'French',
    localeId: '684683d87f6a3ae6079ec99f',
    baseInstructions: `Use informal "tu" throughout. Keep "Challenge" untranslated. Natural conversational French.
CURRENCY: Convert all USD ($, US$) to EUR (€).`
  },
  it: {
    name: 'Italian',
    localeId: '',
    baseInstructions: `Use informal "tu" throughout. Keep "Challenge" untranslated. Natural conversational Italian.
CURRENCY: Convert all USD ($, US$) to EUR (€).`
  },
  pt: {
    name: 'Portuguese',
    localeId: '',
    baseInstructions: `Use informal "tu/você" as appropriate. Keep "Challenge" untranslated. Natural conversational Portuguese.
CURRENCY: Convert all USD ($, US$) to EUR (€).`
  },
  nl: {
    name: 'Dutch',
    localeId: '',
    baseInstructions: `Use informal "je/jij" throughout. Keep "Challenge" untranslated. Natural conversational Dutch.
CURRENCY: Convert all USD ($, US$) to EUR (€).`
  }
};

// Test connection endpoint
app.post('/api/test-connection', async (req, res) => {
  try {
    // Test pages endpoint
    const pagesResponse = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}/pages`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );

    if (!pagesResponse.ok) {
      throw new Error(`Webflow API error: ${pagesResponse.status}`);
    }

    const pagesData = await pagesResponse.json();

    // Test locales endpoint
    const localesResponse = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}/locales`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );

    let localesCount = 0;
    if (localesResponse.ok) {
      const localesData = await localesResponse.json();
      localesCount = localesData.locales?.length || 0;
    }

    res.json({
      success: true,
      pages: pagesData.pages?.length || 0,
      locales: localesCount
    });

  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
});

// Main translation endpoint
app.post('/api/translate', async (req, res) => {
  const { pagePath, language, mode, customPrompt } = req.body;

  // Set up SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    sendEvent({ type: 'log', message: 'Validating configuration...' });

    // Validate language config
    const langConfig = LANGUAGE_CONFIG[language];
    if (!langConfig) {
      throw new Error(`Language ${language} not configured`);
    }

    if (!langConfig.localeId) {
      throw new Error(`Locale ID not set for ${language}. Please configure in Webflow first.`);
    }

    // Find the page
    sendEvent({ type: 'log', message: `Finding page: ${pagePath}` });
    sendEvent({ type: 'progress', percent: 10, message: 'Finding page...' });

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
    const page = pagesData.pages.find(p => p.slug === pagePath);

    if (!page) {
      throw new Error(`Page not found: ${pagePath}`);
    }

    sendEvent({ type: 'log', message: `Found page: ${page.title} (${page.id})` });
    sendEvent({ type: 'progress', percent: 20, message: 'Fetching page content...' });

    // Fetch all DOM nodes
    const allNodes = await fetchAllNodes(page.id, sendEvent);
    sendEvent({ type: 'log', message: `Total nodes: ${allNodes.length}` });

    // Filter nodes based on mode
    let nodesToTranslate = [];
    
    if (mode === 'full') {
      nodesToTranslate = allNodes.filter(node => 
        node.type === 'text' && node.text && node.text.text && node.text.text.trim().length > 0
      );
    } else {
      // Only untranslated - check if text is still in English
      nodesToTranslate = allNodes.filter(node => {
        if (node.type !== 'text' || !node.text || !node.text.text) return false;
        const text = node.text.text;
        // Simple check - if it contains common English words and no target language indicators
        return isEnglish(text) && !isTargetLanguage(text, language);
      });
    }

    sendEvent({ type: 'log', message: `Found ${nodesToTranslate.length} nodes to translate` });
    sendEvent({ type: 'progress', percent: 30, message: 'Starting translation...' });

    // Prepare translation instructions
    const instructions = langConfig.baseInstructions + 
      (customPrompt ? `\n\nADDITIONAL INSTRUCTIONS:\n${customPrompt}` : '');

    // Translate in batches
    const batchSize = 10;
    const translatedNodes = [];
    
    for (let i = 0; i < nodesToTranslate.length; i += batchSize) {
      const batch = nodesToTranslate.slice(i, i + batchSize);
      const progress = 30 + (i / nodesToTranslate.length) * 50;
      
      sendEvent({ 
        type: 'progress', 
        percent: Math.round(progress), 
        message: `Translating nodes ${i + 1}-${Math.min(i + batchSize, nodesToTranslate.length)}...` 
      });

      const translations = await translateBatch(batch, langConfig.name, instructions);
      translatedNodes.push(...translations);
      
      sendEvent({ type: 'log', message: `Translated batch ${Math.floor(i/batchSize) + 1}`, level: 'success' });
    }

    sendEvent({ type: 'progress', percent: 80, message: 'Applying translations...' });

    // Apply translations
    const updateResponse = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/dom?localeId=${langConfig.localeId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          nodes: translatedNodes.map(node => ({
            nodeId: node.nodeId,
            text: node.translatedText
          }))
        })
      }
    );

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`Failed to update page: ${errorText}`);
    }

    sendEvent({ type: 'log', message: 'Translations applied successfully', level: 'success' });
    sendEvent({ type: 'progress', percent: 90, message: 'Publishing site...' });

    // Publish site
    await publishSite();
    
    sendEvent({ type: 'log', message: 'Site published!', level: 'success' });
    sendEvent({ type: 'progress', percent: 100, message: 'Complete!' });

    // Save backup
    const timestamp = new Date().toISOString();
    const backupData = {
      timestamp,
      page: pagePath,
      language,
      mode,
      customPrompt,
      translatedNodes: translatedNodes.length,
      translations: translatedNodes
    };
    
    fs.writeFileSync(
      `translation-${pagePath}-${language}-${Date.now()}.json`, 
      JSON.stringify(backupData, null, 2)
    );

    sendEvent({ 
      type: 'complete', 
      message: 'Translation completed successfully!',
      url: `https://hairqare.co/${language}/${pagePath}`
    });

  } catch (error) {
    sendEvent({ type: 'error', message: error.message });
  } finally {
    res.end();
  }
});

// Helper functions
async function fetchAllNodes(pageId, sendEvent) {
  const allNodes = [];
  let offset = 0;
  const limit = 100;

  while (true) {
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
      throw new Error(`Failed to fetch DOM: ${response.status}`);
    }

    const data = await response.json();
    allNodes.push(...data.nodes);

    if (sendEvent) {
      sendEvent({ 
        type: 'log', 
        message: `Fetched nodes ${offset + 1}-${offset + data.nodes.length}` 
      });
    }

    if (data.nodes.length < limit || allNodes.length >= data.pagination.total) {
      break;
    }

    offset += limit;
  }

  return allNodes;
}

async function translateBatch(nodes, targetLanguage, instructions) {
  const texts = nodes.map(node => ({
    id: node.id,
    text: node.text.text
  }));

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator specializing in ${targetLanguage}. ${instructions}`
        },
        {
          role: 'user',
          content: `Translate these texts to ${targetLanguage}. Return a JSON array with {id, translatedText} for each item:\n\n${JSON.stringify(texts)}`
        }
      ],
      temperature: 0.3
    })
  });

  if (!response.ok) {
    throw new Error('Translation API error');
  }

  const data = await response.json();
  const translatedTexts = JSON.parse(data.choices[0].message.content);

  return translatedTexts.map(item => ({
    nodeId: item.id,
    originalText: texts.find(t => t.id === item.id).text,
    translatedText: item.translatedText
  }));
}

function isEnglish(text) {
  // Simple heuristic - contains common English words
  const englishWords = ['the', 'and', 'is', 'are', 'for', 'with', 'your', 'this', 'that'];
  const lowerText = text.toLowerCase();
  return englishWords.some(word => lowerText.includes(` ${word} `));
}

function isTargetLanguage(text, language) {
  const indicators = {
    de: ['der', 'die', 'das', 'und', 'ist', 'sind', 'haben', 'werden'],
    es: ['el', 'la', 'los', 'las', 'y', 'es', 'son', 'para'],
    fr: ['le', 'la', 'les', 'et', 'est', 'sont', 'pour', 'avec'],
    it: ['il', 'la', 'i', 'le', 'e', 'è', 'sono', 'per'],
    pt: ['o', 'a', 'os', 'as', 'e', 'é', 'são', 'para'],
    nl: ['de', 'het', 'een', 'en', 'is', 'zijn', 'voor', 'met']
  };

  const langIndicators = indicators[language] || [];
  const lowerText = text.toLowerCase();
  return langIndicators.some(word => lowerText.includes(` ${word} `));
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

    return response.ok;
  } catch (error) {
    console.error('Publish error:', error);
    return false;
  }
}

// Serve the dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'translation-dashboard.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Translation Dashboard Server running at http://localhost:${PORT}\n`);
  console.log('Make sure you have set the following environment variables:');
  console.log('  - WEBFLOW_TOKEN');
  console.log('  - OPENAI_API_KEY');
  console.log('  - WEBFLOW_SITE_ID\n');
});