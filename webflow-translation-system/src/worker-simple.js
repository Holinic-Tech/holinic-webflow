// Simplified Cloudflare Worker for translating existing pages

export default {
  async fetch(request, env, ctx) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const url = new URL(request.url);
      
      // Simple auth check
      const authHeader = request.headers.get('Authorization');
      if (!authHeader?.includes('Bearer')) {
        return new Response('Unauthorized', { 
          status: 401, 
          headers: corsHeaders 
        });
      }

      if (url.pathname === '/translate-page' && request.method === 'POST') {
        return await handlePageTranslation(request, env, corsHeaders);
      }

      return new Response('Not Found', { 
        status: 404, 
        headers: corsHeaders 
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

async function handlePageTranslation(request, env, corsHeaders) {
  try {
    const body = await request.json();
    const { url: pageUrl, targetLanguage } = body;

    if (!pageUrl || !targetLanguage) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: url and targetLanguage' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Translating ${pageUrl} to ${targetLanguage}`);

    // Extract slug from URL
    const slug = pageUrl.replace(/^https?:\/\/[^\/]+\//, '');
    
    // Get page ID from slug
    const pageId = await getPageIdFromSlug(slug, env);
    
    // Get page content
    const content = await getPageContent(pageId, env);
    
    // Translate text nodes
    const translatedNodes = await translateNodes(
      content.nodes, 
      targetLanguage, 
      env.OPENAI_API_KEY
    );
    
    // Update page with translations
    await updatePageContent(pageId, translatedNodes, env);
    
    return new Response(JSON.stringify({
      success: true,
      pageId,
      language: targetLanguage,
      nodesTranslated: translatedNodes.length,
      message: `Successfully translated ${translatedNodes.length} text elements`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Get page ID from slug
async function getPageIdFromSlug(slug, env) {
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
}

// Get page content
async function getPageContent(pageId, env) {
  const response = await fetch(
    `https://api.webflow.com/v2/pages/${pageId}/content`,
    {
      headers: {
        'Authorization': `Bearer ${env.WEBFLOW_TOKEN}`,
        'accept': 'application/json'
      }
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to get page content: ${response.statusText}`);
  }
  
  return await response.json();
}

// Translate nodes
async function translateNodes(nodes, targetLanguage, openaiKey) {
  const translatedNodes = [];
  const textNodes = nodes.filter(node => node.type === 'text' && node.text);
  
  console.log(`Found ${textNodes.length} text nodes to translate`);
  
  // Batch translate for efficiency
  const batchSize = 10;
  for (let i = 0; i < textNodes.length; i += batchSize) {
    const batch = textNodes.slice(i, i + batchSize);
    
    const translations = await Promise.all(
      batch.map(node => translateText(node.text, targetLanguage, openaiKey))
    );
    
    batch.forEach((node, index) => {
      translatedNodes.push({
        nodeId: node.nodeId,
        text: translations[index]
      });
    });
    
    // Small delay between batches
    if (i + batchSize < textNodes.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return translatedNodes;
}

// Translate text using OpenAI
async function translateText(text, targetLanguage, apiKey) {
  if (!text || !text.trim()) return text;
  
  const languageNames = {
    de: 'German',
    es: 'Spanish',
    fr: 'French',
    it: 'Italian',
    pt: 'Portuguese',
    nl: 'Dutch'
  };
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate from English to ${languageNames[targetLanguage]}.
                     Maintain formatting and tone. Return only the translation.`
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
      console.error('OpenAI error:', await response.text());
      return text; // Return original on error
    }
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
    
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original on error
  }
}

// Update page content
async function updatePageContent(pageId, nodes, env) {
  const response = await fetch(
    `https://api.webflow.com/v2/pages/${pageId}/content`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${env.WEBFLOW_TOKEN}`,
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
  
  // Publish the page after updating
  try {
    await publishPage(pageId, env);
  } catch (publishError) {
    console.error('Warning: Page updated but not published:', publishError);
  }
  
  return await response.json();
}

// Publish page after translation
async function publishPage(pageId, env) {
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
        publishTargets: ['live'],
        pageIds: [pageId]
      })
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to publish: ${response.statusText}`);
  }
  
  return await response.json();
}