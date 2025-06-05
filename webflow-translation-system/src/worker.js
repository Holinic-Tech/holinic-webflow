// worker.js - Cloudflare Worker for Webflow Translation

export default {
  async fetch(request, env, ctx) {
    // CORS headers for the dashboard
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
      
      // Authentication check
      if (!request.headers.get('Authorization')?.startsWith('Bearer ')) {
        return new Response('Unauthorized', { status: 401, headers: corsHeaders });
      }

      switch (url.pathname) {
        case '/translate':
          return await handleTranslation(request, env);
        case '/status':
          return await handleStatus(request, env);
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

async function handleTranslation(request, env) {
  const { urlPatterns, targetLanguage, action } = await request.json();
  
  console.log(`Starting ${action} for patterns:`, urlPatterns);
  
  const results = {
    success: [],
    failed: [],
    skipped: [],
    totalCost: 0,
    fallbacksUsed: 0,
    processedAt: new Date().toISOString()
  };

  try {
    // Get all pages from Webflow
    const pages = await getWebflowPages(env.WEBFLOW_TOKEN, env.WEBFLOW_SITE_ID);
    
    // Filter pages based on URL patterns
    const matchingPages = filterPagesByPatterns(pages, urlPatterns, action === 'update');
    
    console.log(`Found ${matchingPages.length} matching pages`);

    // Process pages sequentially (queued, not parallel)
    for (let i = 0; i < matchingPages.length; i++) {
      const page = matchingPages[i];
      console.log(`Processing ${i + 1}/${matchingPages.length}: ${page.slug}`);
      
      try {
        if (action === 'translate') {
          const result = await translatePage(page, targetLanguage, env);
          
          results.success.push({
            slug: page.slug,
            newSlug: `${targetLanguage}/${page.slug}`,
            cost: result.cost || 0,
            fallbackUsed: result.fallbackUsed || false
          });
          
          results.totalCost += result.cost || 0;
          if (result.fallbackUsed) results.fallbacksUsed++;
          
        } else if (action === 'update') {
          const result = await updateTranslatedPage(page, env);
          
          results.success.push({
            slug: page.slug,
            cost: result.cost || 0,
            updated: true
          });
          
          results.totalCost += result.cost || 0;
        }
        
        // Store comprehensive translation status in KV
        await env.TRANSLATION_STATUS.put(
          `${page.id}-${targetLanguage}`, 
          JSON.stringify({
            status: 'completed',
            timestamp: new Date().toISOString(),
            originalSlug: page.slug,
            targetLanguage,
            cost: results.totalCost,
            action
          })
        );
        
        // Small delay between requests to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Failed to process page ${page.slug}:`, error);
        results.failed.push({ 
          slug: page.slug, 
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Store batch summary
    await env.TRANSLATION_STATUS.put(
      `batch-${Date.now()}`,
      JSON.stringify({
        type: 'batch_summary',
        ...results,
        patterns: urlPatterns,
        targetLanguage,
        action
      })
    );

    console.log(`✅ Batch complete. Cost: ${results.totalCost.toFixed(4)}, Fallbacks: ${results.fallbacksUsed}`);

  } catch (error) {
    console.error('Translation process failed:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleStatus(request, env) {
  // Get recent translation statuses from KV
  const statuses = [];
  
  // This would iterate through KV keys to get statuses
  // For simplicity, returning mock data
  return new Response(JSON.stringify({ statuses }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function getWebflowPages(apiToken, siteId) {
  const response = await fetch(`https://api.webflow.com/v2/sites/${siteId}/pages`, {
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Webflow API error: ${response.status}`);
  }

  const data = await response.json();
  return data.pages || [];
}

function filterPagesByPatterns(pages, patterns, isUpdate = false) {
  return pages.filter(page => {
    const slug = page.slug || '';
    
    return patterns.some(pattern => {
      // Handle different pattern types
      if (pattern.includes('*')) {
        // Wildcard matching
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(slug);
      } else {
        // Exact match
        return slug === pattern || slug.endsWith(pattern);
      }
    });
  });
}

async function translatePage(page, targetLanguage, env) {
  console.log(`Translating page: ${page.slug} to ${targetLanguage}`);
  
  let totalCost = 0;
  let fallbackUsed = false;
  
  try {
    // 1. Get page content
    const pageContent = await getPageContent(page.id, env.WEBFLOW_TOKEN);
    
    // 2. Extract translatable content (including links)
    const translatableContent = extractTranslatableContent(pageContent);
    
    // 3. Translate with OpenAI (with cost tracking)
    const translatedContent = await translateWithOpenAI(
      translatableContent, 
      targetLanguage, 
      env.OPENAI_API_KEY
    );
    
    totalCost = translatedContent._metadata?.cost || 0;
    
    // 4. Create new page
    const newPageData = {
      title: translatedContent.title,
      slug: `${targetLanguage}/${page.slug}`,
      parentId: page.parentId
    };
    
    const newPage = await createWebflowPage(newPageData, env.WEBFLOW_TOKEN, env.WEBFLOW_SITE_ID);
    
    // 5. Apply translated content to new page (including link updates)
    const updatedContent = applyTranslations(pageContent, translatedContent, targetLanguage);
    await updatePageContent(newPage.id, updatedContent, env.WEBFLOW_TOKEN);
    
    // 6. Update SEO metadata
    if (translatedContent.seo) {
      await updatePageSEO(newPage.id, translatedContent.seo, env.WEBFLOW_TOKEN);
    }
    
    // 7. Store success status with cost info
    await env.TRANSLATION_STATUS.put(
      `${page.id}-${targetLanguage}`, 
      JSON.stringify({
        status: 'completed',
        timestamp: new Date().toISOString(),
        originalSlug: page.slug,
        targetLanguage,
        cost: totalCost,
        newPageId: newPage.id,
        fallbackUsed: false
      })
    );
    
    console.log(`✅ Created translated page: /${targetLanguage}/${page.slug} (Cost: ${totalCost.toFixed(4)})`);
    return { ...newPage, cost: totalCost };
    
  } catch (error) {
    console.error(`❌ Translation failed for ${page.slug}:`, error);
    
    // Try fallback: create page with original content
    try {
      console.log(`🔄 Attempting fallback for ${page.slug}...`);
      
      const newPageData = {
        title: `${page.title} (${targetLanguage.toUpperCase()})`,
        slug: `${targetLanguage}/${page.slug}`,
        parentId: page.parentId
      };
      
      const fallbackPage = await createWebflowPage(newPageData, env.WEBFLOW_TOKEN, env.WEBFLOW_SITE_ID);
      
      // Copy original content as-is
      const originalContent = await getPageContent(page.id, env.WEBFLOW_TOKEN);
      await updatePageContent(fallbackPage.id, originalContent, env.WEBFLOW_TOKEN);
      
      fallbackUsed = true;
      
      // Store fallback status
      await env.TRANSLATION_STATUS.put(
        `${page.id}-${targetLanguage}`, 
        JSON.stringify({
          status: 'fallback',
          timestamp: new Date().toISOString(),
          originalSlug: page.slug,
          targetLanguage,
          error: error.message,
          newPageId: fallbackPage.id,
          fallbackUsed: true
        })
      );
      
      // Send notification email about fallback
      await sendFailureNotification(page.slug, targetLanguage, error.message, true, env);
      
      console.log(`⚠️ Created fallback page: /${targetLanguage}/${page.slug}`);
      return { ...fallbackPage, fallbackUsed: true, error: error.message };
      
    } catch (fallbackError) {
      console.error(`❌ Fallback also failed for ${page.slug}:`, fallbackError);
      
      // Send notification about complete failure
      await sendFailureNotification(page.slug, targetLanguage, error.message, false, env);
      
      throw new Error(`Translation and fallback both failed: ${error.message}`);
    }
  }
}

async function sendFailureNotification(pageSlug, targetLanguage, errorMessage, fallbackSucceeded, env) {
  try {
    const subject = fallbackSucceeded 
      ? `⚠️ Translation fallback used for ${pageSlug}`
      : `❌ Complete translation failure for ${pageSlug}`;
    
    const body = fallbackSucceeded
      ? `Translation failed for ${pageSlug} → ${targetLanguage}, but fallback page created successfully.
      
Error: ${errorMessage}
Page: /${targetLanguage}/${pageSlug}
Status: Original content copied, manual translation needed.

Please review and manually translate this page when possible.`
      : `Complete failure for ${pageSlug} → ${targetLanguage}. No page was created.
      
Error: ${errorMessage}
Action needed: Manual intervention required.`;

    // This would integrate with your email service
    // For now, just log the notification
    console.log(`📧 Email notification: ${subject}`);
    console.log(body);
    
    // Store notification in KV for dashboard visibility
    await env.TRANSLATION_STATUS.put(
      `notification-${Date.now()}`,
      JSON.stringify({
        type: fallbackSucceeded ? 'warning' : 'error',
        pageSlug,
        targetLanguage,
        errorMessage,
        timestamp: new Date().toISOString(),
        fallbackSucceeded
      })
    );
    
  } catch (notificationError) {
    console.error('Failed to send notification:', notificationError);
  }
}

async function updateTranslatedPage(page, env) {
  console.log(`Updating translated page: ${page.slug}`);
  
  // Find the original page (remove language prefix)
  const originalSlug = page.slug.replace(/^[a-z]{2}\//, '');
  const originalPages = await getWebflowPages(env.WEBFLOW_API_TOKEN, env.WEBFLOW_SITE_ID);
  const originalPage = originalPages.find(p => p.slug === originalSlug);
  
  if (!originalPage) {
    throw new Error(`Original page not found for ${page.slug}`);
  }
  
  // Extract language from current page slug
  const targetLanguage = page.slug.split('/')[0];
  
  // Follow same translation process but update existing page
  const pageContent = await getPageContent(originalPage.id, env.WEBFLOW_API_TOKEN);
  const translatableContent = extractTranslatableContent(pageContent);
  const translatedContent = await translateWithOpenAI(
    translatableContent, 
    targetLanguage, 
    env.OPENAI_API_KEY
  );
  
  const updatedContent = applyTranslations(pageContent, translatedContent);
  await updatePageContent(page.id, updatedContent, env.WEBFLOW_API_TOKEN);
  
  if (translatedContent.seo) {
    await updatePageSEO(page.id, translatedContent.seo, env.WEBFLOW_API_TOKEN);
  }
  
  console.log(`✅ Updated translated page: ${page.slug}`);
}

async function getPageContent(pageId, apiToken) {
  const response = await fetch(`https://api.webflow.com/v2/pages/${pageId}/dom`, {
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to get page content: ${response.status}`);
  }

  return await response.json();
}

function extractTranslatableContent(pageContent) {
  const content = {
    title: pageContent.title || '',
    texts: [],
    links: [],
    seo: {
      title: pageContent.seo?.title || '',
      description: pageContent.seo?.description || ''
    }
  };

  // Recursively extract text and links from DOM nodes
  function extractFromNodes(nodes) {
    if (!nodes) return;
    
    for (const node of nodes) {
      // Extract translatable text
      if (node.text && node.text.trim()) {
        content.texts.push({
          id: node.id || Math.random().toString(36),
          text: node.text,
          tag: node.tag,
          attributes: node.attributes || {}
        });
      }
      
      // Extract and process links
      if (node.tag === 'a' && node.attributes?.href) {
        const href = node.attributes.href;
        const processedLink = processLinkForLocalization(href);
        
        content.links.push({
          id: node.id || Math.random().toString(36),
          originalHref: href,
          newHref: processedLink.newHref,
          shouldUpdate: processedLink.shouldUpdate,
          linkType: processedLink.linkType
        });
      }
      
      if (node.children) {
        extractFromNodes(node.children);
      }
    }
  }

  if (pageContent.nodes) {
    extractFromNodes(pageContent.nodes);
  }

  return content;
}

function processLinkForLocalization(href, targetLanguage = 'de') {
  // Handle different link types based on your requirements
  
  // Checkout links - add language prefix
  if (href.includes('checkout.hairqare.co/buy/')) {
    return {
      newHref: href.replace('checkout.hairqare.co/buy/', `checkout.hairqare.co/${targetLanguage}/buy/`),
      shouldUpdate: true,
      linkType: 'checkout'
    };
  }
  
  // Quiz links - add language prefix  
  if (href.includes('join.hairqare.co/') && !href.includes(`/${targetLanguage}/`)) {
    return {
      newHref: href.replace('join.hairqare.co/', `join.hairqare.co/${targetLanguage}/`),
      shouldUpdate: true,
      linkType: 'quiz'
    };
  }
  
  // Internal relative links that should be localized (same domain pages)
  if (href.startsWith('/') && !href.startsWith(`/${targetLanguage}/`)) {
    return {
      newHref: `/${targetLanguage}${href}`,
      shouldUpdate: true,
      linkType: 'internal'
    };
  }
  
  // External links and other cases - don't modify
  return {
    newHref: href,
    shouldUpdate: false,
    linkType: 'external'
  };
}

async function translateWithOpenAI(content, targetLanguage, apiKey) {
  const languageNames = {
    de: 'German',
    fr: 'French',
    es: 'Spanish',
    it: 'Italian',
    pt: 'Portuguese',
    nl: 'Dutch'
  };

  const prompt = `Translate the following web page content to ${languageNames[targetLanguage]}. 
Maintain the tone and style appropriate for a website. Keep HTML tags intact if present.
Preserve brand names and technical terms where appropriate.
This is for a hair care brand, so maintain brand consistency.

Content to translate:
Title: ${content.title}
SEO Title: ${content.seo.title}
SEO Description: ${content.seo.description}

Text content:
${content.texts.map(t => `${t.id}: ${t.text}`).join('\n')}

Return the response as JSON with this structure:
{
  "title": "translated title",
  "seo": {
    "title": "translated seo title", 
    "description": "translated seo description"
  },
  "texts": [
    {"id": "text_id", "text": "translated text"}
  ]
}`;

  const startTime = Date.now();
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional web content translator specializing in e-commerce and hair care content. Always respond with valid JSON. Maintain brand voice and marketing effectiveness.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3
    })
  });

  const endTime = Date.now();
  const processingTime = endTime - startTime;

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  
  // Calculate cost (approximate for GPT-4o-mini)
  const inputTokens = data.usage?.prompt_tokens || 0;
  const outputTokens = data.usage?.completion_tokens || 0;
  const estimatedCost = (inputTokens * 0.00015 / 1000) + (outputTokens * 0.0006 / 1000); // GPT-4o-mini pricing
  
  console.log(`Translation cost: ${estimatedCost.toFixed(4)} | Time: ${processingTime}ms | Tokens: ${inputTokens + outputTokens}`);
  
  const translatedContent = JSON.parse(data.choices[0].message.content);
  
  // Add cost tracking
  translatedContent._metadata = {
    cost: estimatedCost,
    tokens: inputTokens + outputTokens,
    processingTime
  };
  
  return translatedContent;
}

function applyTranslations(originalContent, translations, targetLanguage = 'de') {
  // Create mappings
  const textMap = {};
  translations.texts.forEach(t => {
    textMap[t.id] = t.text;
  });
  
  const linkMap = {};
  if (originalContent.links) {
    originalContent.links.forEach(link => {
      linkMap[link.id] = link;
    });
  }

  // Recursively update nodes with translations and link updates
  function updateNodes(nodes) {
    if (!nodes) return nodes;
    
    return nodes.map(node => {
      const updatedNode = { ...node };
      
      // Update translatable text
      if (updatedNode.text && textMap[updatedNode.id]) {
        updatedNode.text = textMap[updatedNode.id];
      }
      
      // Update links for checkout/quiz/internal pages
      if (updatedNode.tag === 'a' && updatedNode.attributes?.href) {
        const linkInfo = linkMap[updatedNode.id];
        if (linkInfo && linkInfo.shouldUpdate) {
          updatedNode.attributes = {
            ...updatedNode.attributes,
            href: linkInfo.newHref
          };
          console.log(`Updated ${linkInfo.linkType} link: ${linkInfo.originalHref} → ${linkInfo.newHref}`);
        }
      }
      
      // Preserve all other attributes
      if (updatedNode.attributes) {
        updatedNode.attributes = { ...updatedNode.attributes };
      }
      
      if (updatedNode.children) {
        updatedNode.children = updateNodes(updatedNode.children);
      }
      
      return updatedNode;
    });
  }

  return {
    ...originalContent,
    title: translations.title,
    nodes: updateNodes(originalContent.nodes)
  };
}

async function createWebflowPage(pageData, apiToken, siteId) {
  const response = await fetch(`https://api.webflow.com/v2/sites/${siteId}/pages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pageData)
  });

  if (!response.ok) {
    throw new Error(`Failed to create page: ${response.status}`);
  }

  return await response.json();
}

async function updatePageContent(pageId, content, apiToken) {
  const response = await fetch(`https://api.webflow.com/v2/pages/${pageId}/dom`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nodes: content.nodes })
  });

  if (!response.ok) {
    throw new Error(`Failed to update page content: ${response.status}`);
  }

  return await response.json();
}

async function updatePageSEO(pageId, seoData, apiToken) {
  const response = await fetch(`https://api.webflow.com/v2/pages/${pageId}/settings`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      seo: seoData
    })
  });

  if (!response.ok) {
    console.warn(`Failed to update SEO for page ${pageId}: ${response.status}`);
  }
}