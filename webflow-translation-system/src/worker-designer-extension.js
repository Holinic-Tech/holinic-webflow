// Cloudflare Worker for Designer Extension Translation Requests

export default {
  async fetch(request, env, ctx) {
    // CORS headers for the Designer Extension
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
      
      // Authentication check (ID token from Designer Extension)
      const authHeader = request.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return new Response('Unauthorized', { status: 401, headers: corsHeaders });
      }

      switch (url.pathname) {
        case '/translate-content':
          return await handleContentTranslation(request, env, corsHeaders);
        case '/status':
          return await getTranslationStatus(request, env, corsHeaders);
        case '/estimate':
          return await estimateTranslationCost(request, env, corsHeaders);
        default:
          return new Response('Not Found', { status: 404, headers: corsHeaders });
      }
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

// Handle content translation from Designer Extension
async function handleContentTranslation(request, env, corsHeaders) {
  try {
    const body = await request.json();
    const { content, targetLanguage, originalSlug, sourceLanguage = 'en' } = body;
    
    if (!content || !targetLanguage || !originalSlug) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Translating content for ${originalSlug} to ${targetLanguage}`);

    // Translate elements
    const translatedElements = [];
    for (const element of content.elements) {
      try {
        const translatedText = await translateText(
          element.text,
          sourceLanguage,
          targetLanguage,
          env.OPENAI_API_KEY
        );
        
        // Handle link localization
        const localizedText = localizeLinks(translatedText, targetLanguage, originalSlug);
        
        translatedElements.push({
          ...element,
          translatedText: localizedText
        });
      } catch (error) {
        console.error(`Failed to translate element ${element.id}:`, error);
        // Use original text as fallback
        translatedElements.push({
          ...element,
          translatedText: element.text
        });
      }
    }

    // Translate metadata
    const translatedMetadata = {
      title: await translateText(
        content.metadata.title,
        sourceLanguage,
        targetLanguage,
        env.OPENAI_API_KEY
      ),
      description: await translateText(
        content.metadata.description,
        sourceLanguage,
        targetLanguage,
        env.OPENAI_API_KEY
      )
    };

    // Store translation status
    await storeTranslationStatus(env.TRANSLATION_STATUS, originalSlug, targetLanguage, 'completed');

    return new Response(JSON.stringify({
      success: true,
      translatedContent: {
        elements: translatedElements,
        metadata: translatedMetadata
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(JSON.stringify({ 
      error: 'Translation failed', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Translate text using OpenAI
async function translateText(text, sourceLang, targetLang, apiKey) {
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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator specializing in website content. 
                     Translate the following text from English to ${languageNames[targetLang]}.
                     Maintain the original formatting, HTML tags, and tone.
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
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();

  } catch (error) {
    console.error('OpenAI translation error:', error);
    throw error;
  }
}

// Localize links in translated content
function localizeLinks(text, targetLang, originalSlug) {
  // Patterns for links that need localization
  const patterns = {
    checkout: [
      /href="([^"]*\/checkout[^"]*)"/gi,
      /href='([^']*\/checkout[^']*)'/gi
    ],
    quiz: [
      /href="([^"]*\/quiz[^"]*)"/gi,
      /href='([^']*\/quiz[^']*)'/gi,
      /href="([^"]*\/challenge[^"]*)"/gi,
      /href='([^']*\/challenge[^']*)'/gi
    ]
  };

  let localizedText = text;

  // Update checkout links
  patterns.checkout.forEach(pattern => {
    localizedText = localizedText.replace(pattern, (match, url) => {
      if (!url.includes(`/${targetLang}/`)) {
        const newUrl = `/${targetLang}${url}`;
        return match.replace(url, newUrl);
      }
      return match;
    });
  });

  // Update quiz/challenge links
  patterns.quiz.forEach(pattern => {
    localizedText = localizedText.replace(pattern, (match, url) => {
      if (!url.includes(`/${targetLang}/`)) {
        const newUrl = `/${targetLang}${url}`;
        return match.replace(url, newUrl);
      }
      return match;
    });
  });

  return localizedText;
}

// Store translation status in KV
async function storeTranslationStatus(kvNamespace, slug, language, status) {
  const key = `translation:${slug}:${language}`;
  const data = {
    status,
    timestamp: new Date().toISOString(),
    slug,
    language
  };
  
  await kvNamespace.put(key, JSON.stringify(data), {
    expirationTtl: 86400 * 30 // 30 days
  });
}

// Get translation status
async function getTranslationStatus(request, env, corsHeaders) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');
    const language = url.searchParams.get('language');
    
    if (!slug || !language) {
      return new Response(JSON.stringify({ error: 'Missing slug or language' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const key = `translation:${slug}:${language}`;
    const data = await env.TRANSLATION_STATUS.get(key);
    
    if (!data) {
      return new Response(JSON.stringify({ status: 'not_found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(data, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Estimate translation cost
async function estimateTranslationCost(request, env, corsHeaders) {
  try {
    const body = await request.json();
    const { content } = body;
    
    if (!content) {
      return new Response(JSON.stringify({ error: 'Missing content' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Calculate approximate tokens
    let totalChars = 0;
    content.elements.forEach(el => {
      totalChars += el.text.length;
    });
    totalChars += content.metadata.title.length;
    totalChars += content.metadata.description.length;

    // Rough estimate: 1 token ≈ 4 characters
    const estimatedTokens = Math.ceil(totalChars / 4);
    
    // GPT-4 pricing (approximate)
    const costPer1kTokens = 0.03; // $0.03 per 1K tokens
    const estimatedCost = (estimatedTokens / 1000) * costPer1kTokens;

    return new Response(JSON.stringify({
      estimatedTokens,
      estimatedCost: estimatedCost.toFixed(4),
      characterCount: totalChars
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}