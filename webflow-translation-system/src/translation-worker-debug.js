// Debug version with better error handling
export default {
  async fetch(request, env) {
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
        return handleTranslation(request, env, corsHeaders);
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

async function handleTestConnection(env, corsHeaders) {
  try {
    // Check if secrets are set
    if (!env.WEBFLOW_TOKEN) {
      throw new Error('WEBFLOW_TOKEN not configured');
    }
    if (!env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }
    if (!env.WEBFLOW_SITE_ID) {
      throw new Error('WEBFLOW_SITE_ID not configured');
    }

    const response = await fetch(
      `https://api.webflow.com/v2/sites/${env.WEBFLOW_SITE_ID}/pages`,
      {
        headers: {
          'Authorization': `Bearer ${env.WEBFLOW_TOKEN}`,
          'accept': 'application/json'
        }
      }
    );

    const data = await response.json();
    
    return new Response(JSON.stringify({
      success: response.ok,
      status: response.status,
      pages: data.pages?.length || 0,
      error: response.ok ? null : data.message || 'API error'
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Test connection error:', error);
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

async function handleTranslation(request, env, corsHeaders) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Process in background
  request.ctx.waitUntil((async () => {
    const sendEvent = async (data) => {
      try {
        await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      } catch (e) {
        console.error('Error sending event:', e);
      }
    };

    try {
      const body = await request.json();
      await sendEvent({ type: 'log', message: 'Starting translation...' });
      
      // Your translation logic here
      await processTranslation(body, env, sendEvent);
      
    } catch (error) {
      console.error('Translation error:', error);
      await sendEvent({ type: 'error', message: error.message });
    } finally {
      await writer.close();
    }
  })());

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      ...corsHeaders
    }
  });
}

async function processTranslation(body, env, sendEvent) {
  const { pagePath, language, mode, customPrompt } = body;
  
  // Check configuration
  if (!env.WEBFLOW_TOKEN || !env.OPENAI_API_KEY) {
    throw new Error('Missing API configuration');
  }

  await sendEvent({ type: 'log', message: `Translating ${pagePath} to ${language}...` });
  await sendEvent({ type: 'progress', percent: 10, message: 'Finding page...' });
  
  // Add minimal translation logic for testing
  await sendEvent({ type: 'log', message: 'Would translate here...', level: 'info' });
  await sendEvent({ type: 'progress', percent: 100, message: 'Complete!' });
  await sendEvent({ 
    type: 'complete', 
    message: 'Test complete (debug mode)',
    url: `https://hairqare.co/${language}/${pagePath}`
  });
}

function serveDashboard() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Translation Dashboard (Debug)</title>
    <style>
        body { font-family: system-ui; padding: 20px; max-width: 800px; margin: 0 auto; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, select, textarea { width: 100%; padding: 8px; }
        button { padding: 10px 20px; margin-right: 10px; cursor: pointer; }
        .log { background: #f0f0f0; padding: 10px; margin-top: 20px; height: 300px; overflow-y: auto; font-family: monospace; font-size: 12px; }
        .error { color: red; }
        .success { color: green; }
    </style>
</head>
<body>
    <h1>Translation Dashboard (Debug Mode)</h1>
    
    <div class="form-group">
        <button onclick="testConnection()">Test Connection</button>
        <button onclick="testTranslation()">Test Translation</button>
    </div>
    
    <div class="log" id="log"></div>
    
    <script>
        function log(message, type = '') {
            const logDiv = document.getElementById('log');
            const entry = document.createElement('div');
            entry.className = type;
            entry.textContent = \`[\${new Date().toLocaleTimeString()}] \${message}\`;
            logDiv.appendChild(entry);
            logDiv.scrollTop = logDiv.scrollHeight;
        }
        
        async function testConnection() {
            log('Testing connection...');
            try {
                const response = await fetch('/api/test-connection', { method: 'POST' });
                const data = await response.json();
                if (data.success) {
                    log(\`✅ Success! Found \${data.pages} pages\`, 'success');
                } else {
                    log(\`❌ Error: \${data.error}\`, 'error');
                }
            } catch (error) {
                log(\`❌ Fetch error: \${error.message}\`, 'error');
            }
        }
        
        async function testTranslation() {
            log('Testing translation...');
            try {
                const response = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        pagePath: 'test-page',
                        language: 'de',
                        mode: 'full',
                        customPrompt: ''
                    })
                });
                
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\\n');
                    
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                if (data.type === 'log') {
                                    log(data.message, data.level);
                                } else if (data.type === 'error') {
                                    log(\`Error: \${data.message}\`, 'error');
                                } else if (data.type === 'complete') {
                                    log(\`Complete: \${data.message}\`, 'success');
                                }
                            } catch (e) {}
                        }
                    }
                }
            } catch (error) {
                log(\`❌ Fetch error: \${error.message}\`, 'error');
            }
        }
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}