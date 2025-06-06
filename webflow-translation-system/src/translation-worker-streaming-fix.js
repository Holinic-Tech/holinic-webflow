// Fixed streaming version for Cloudflare Workers
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

    try {
      // Route handling
      if (url.pathname === '/api/test-connection') {
        return handleTestConnection(env, corsHeaders);
      }
      
      if (url.pathname === '/api/translate') {
        // Clone the request to read body
        const body = await request.json();
        
        // Create a new readable stream for SSE
        let { readable, writable } = new TransformStream();
        let writer = writable.getWriter();
        const encoder = new TextEncoder();
        
        // Process translation in the background
        ctx.waitUntil(
          doTranslation(body, env, writer, encoder).finally(() => {
            writer.close().catch(() => {});
          })
        );
        
        // Return the stream immediately
        return new Response(readable, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            ...corsHeaders
          }
        });
      }

      // Serve dashboard HTML
      if (url.pathname === '/' || url.pathname === '/dashboard') {
        return serveDashboard();
      }

      return new Response('Not found', { status: 404 });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
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

async function doTranslation(body, env, writer, encoder) {
  const sendEvent = async (data) => {
    try {
      await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
    } catch (e) {
      console.error('Error sending event:', e);
    }
  };

  try {
    const { pagePath, language, mode, customPrompt } = body;

    await sendEvent({ type: 'log', message: 'Starting translation process...' });

    // Validate language
    const langConfig = LANGUAGE_CONFIG[language];
    if (!langConfig) {
      throw new Error(`Language ${language} not configured`);
    }

    if (!langConfig.localeId) {
      throw new Error(`Locale ID not set for ${language}. Only German (de) is currently configured.`);
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
    let page = pagesData.pages.find(p => p.slug === pagePath);

    if (!page) {
      // Try with 'the-' prefix
      const altPage = pagesData.pages.find(p => p.slug === `the-${pagePath}`);
      if (!altPage) {
        throw new Error(`Page not found: ${pagePath}. Available pages: ${pagesData.pages.slice(0, 5).map(p => p.slug).join(', ')}...`);
      }
      page = altPage;
    }

    await sendEvent({ type: 'log', message: `Found page: ${page.title} (${page.id})` });
    await sendEvent({ type: 'progress', percent: 20, message: 'Fetching content...' });

    // For testing - just simulate the translation process
    await sendEvent({ type: 'log', message: 'Fetching DOM nodes...' });
    await sendEvent({ type: 'progress', percent: 30, message: 'Analyzing content...' });
    
    // Simulate some work
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await sendEvent({ type: 'log', message: 'Would translate 100 nodes here...', level: 'info' });
    await sendEvent({ type: 'progress', percent: 80, message: 'Applying translations...' });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await sendEvent({ type: 'log', message: 'Translation complete!', level: 'success' });
    await sendEvent({ type: 'progress', percent: 100, message: 'Complete!' });
    
    await sendEvent({ 
      type: 'complete', 
      message: 'Translation completed successfully!',
      url: `https://hairqare.co/${language}/${page.slug}`
    });

  } catch (error) {
    console.error('Translation error:', error);
    await sendEvent({ type: 'error', message: error.message });
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
                        </select>
                        <p class="help-text">Currently only German is configured</p>
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
        // UI Elements
        const form = document.getElementById('translationForm');
        const statusPanel = document.getElementById('statusPanel');
        const logOutput = document.getElementById('logOutput');
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        const translateBtn = document.getElementById('translateBtn');
        const testBtn = document.getElementById('testBtn');

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
                    addLog(\`Found \${data.pages} pages\`, 'info');
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

            // Clear previous logs
            logOutput.innerHTML = '';
            
            // Disable form
            translateBtn.disabled = true;
            statusPanel.classList.add('active');
            updateProgress(0, 'Starting translation...');
            
            addLog(\`Starting translation of "\${formData.pagePath}" to German\`, 'info');
            
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

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\\n');

                    for (const line of lines) {
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
                                // Ignore parsing errors
                            }
                        }
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