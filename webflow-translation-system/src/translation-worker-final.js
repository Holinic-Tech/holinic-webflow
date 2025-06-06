// Final working translation worker
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Enable CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Route handling
    if (url.pathname === '/api/test-connection') {
      return handleTestConnection(env, corsHeaders);
    }
    
    if (url.pathname === '/api/translate') {
      return handleTranslation(request, env, ctx, corsHeaders);
    }

    // Serve dashboard HTML
    if (url.pathname === '/' || url.pathname === '/dashboard') {
      return serveDashboard();
    }

    return new Response('Not found', { status: 404 });
  }
};

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
    localeId: '', 
    baseInstructions: `Use informal "tú" throughout. Keep "Challenge" untranslated. Natural conversational Spanish.
CURRENCY: Convert all USD ($, US$) to EUR (€).`
  },
  fr: {
    name: 'French',
    localeId: '',
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

async function handleTestConnection(env, corsHeaders) {
  try {
    const response = await fetch(
      `https://api.webflow.com/v2/sites/${env.WEBFLOW_SITE_ID}/pages`,
      {
        headers: {
          'Authorization': `Bearer ${env.WEBFLOW_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Webflow API error: ${response.status}`);
    }

    const data = await response.json();
    
    return new Response(JSON.stringify({
      success: true,
      pages: data.pages?.length || 0,
      locales: 0
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

async function handleTranslation(request, env, ctx, corsHeaders) {
  const encoder = new TextEncoder();
  let { readable, writable } = new TransformStream();
  
  // Start the translation process
  ctx.waitUntil(processTranslation(request, env, writable));
  
  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      ...corsHeaders
    }
  });
}

async function processTranslation(request, env, writable) {
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  
  const sendEvent = async (data) => {
    try {
      await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
    } catch (e) {
      console.error('Error sending event:', e);
    }
  };

  try {
    const body = await request.json();
    const { pagePath, language, mode, customPrompt } = body;

    await sendEvent({ type: 'log', message: 'Starting translation process...' });

    // Validate language
    const langConfig = LANGUAGE_CONFIG[language];
    if (!langConfig) {
      throw new Error(`Language ${language} not configured`);
    }

    if (!langConfig.localeId) {
      throw new Error(`Locale ID not set for ${language}. Please configure in Webflow first.`);
    }

    // Find page
    await sendEvent({ type: 'log', message: `Finding page: ${pagePath}` });
    await sendEvent({ type: 'progress', percent: 10, message: 'Finding page...' });

    const pagesResponse = await fetch(
      `https://api.webflow.com/v2/sites/${env.WEBFLOW_SITE_ID}/pages`,
      {
        headers: {
          'Authorization': `Bearer ${env.WEBFLOW_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );

    if (!pagesResponse.ok) {
      throw new Error(`Failed to fetch pages: ${pagesResponse.status}`);
    }

    const pagesData = await pagesResponse.json();
    const page = pagesData.pages.find(p => p.slug === pagePath);

    if (!page) {
      throw new Error(`Page not found: ${pagePath}`);
    }

    await sendEvent({ type: 'log', message: `Found page: ${page.title} (${page.id})` });
    await sendEvent({ type: 'progress', percent: 20, message: 'Fetching content...' });

    // Fetch all nodes
    const allNodes = await fetchAllNodes(page.id, env, sendEvent);
    await sendEvent({ type: 'log', message: `Total nodes: ${allNodes.length}` });

    // Filter nodes to translate
    let nodesToTranslate = [];
    if (mode === 'full') {
      nodesToTranslate = allNodes.filter(node => 
        node.type === 'text' && 
        node.text && 
        (node.text.text || node.text.html) && 
        (node.text.text || node.text.html).trim().length > 0
      );
    } else {
      nodesToTranslate = allNodes.filter(node => {
        if (node.type !== 'text' || !node.text) return false;
        const text = node.text.text || node.text.html || '';
        return text.trim().length > 0 && isEnglish(text) && !isTargetLanguage(text, language);
      });
    }

    await sendEvent({ type: 'log', message: `Found ${nodesToTranslate.length} nodes to translate` });
    
    if (nodesToTranslate.length === 0) {
      await sendEvent({ type: 'log', message: 'No nodes to translate!', level: 'warning' });
      await sendEvent({ type: 'complete', message: 'No translation needed', url: `https://hairqare.co/${language}/${pagePath}` });
      return;
    }

    await sendEvent({ type: 'progress', percent: 30, message: 'Starting translation...' });

    // Prepare instructions
    const instructions = langConfig.baseInstructions + 
      (customPrompt ? `\n\nADDITIONAL INSTRUCTIONS:\n${customPrompt}` : '');

    // Translate in batches
    const batchSize = 10;
    const translatedNodes = [];
    
    for (let i = 0; i < nodesToTranslate.length; i += batchSize) {
      const batch = nodesToTranslate.slice(i, i + batchSize);
      const progress = 30 + (i / nodesToTranslate.length) * 50;
      
      await sendEvent({ 
        type: 'progress', 
        percent: Math.round(progress), 
        message: `Translating nodes ${i + 1}-${Math.min(i + batchSize, nodesToTranslate.length)}...` 
      });

      try {
        const translations = await translateBatch(batch, langConfig.name, instructions, env);
        translatedNodes.push(...translations);
        await sendEvent({ type: 'log', message: `Translated batch ${Math.floor(i/batchSize) + 1}`, level: 'success' });
      } catch (error) {
        await sendEvent({ type: 'log', message: `Error translating batch: ${error.message}`, level: 'error' });
      }
    }

    if (translatedNodes.length === 0) {
      throw new Error('No nodes were successfully translated');
    }

    await sendEvent({ type: 'progress', percent: 80, message: 'Applying translations...' });

    // Apply translations
    const updateResponse = await fetch(
      `https://api.webflow.com/v2/pages/${page.id}/dom?localeId=${langConfig.localeId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.WEBFLOW_TOKEN}`,
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
      throw new Error(`Failed to update page: ${updateResponse.status} - ${errorText}`);
    }

    await sendEvent({ type: 'log', message: 'Translations applied successfully', level: 'success' });
    await sendEvent({ type: 'progress', percent: 90, message: 'Publishing site...' });

    // Publish site
    const publishSuccess = await publishSite(env);
    if (publishSuccess) {
      await sendEvent({ type: 'log', message: 'Site published!', level: 'success' });
    } else {
      await sendEvent({ type: 'log', message: 'Warning: Could not publish site', level: 'warning' });
    }
    
    await sendEvent({ type: 'progress', percent: 100, message: 'Complete!' });
    await sendEvent({ 
      type: 'complete', 
      message: 'Translation completed successfully!',
      url: `https://hairqare.co/${language}/${pagePath}`
    });

  } catch (error) {
    console.error('Translation error:', error);
    await sendEvent({ type: 'error', message: error.message });
  } finally {
    try {
      await writer.close();
    } catch (e) {
      console.error('Error closing writer:', e);
    }
  }
}

async function fetchAllNodes(pageId, env, sendEvent) {
  const allNodes = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const response = await fetch(
      `https://api.webflow.com/v2/pages/${pageId}/dom?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Authorization': `Bearer ${env.WEBFLOW_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch DOM: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.nodes) {
      console.error('No nodes in response:', data);
      break;
    }
    
    allNodes.push(...data.nodes);

    if (sendEvent) {
      await sendEvent({ 
        type: 'log', 
        message: `Fetched nodes ${offset + 1}-${offset + data.nodes.length}` 
      });
    }

    // Check if we have more pages
    const total = data.pagination?.total || data.totalNodes || allNodes.length;
    if (data.nodes.length < limit || allNodes.length >= total) {
      break;
    }

    offset += limit;
  }

  return allNodes;
}

async function translateBatch(nodes, targetLanguage, instructions, env) {
  const texts = nodes.map(node => ({
    id: node.id,
    text: node.text.text || node.text.html || ''
  }));

  const prompt = `Translate these texts to ${targetLanguage}. Return ONLY a JSON array with objects containing "id" and "translatedText" properties. Example format:
[{"id":"abc123","translatedText":"Translated text here"}]

Texts to translate:
${JSON.stringify(texts, null, 2)}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator specializing in ${targetLanguage}. ${instructions}`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Translation API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  // Try to parse the response
  let translatedTexts;
  try {
    // Remove any markdown code blocks if present
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    translatedTexts = JSON.parse(cleanContent);
  } catch (e) {
    console.error('Failed to parse translation response:', content);
    throw new Error('Invalid translation response format');
  }

  return translatedTexts.map(item => ({
    nodeId: item.id,
    originalText: texts.find(t => t.id === item.id)?.text || '',
    translatedText: item.translatedText
  }));
}

function isEnglish(text) {
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

async function publishSite(env) {
  try {
    const response = await fetch(
      `https://api.webflow.com/v2/sites/${env.WEBFLOW_SITE_ID}/publish`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.WEBFLOW_TOKEN}`,
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

function serveDashboard() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Webflow Translation Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f5f5f7;
            color: #1d1d1f;
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            background-color: #fff;
            border-bottom: 1px solid #e5e5e7;
            padding: 20px 0;
            margin-bottom: 40px;
        }

        h1 {
            font-size: 32px;
            font-weight: 600;
            color: #1d1d1f;
        }

        .subtitle {
            color: #86868b;
            margin-top: 5px;
        }

        .main-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }

        .card {
            background: #fff;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }

        .form-group {
            margin-bottom: 24px;
        }

        label {
            display: block;
            font-weight: 500;
            margin-bottom: 8px;
            color: #1d1d1f;
        }

        input, select, textarea {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #d2d2d7;
            border-radius: 8px;
            font-size: 16px;
            transition: all 0.3s ease;
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #0071e3;
            box-shadow: 0 0 0 3px rgba(0,113,227,0.1);
        }

        textarea {
            resize: vertical;
            min-height: 120px;
        }

        .radio-group {
            display: flex;
            gap: 20px;
            margin-top: 8px;
        }

        .radio-option {
            display: flex;
            align-items: center;
            cursor: pointer;
        }

        .radio-option input[type="radio"] {
            width: auto;
            margin-right: 8px;
            cursor: pointer;
        }

        .button-group {
            display: flex;
            gap: 12px;
            margin-top: 30px;
        }

        button {
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
        }

        .btn-primary {
            background-color: #0071e3;
            color: white;
        }

        .btn-primary:hover {
            background-color: #0077ed;
        }

        .btn-primary:disabled {
            background-color: #d2d2d7;
            cursor: not-allowed;
        }

        .btn-secondary {
            background-color: #f5f5f7;
            color: #1d1d1f;
            border: 1px solid #d2d2d7;
        }

        .btn-secondary:hover {
            background-color: #e8e8ed;
        }

        .status-panel {
            background-color: #f5f5f7;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
            display: none;
        }

        .status-panel.active {
            display: block;
        }

        .status-title {
            font-weight: 600;
            margin-bottom: 12px;
        }

        .progress-bar {
            background-color: #e5e5e7;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 12px;
        }

        .progress-fill {
            height: 100%;
            background-color: #0071e3;
            width: 0%;
            transition: width 0.3s ease;
        }

        .log-output {
            background-color: #1d1d1f;
            color: #f5f5f7;
            padding: 16px;
            border-radius: 8px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 13px;
            max-height: 400px;
            overflow-y: auto;
            margin-top: 12px;
        }

        .log-line {
            margin-bottom: 4px;
        }

        .log-success {
            color: #30d158;
        }

        .log-error {
            color: #ff3b30;
        }

        .log-warning {
            color: #ff9500;
        }

        .log-info {
            color: #0a84ff;
        }

        .help-text {
            font-size: 14px;
            color: #86868b;
            margin-top: 4px;
        }

        .language-presets {
            background-color: #f5f5f7;
            border-radius: 8px;
            padding: 16px;
            margin-top: 20px;
        }

        .preset-title {
            font-weight: 500;
            margin-bottom: 8px;
        }

        .preset-content {
            font-size: 14px;
            color: #86868b;
            line-height: 1.4;
        }

        @media (max-width: 768px) {
            .main-content {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>Webflow Translation Dashboard</h1>
            <p class="subtitle">Translate your Webflow pages with AI-powered localization</p>
        </div>
    </header>

    <div class="container">
        <div class="main-content">
            <div class="card">
                <h2>Translation Settings</h2>
                
                <form id="translationForm">
                    <div class="form-group">
                        <label for="pagePath">Page Path</label>
                        <input type="text" id="pagePath" name="pagePath" placeholder="e.g., the-haircare-challenge" required>
                        <p class="help-text">Enter the page slug without domain or language prefix</p>
                    </div>

                    <div class="form-group">
                        <label for="language">Target Language</label>
                        <select id="language" name="language" required>
                            <option value="">Select a language</option>
                            <option value="de">German (de)</option>
                            <option value="es">Spanish (es)</option>
                            <option value="fr">French (fr)</option>
                            <option value="it">Italian (it)</option>
                            <option value="pt">Portuguese (pt)</option>
                            <option value="nl">Dutch (nl)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Translation Mode</label>
                        <div class="radio-group">
                            <label class="radio-option">
                                <input type="radio" name="mode" value="full" checked>
                                <span>Full page translation</span>
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="mode" value="untranslated">
                                <span>Only untranslated content</span>
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="customPrompt">Custom Translation Instructions</label>
                        <textarea id="customPrompt" name="customPrompt" placeholder="Add any specific instructions for this translation..."></textarea>
                        <p class="help-text">These instructions will be added to the default language guidelines</p>
                    </div>

                    <div class="button-group">
                        <button type="submit" class="btn-primary" id="translateBtn">Start Translation</button>
                        <button type="button" class="btn-secondary" id="testBtn">Test Connection</button>
                    </div>
                </form>

                <div class="language-presets" id="languagePresets" style="display: none;">
                    <div class="preset-title">Default Guidelines for <span id="selectedLang"></span></div>
                    <div class="preset-content" id="presetContent"></div>
                </div>
            </div>

            <div class="card">
                <h2>Translation Status</h2>
                
                <div class="status-panel" id="statusPanel">
                    <div class="status-title">Progress</div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressBar"></div>
                    </div>
                    <div id="progressText">0% complete</div>
                </div>

                <div class="log-output" id="logOutput">
                    <div class="log-line log-info">Ready to start translation...</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Language presets
        const languagePresets = {
            de: {
                name: 'German',
                guidelines: \`• Use informal "du" throughout
• "14-Day Haircare Challenge" → "14-Tage-Haarpflege-Challenge"
• "Good hair days" → "Tage mit perfektem Haar"
• Keep "Challenge" (standalone) untranslated
• "Hassle" → "Stress" (NOT "Ärger")
• Currency: Convert USD ($) to EUR (€)\`
            },
            es: {
                name: 'Spanish',
                guidelines: \`• Use informal "tú" throughout
• Keep "Challenge" untranslated
• Natural, conversational Spanish
• Currency: Convert USD ($) to EUR (€)\`
            },
            fr: {
                name: 'French',
                guidelines: \`• Use informal "tu" throughout
• Keep "Challenge" untranslated
• Natural, conversational French
• Currency: Convert USD ($) to EUR (€)\`
            },
            it: {
                name: 'Italian',
                guidelines: \`• Use informal "tu" throughout
• Keep "Challenge" untranslated
• Natural, conversational Italian
• Currency: Convert USD ($) to EUR (€)\`
            },
            pt: {
                name: 'Portuguese',
                guidelines: \`• Use informal "tu/você" as appropriate
• Keep "Challenge" untranslated
• Natural, conversational Portuguese
• Currency: Convert USD ($) to EUR (€)\`
            },
            nl: {
                name: 'Dutch',
                guidelines: \`• Use informal "je/jij" throughout
• Keep "Challenge" untranslated
• Natural, conversational Dutch
• Currency: Convert USD ($) to EUR (€)\`
            }
        };

        // UI Elements
        const form = document.getElementById('translationForm');
        const languageSelect = document.getElementById('language');
        const statusPanel = document.getElementById('statusPanel');
        const logOutput = document.getElementById('logOutput');
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        const translateBtn = document.getElementById('translateBtn');
        const testBtn = document.getElementById('testBtn');
        const languagePresets = document.getElementById('languagePresets');
        const selectedLang = document.getElementById('selectedLang');
        const presetContent = document.getElementById('presetContent');

        // Show language guidelines when language is selected
        languageSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            if (lang && languagePresets[lang]) {
                languagePresets.style.display = 'block';
                selectedLang.textContent = languagePresets[lang].name;
                presetContent.innerHTML = languagePresets[lang].guidelines.replace(/\\n/g, '<br>');
            } else {
                languagePresets.style.display = 'none';
            }
        });

        // Add log message
        function addLog(message, type = 'info') {
            const logLine = document.createElement('div');
            logLine.className = \`log-line log-\${type}\`;
            logLine.textContent = \`[\${new Date().toLocaleTimeString()}] \${message}\`;
            logOutput.appendChild(logLine);
            logOutput.scrollTop = logOutput.scrollHeight;
        }

        // Update progress
        function updateProgress(percent, text) {
            progressBar.style.width = percent + '%';
            progressText.textContent = text || \`\${percent}% complete\`;
        }

        // Test connection
        testBtn.addEventListener('click', async () => {
            addLog('Testing Webflow connection...', 'info');
            
            try {
                const response = await fetch('/api/test-connection', {
                    method: 'POST'
                });
                
                const data = await response.json();
                
                if (data.success) {
                    addLog('✅ Connection successful!', 'success');
                    addLog(\`Found \${data.pages} pages, \${data.locales} locales\`, 'info');
                } else {
                    addLog('❌ Connection failed: ' + data.error, 'error');
                }
            } catch (error) {
                addLog('❌ Error: ' + error.message, 'error');
            }
        });

        // Handle form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                pagePath: document.getElementById('pagePath').value,
                language: document.getElementById('language').value,
                mode: document.querySelector('input[name="mode"]:checked').value,
                customPrompt: document.getElementById('customPrompt').value
            };

            // Validate
            if (!formData.pagePath || !formData.language) {
                addLog('Please fill in all required fields', 'error');
                return;
            }

            // Disable form
            translateBtn.disabled = true;
            statusPanel.classList.add('active');
            updateProgress(0, 'Starting translation...');
            
            addLog(\`Starting translation of "\${formData.pagePath}" to \${languagePresets[formData.language].name}\`, 'info');
            
            try {
                const response = await fetch('/api/translate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error(\`HTTP error! status: \${response.status}\`);
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\\n');
                    
                    // Keep the last incomplete line in the buffer
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (line.trim() === '') continue;
                        
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                
                                if (data.type === 'progress') {
                                    updateProgress(data.percent, data.message);
                                } else if (data.type === 'log') {
                                    addLog(data.message, data.level || 'info');
                                } else if (data.type === 'complete') {
                                    updateProgress(100, 'Translation complete!');
                                    addLog(\`✅ Translation completed successfully!\`, 'success');
                                    addLog(\`View your page at: \${data.url}\`, 'success');
                                } else if (data.type === 'error') {
                                    addLog(\`❌ Error: \${data.message}\`, 'error');
                                    updateProgress(0, 'Error occurred');
                                }
                            } catch (e) {
                                console.error('Error parsing SSE data:', e, line);
                            }
                        }
                    }
                }
                
                // Process any remaining data in buffer
                if (buffer.trim() && buffer.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(buffer.slice(6));
                        if (data.type === 'error') {
                            addLog(\`❌ Error: \${data.message}\`, 'error');
                        }
                    } catch (e) {
                        console.error('Error parsing final buffer:', e);
                    }
                }
            } catch (error) {
                addLog(\`❌ Error: \${error.message}\`, 'error');
                updateProgress(0, 'Error occurred');
            } finally {
                translateBtn.disabled = false;
            }
        });
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache'
    }
  });
}