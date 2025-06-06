// Simplified worker for debugging
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Test endpoint
    if (url.pathname === '/test') {
      return new Response(JSON.stringify({
        hasWebflowToken: !!env.WEBFLOW_TOKEN,
        hasOpenAIKey: !!env.OPENAI_API_KEY,
        hasSiteId: !!env.WEBFLOW_SITE_ID,
        siteId: env.WEBFLOW_SITE_ID
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Simple test connection
    if (url.pathname === '/api/test-connection') {
      try {
        if (!env.WEBFLOW_TOKEN) {
          throw new Error('WEBFLOW_TOKEN not found');
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
        
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = { error: 'Invalid JSON response', text: text.substring(0, 200) };
        }
        
        return new Response(JSON.stringify({
          success: response.ok,
          status: response.status,
          pages: data.pages?.length || 0,
          error: data.error || null,
          message: data.message || null
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
    }

    // Simple streaming test
    if (url.pathname === '/api/stream-test') {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          controller.enqueue(encoder.encode('data: {"type":"log","message":"Stream test started"}\n\n'));
          await new Promise(resolve => setTimeout(resolve, 1000));
          controller.enqueue(encoder.encode('data: {"type":"log","message":"Stream is working"}\n\n'));
          await new Promise(resolve => setTimeout(resolve, 1000));
          controller.enqueue(encoder.encode('data: {"type":"complete","message":"Stream test complete"}\n\n'));
          controller.close();
        }
      });
      
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          ...corsHeaders
        }
      });
    }

    // Simple dashboard
    return new Response(`
<!DOCTYPE html>
<html>
<head>
    <title>Translation Dashboard Test</title>
    <style>
        body { font-family: system-ui; padding: 20px; }
        button { padding: 10px 20px; margin: 10px; cursor: pointer; }
        .log { background: #f0f0f0; padding: 10px; margin-top: 20px; font-family: monospace; }
        .error { color: red; }
        .success { color: green; }
    </style>
</head>
<body>
    <h1>Translation Dashboard Test</h1>
    
    <button onclick="testEnv()">Test Environment</button>
    <button onclick="testConnection()">Test Webflow Connection</button>
    <button onclick="testStream()">Test Streaming</button>
    
    <div class="log" id="log"></div>
    
    <script>
        function log(msg, type = '') {
            const div = document.createElement('div');
            div.className = type;
            div.textContent = new Date().toLocaleTimeString() + ' - ' + msg;
            document.getElementById('log').appendChild(div);
        }
        
        async function testEnv() {
            try {
                const response = await fetch('/test');
                const data = await response.json();
                log('Environment check:', 'success');
                log('Has Webflow Token: ' + data.hasWebflowToken);
                log('Has OpenAI Key: ' + data.hasOpenAIKey);
                log('Site ID: ' + data.siteId);
            } catch (error) {
                log('Error: ' + error.message, 'error');
            }
        }
        
        async function testConnection() {
            try {
                const response = await fetch('/api/test-connection', { method: 'POST' });
                const data = await response.json();
                if (data.success) {
                    log('✅ Connection successful! Found ' + data.pages + ' pages', 'success');
                } else {
                    log('❌ Connection failed: ' + data.error, 'error');
                }
            } catch (error) {
                log('Error: ' + error.message, 'error');
            }
        }
        
        async function testStream() {
            try {
                const response = await fetch('/api/stream-test');
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
                                log(data.message, data.type === 'complete' ? 'success' : '');
                            } catch (e) {}
                        }
                    }
                }
            } catch (error) {
                log('Stream error: ' + error.message, 'error');
            }
        }
    </script>
</body>
</html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
};