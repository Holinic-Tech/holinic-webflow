// worker-debug.js - Debug version with extensive logging for Webflow DOM API

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
      
      // Authentication check (relaxed for debug endpoint)
      const isDebugEndpoint = url.pathname.startsWith('/debug/');
      if (!isDebugEndpoint && !request.headers.get('Authorization')?.startsWith('Bearer ')) {
        return new Response('Unauthorized', { status: 401, headers: corsHeaders });
      }

      // Route handling
      if (url.pathname.startsWith('/debug/')) {
        return await handleDebug(request, env, url);
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
      console.error('Error stack:', error.stack);
      return new Response(JSON.stringify({ 
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

// DEBUG ENDPOINT - Fetch and analyze a single page
async function handleDebug(request, env, url) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    // Extract page slug from URL
    const pathParts = url.pathname.split('/');
    const pageSlug = pathParts[2]; // /debug/{pageSlug}
    
    if (!pageSlug) {
      return new Response(JSON.stringify({ 
        error: 'No page slug provided',
        usage: 'GET /debug/{pageSlug}'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`[DEBUG] Starting debug analysis for page: ${pageSlug}`);
    
    // Get the token from query params or env
    const urlParams = new URLSearchParams(url.search);
    const WEBFLOW_TOKEN = urlParams.get('token') || env.WEBFLOW_TOKEN;
    const WEBFLOW_SITE_ID = urlParams.get('siteId') || env.WEBFLOW_SITE_ID;
    
    if (!WEBFLOW_TOKEN || !WEBFLOW_SITE_ID) {
      return new Response(JSON.stringify({ 
        error: 'Missing Webflow token or site ID',
        help: 'Provide ?token=YOUR_TOKEN&siteId=YOUR_SITE_ID or set env variables'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`[DEBUG] Using Webflow Site ID: ${WEBFLOW_SITE_ID}`);
    console.log(`[DEBUG] Token provided: ${WEBFLOW_TOKEN ? 'Yes' : 'No'}`);

    // Step 1: Get all pages to find the target page
    console.log('[DEBUG] Fetching all pages from Webflow...');
    const pages = await getWebflowPagesDebug(WEBFLOW_TOKEN, WEBFLOW_SITE_ID);
    
    // Find the page by slug
    const targetPage = pages.find(p => p.slug === pageSlug);
    if (!targetPage) {
      return new Response(JSON.stringify({ 
        error: `Page not found: ${pageSlug}`,
        availablePages: pages.map(p => ({ id: p.id, slug: p.slug, title: p.title }))
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`[DEBUG] Found page:`, JSON.stringify(targetPage, null, 2));

    // Step 2: Get the page DOM content
    console.log(`[DEBUG] Fetching DOM content for page ID: ${targetPage.id}`);
    const pageContent = await getPageContentDebug(targetPage.id, WEBFLOW_TOKEN);
    
    // Step 3: Analyze the DOM structure
    console.log('[DEBUG] Analyzing DOM structure...');
    const analysis = analyzeDOMStructure(pageContent);
    
    // Step 4: Extract content with detailed logging
    console.log('[DEBUG] Extracting translatable content...');
    const extractedContent = extractTranslatableContentDebug(pageContent);
    
    // Step 5: Test link processing
    console.log('[DEBUG] Testing link processing...');
    const linkTests = testLinkProcessing(extractedContent.links);
    
    // Prepare comprehensive debug response
    const debugResponse = {
      pageInfo: {
        id: targetPage.id,
        slug: targetPage.slug,
        title: targetPage.title,
        parentId: targetPage.parentId
      },
      domStructure: {
        hasNodes: !!pageContent.nodes,
        nodesIsArray: Array.isArray(pageContent.nodes),
        nodeCount: pageContent.nodes?.length || 0,
        sampleNodes: pageContent.nodes?.slice(0, 3) || [],
        fullStructure: analysis
      },
      extractedContent: {
        title: extractedContent.title,
        textCount: extractedContent.texts.length,
        linkCount: extractedContent.links.length,
        sampleTexts: extractedContent.texts.slice(0, 5),
        sampleLinks: extractedContent.links.slice(0, 5),
        seo: extractedContent.seo
      },
      nodeTypeAnalysis: analysis.nodeTypes,
      textNodeAnalysis: analysis.textNodes,
      linkAnalysis: linkTests,
      rawPageContent: {
        // Include first 1000 chars of stringified content for inspection
        preview: JSON.stringify(pageContent).substring(0, 1000) + '...',
        fullSize: JSON.stringify(pageContent).length
      },
      debugTimestamp: new Date().toISOString()
    };

    console.log('[DEBUG] Debug analysis complete');
    
    return new Response(JSON.stringify(debugResponse, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('[DEBUG] Error in debug handler:', error);
    console.error('[DEBUG] Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack,
      type: error.constructor.name,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Debug version of getWebflowPages with extra logging
async function getWebflowPagesDebug(apiToken, siteId) {
  console.log(`[DEBUG] Calling Webflow API: GET /sites/${siteId}/pages`);
  
  const response = await fetch(`https://api.webflow.com/v2/sites/${siteId}/pages`, {
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Accept': 'application/json'
    }
  });

  console.log(`[DEBUG] Webflow API Response Status: ${response.status}`);
  console.log(`[DEBUG] Response Headers:`, Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[DEBUG] Webflow API error: ${response.status} - ${errorText}`);
    throw new Error(`Webflow API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log(`[DEBUG] Webflow returned ${data.pages?.length || 0} pages`);
  
  return data.pages || [];
}

// Debug version of getPageContent with extra logging
async function getPageContentDebug(pageId, apiToken) {
  console.log(`[DEBUG] Calling Webflow DOM API: GET /pages/${pageId}/dom`);
  
  const response = await fetch(`https://api.webflow.com/v2/pages/${pageId}/dom`, {
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Accept': 'application/json'
    }
  });

  console.log(`[DEBUG] Webflow DOM API Response Status: ${response.status}`);
  console.log(`[DEBUG] Response Headers:`, Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[DEBUG] Failed to get page content: ${response.status} - ${errorText}`);
    throw new Error(`Failed to get page content: ${response.status} - ${errorText}`);
  }

  const content = await response.json();
  console.log(`[DEBUG] Page content structure:`, {
    hasTitle: !!content.title,
    hasNodes: !!content.nodes,
    hasSeo: !!content.seo,
    topLevelKeys: Object.keys(content)
  });
  
  return content;
}

// Analyze DOM structure in detail
function analyzeDOMStructure(pageContent) {
  const analysis = {
    topLevelKeys: Object.keys(pageContent),
    nodeTypes: {},
    textNodes: {
      total: 0,
      byType: {},
      withNonStringText: []
    },
    maxDepth: 0,
    totalNodes: 0
  };

  function analyzeNodes(nodes, depth = 0) {
    if (!nodes || !Array.isArray(nodes)) {
      console.log(`[DEBUG] Invalid nodes at depth ${depth}:`, typeof nodes);
      return;
    }

    analysis.maxDepth = Math.max(analysis.maxDepth, depth);

    for (const node of nodes) {
      analysis.totalNodes++;
      
      // Track node types
      if (node.tag) {
        analysis.nodeTypes[node.tag] = (analysis.nodeTypes[node.tag] || 0) + 1;
      }
      
      // Analyze text nodes in detail
      if (node.text !== undefined && node.text !== null) {
        analysis.textNodes.total++;
        
        const textType = typeof node.text;
        analysis.textNodes.byType[textType] = (analysis.textNodes.byType[textType] || 0) + 1;
        
        // Log non-string text nodes for investigation
        if (textType !== 'string') {
          analysis.textNodes.withNonStringText.push({
            id: node.id,
            tag: node.tag,
            textType: textType,
            textValue: node.text,
            textValueStringified: JSON.stringify(node.text),
            attributes: node.attributes
          });
          
          console.log(`[DEBUG] Non-string text node found:`, {
            id: node.id,
            tag: node.tag,
            textType: textType,
            textValue: node.text,
            textIsArray: Array.isArray(node.text),
            textKeys: typeof node.text === 'object' ? Object.keys(node.text) : null
          });
        }
      }
      
      // Log the full structure of first few nodes at each level
      if (analysis.totalNodes <= 10) {
        console.log(`[DEBUG] Node ${analysis.totalNodes} at depth ${depth}:`, {
          id: node.id,
          tag: node.tag,
          hasText: node.text !== undefined,
          textType: typeof node.text,
          hasChildren: !!node.children,
          childrenCount: node.children?.length || 0,
          attributes: node.attributes,
          allKeys: Object.keys(node)
        });
      }
      
      if (node.children && Array.isArray(node.children)) {
        analyzeNodes(node.children, depth + 1);
      }
    }
  }

  if (pageContent.nodes) {
    analyzeNodes(pageContent.nodes);
  }

  return analysis;
}

// Debug version of extractTranslatableContent with detailed logging
function extractTranslatableContentDebug(pageContent) {
  console.log('[DEBUG] Starting content extraction...');
  
  const content = {
    title: pageContent.title || '',
    texts: [],
    links: [],
    seo: {
      title: pageContent.seo?.title || '',
      description: pageContent.seo?.description || ''
    }
  };

  let nodeCount = 0;
  let textNodeCount = 0;
  let linkNodeCount = 0;

  // Recursively extract text and links from DOM nodes
  function extractFromNodes(nodes, path = 'root') {
    if (!nodes || !Array.isArray(nodes)) {
      console.log(`[DEBUG] Invalid nodes at path ${path}:`, typeof nodes);
      return;
    }
    
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const nodePath = `${path}[${i}]`;
      nodeCount++;
      
      // Detailed logging for text extraction
      if (node.text !== undefined && node.text !== null) {
        const textType = typeof node.text;
        const isString = textType === 'string';
        const trimmedText = isString ? node.text.trim() : '';
        
        console.log(`[DEBUG] Text node at ${nodePath}:`, {
          id: node.id,
          tag: node.tag,
          textType: textType,
          isString: isString,
          textLength: isString ? node.text.length : 'N/A',
          trimmedLength: isString ? trimmedText.length : 'N/A',
          hasContent: isString && trimmedText.length > 0,
          preview: isString ? node.text.substring(0, 50) : JSON.stringify(node.text)
        });
        
        // Only process string text that has content
        if (isString && trimmedText) {
          textNodeCount++;
          content.texts.push({
            id: node.id || `generated_${Math.random().toString(36).substr(2, 9)}`,
            text: node.text,
            tag: node.tag,
            attributes: node.attributes || {},
            path: nodePath
          });
        } else if (!isString) {
          console.warn(`[DEBUG] Non-string text at ${nodePath}:`, node.text);
        }
      }
      
      // Extract and process links with logging
      if (node.tag === 'a' && node.attributes?.href) {
        linkNodeCount++;
        const href = node.attributes.href;
        const processedLink = processLinkForLocalizationDebug(href);
        
        console.log(`[DEBUG] Link at ${nodePath}:`, {
          id: node.id,
          href: href,
          processed: processedLink
        });
        
        content.links.push({
          id: node.id || `link_${Math.random().toString(36).substr(2, 9)}`,
          originalHref: href,
          newHref: processedLink.newHref,
          shouldUpdate: processedLink.shouldUpdate,
          linkType: processedLink.linkType,
          path: nodePath
        });
      }
      
      if (node.children && Array.isArray(node.children)) {
        extractFromNodes(node.children, `${nodePath}.children`);
      }
    }
  }

  if (pageContent.nodes && Array.isArray(pageContent.nodes)) {
    console.log(`[DEBUG] Processing ${pageContent.nodes.length} top-level nodes...`);
    extractFromNodes(pageContent.nodes);
  } else {
    console.warn('[DEBUG] No valid nodes array found in pageContent');
  }

  console.log('[DEBUG] Extraction complete:', {
    totalNodes: nodeCount,
    textNodes: textNodeCount,
    linkNodes: linkNodeCount,
    extractedTexts: content.texts.length,
    extractedLinks: content.links.length
  });

  return content;
}

// Debug version of link processing with logging
function processLinkForLocalizationDebug(href, targetLanguage = 'de') {
  console.log(`[DEBUG] Processing link: ${href}`);
  
  // Handle different link types based on your requirements
  
  // Checkout links - add language prefix
  if (href.includes('checkout.hairqare.co/buy/')) {
    const result = {
      newHref: href.replace('checkout.hairqare.co/buy/', `checkout.hairqare.co/${targetLanguage}/buy/`),
      shouldUpdate: true,
      linkType: 'checkout'
    };
    console.log(`[DEBUG] Checkout link processed:`, result);
    return result;
  }
  
  // Quiz links - add language prefix  
  if (href.includes('join.hairqare.co/') && !href.includes(`/${targetLanguage}/`)) {
    const result = {
      newHref: href.replace('join.hairqare.co/', `join.hairqare.co/${targetLanguage}/`),
      shouldUpdate: true,
      linkType: 'quiz'
    };
    console.log(`[DEBUG] Quiz link processed:`, result);
    return result;
  }
  
  // Internal relative links that should be localized (same domain pages)
  if (href.startsWith('/') && !href.startsWith(`/${targetLanguage}/`)) {
    const result = {
      newHref: `/${targetLanguage}${href}`,
      shouldUpdate: true,
      linkType: 'internal'
    };
    console.log(`[DEBUG] Internal link processed:`, result);
    return result;
  }
  
  // External links and other cases - don't modify
  const result = {
    newHref: href,
    shouldUpdate: false,
    linkType: 'external'
  };
  console.log(`[DEBUG] External/other link - no change:`, result);
  return result;
}

// Test link processing with various examples
function testLinkProcessing(extractedLinks) {
  const testLinks = [
    'https://checkout.hairqare.co/buy/product-123',
    'https://join.hairqare.co/quiz-start',
    '/about-us',
    '/de/already-translated',
    'https://external-site.com/page',
    'mailto:test@example.com',
    '#section-anchor'
  ];
  
  const results = {
    extractedLinksProcessed: extractedLinks,
    testCases: testLinks.map(href => ({
      original: href,
      processed: processLinkForLocalizationDebug(href, 'de')
    }))
  };
  
  return results;
}

// Include all the original functions from worker.js below for completeness
// (These are the same as in worker.js but included here to make this file standalone)

async function handleTranslation(request, env) {
  const body = await request.json();
  const { urlPatterns, targetLanguage, action, webflowToken, openaiKey } = body;
  
  // Use provided tokens from GitHub Actions
  const WEBFLOW_TOKEN = webflowToken || env.WEBFLOW_TOKEN;
  const OPENAI_API_KEY = openaiKey || env.OPENAI_API_KEY;
  
  console.log(`Starting ${action} for patterns:`, urlPatterns);
  console.log(`Using Webflow token: ${WEBFLOW_TOKEN ? 'Provided' : 'Missing'}`);
  console.log(`Using OpenAI key: ${OPENAI_API_KEY ? 'Provided' : 'Missing'}`);
  
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
    const pages = await getWebflowPages(WEBFLOW_TOKEN, env.WEBFLOW_SITE_ID);
    
    // Filter pages based on URL patterns
    const matchingPages = filterPagesByPatterns(pages, urlPatterns, action === 'update');
    
    console.log(`Found ${matchingPages.length} matching pages`);

    // Process pages sequentially (queued, not parallel)
    for (let i = 0; i < matchingPages.length; i++) {
      const page = matchingPages[i];
      console.log(`Processing ${i + 1}/${matchingPages.length}: ${page.slug}`);
      
      try {
        if (action === 'translate') {
          const result = await translatePage(page, targetLanguage, { 
            ...env, 
            WEBFLOW_TOKEN, 
            OPENAI_API_KEY 
          });
          
          results.success.push({
            slug: page.slug,
            newSlug: `${targetLanguage}/${page.slug}`,
            cost: result.cost || 0,
            fallbackUsed: result.fallbackUsed || false
          });
          
          results.totalCost += result.cost || 0;
          if (result.fallbackUsed) results.fallbacksUsed++;
          
        } else if (action === 'update') {
          const result = await updateTranslatedPage(page, { 
            ...env, 
            WEBFLOW_TOKEN, 
            OPENAI_API_KEY 
          });
          
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
    const errorText = await response.text();
    console.error(`Webflow API error: ${response.status} - ${errorText}`);
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
        // Exact match or contains pattern
        return slug === pattern || slug.includes(pattern);
      }
    });
  });
}

async function translatePage(page, targetLanguage, env) {
  console.log(`Translating page: ${page.slug} to ${targetLanguage}`);
  
  let totalCost = 0;
  let fallbackUsed = false;
  
  try {
    // Get the full page content from Webflow DOM API
    const pageContent = await getPageContent(page.id, env.WEBFLOW_TOKEN);
    
    // Extract translatable content
    const content = extractTranslatableContent(pageContent);
    
    console.log(`Extracted ${content.texts.length} text nodes and ${content.links.length} links`);
    
    // Translate content using OpenAI
    const { translations, cost } = await translateWithOpenAI(content, targetLanguage, env.OPENAI_API_KEY);
    totalCost += cost || 0;
    
    // Create new page with translated slug
    const newPageData = {
      title: translations.title,
      slug: `${targetLanguage}-${page.slug}`,
      parentId: page.parentId || env.WEBFLOW_FOLDER_ID || null
    };
    
    console.log(`Creating new page: ${newPageData.slug}`);
    const newPage = await createWebflowPage(newPageData, env.WEBFLOW_TOKEN, env.WEBFLOW_SITE_ID);
    
    // Update the new page's content with translated text and localized links
    const updatedContent = applyTranslations(pageContent, translations, content.links, targetLanguage);
    await updatePageContent(newPage.id, updatedContent, env.WEBFLOW_TOKEN);
    
    // Store translation record in KV
    await env.TRANSLATION_STATUS.put(
      `${page.id}-${targetLanguage}`, 
      JSON.stringify({
        status: 'success',
        timestamp: new Date().toISOString(),
        originalSlug: page.slug,
        targetLanguage,
        newPageId: newPage.id,
        cost: totalCost
      })
    );
    
    console.log(`✅ Successfully translated: ${page.slug} → ${newPage.slug}`);
    return { ...newPage, cost: totalCost };
    
  } catch (error) {
    console.error(`❌ Translation failed for ${page.slug}:`, error);
    
    // Try fallback: create page with original content
    try {
      console.log(`🔄 Attempting fallback for ${page.slug}...`);
      
      const newPageData = {
        title: `${page.title} (${targetLanguage.toUpperCase()})`,
        slug: `${targetLanguage}-${page.slug}`,
        parentId: page.parentId || env.WEBFLOW_FOLDER_ID || null
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
      
      console.log(`⚠️ Created fallback page: /${targetLanguage}-${page.slug}`);
      return { ...fallbackPage, fallbackUsed: true, error: error.message };
      
    } catch (fallbackError) {
      console.error(`❌ Fallback also failed for ${page.slug}:`, fallbackError);
      
      throw new Error(`Translation and fallback both failed: ${error.message}`);
    }
  }
}

async function updateTranslatedPage(page, env) {
  console.log(`Updating translated page: ${page.slug}`);
  
  // Find the original page (remove language prefix)
  const languagePrefix = page.slug.match(/^(de|fr|es|it|pt|nl)-/)?.[1];
  if (!languagePrefix) {
    throw new Error('Page does not have a language prefix');
  }
  
  const originalSlug = page.slug.replace(`${languagePrefix}-`, '');
  const originalPages = await getWebflowPages(env.WEBFLOW_TOKEN, env.WEBFLOW_SITE_ID);
  const originalPage = originalPages.find(p => p.slug === originalSlug);
  
  if (!originalPage) {
    throw new Error(`Original page not found: ${originalSlug}`);
  }
  
  // Get content from both pages
  const [originalContent, translatedContent] = await Promise.all([
    getPageContent(originalPage.id, env.WEBFLOW_TOKEN),
    getPageContent(page.id, env.WEBFLOW_TOKEN)
  ]);
  
  // Extract content and re-translate
  const content = extractTranslatableContent(originalContent);
  const { translations, cost } = await translateWithOpenAI(content, languagePrefix, env.OPENAI_API_KEY);
  
  // Apply translations to original content structure
  const updatedContent = applyTranslations(originalContent, translations, content.links, languagePrefix);
  
  // Update the translated page
  await updatePageContent(page.id, updatedContent, env.WEBFLOW_TOKEN);
  
  console.log(`✅ Successfully updated: ${page.slug}`);
  return { cost };
}

async function getPageContent(pageId, apiToken) {
  const response = await fetch(`https://api.webflow.com/v2/pages/${pageId}/dom`, {
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to get page content: ${response.status} - ${errorText}`);
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
    if (!nodes || !Array.isArray(nodes)) return;
    
    for (const node of nodes) {
      // Extract translatable text - FIX: Check if node.text exists and is a string
      if (node.text !== undefined && node.text !== null && typeof node.text === 'string' && node.text.trim()) {
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
      
      if (node.children && Array.isArray(node.children)) {
        extractFromNodes(node.children);
      }
    }
  }

  if (pageContent.nodes && Array.isArray(pageContent.nodes)) {
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
    const errorText = await response.text();
    console.error(`OpenAI API error: ${response.status} - ${errorText}`);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const translatedContent = JSON.parse(data.choices[0].message.content);
  
  // Calculate cost based on token usage
  const inputTokens = data.usage.prompt_tokens;
  const outputTokens = data.usage.completion_tokens;
  const cost = calculateCost(inputTokens, outputTokens);
  
  console.log(`Translation completed in ${processingTime}ms. Cost: $${cost.toFixed(4)}`);
  
  return { translations: translatedContent, cost };
}

function calculateCost(inputTokens, outputTokens) {
  // GPT-4o-mini pricing (as of the implementation)
  const INPUT_COST_PER_1M = 0.15;  // $0.15 per 1M input tokens
  const OUTPUT_COST_PER_1M = 0.60; // $0.60 per 1M output tokens
  
  const inputCost = (inputTokens / 1000000) * INPUT_COST_PER_1M;
  const outputCost = (outputTokens / 1000000) * OUTPUT_COST_PER_1M;
  
  return inputCost + outputCost;
}

function applyTranslations(originalContent, translations, links, targetLanguage) {
  // Create maps for efficient lookup
  const textMap = {};
  translations.texts.forEach(t => {
    textMap[t.id] = t.text;
  });
  
  const linkMap = {};
  links.forEach(link => {
    linkMap[link.id] = link;
  });
  
  // Function to recursively update nodes
  function updateNodes(nodes) {
    if (!nodes || !Array.isArray(nodes)) return nodes;
    
    return nodes.map(node => {
      const updatedNode = { ...node };
      
      // Update translatable text
      if (updatedNode.text !== undefined && updatedNode.text !== null && textMap[updatedNode.id]) {
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
      
      if (updatedNode.children && Array.isArray(updatedNode.children)) {
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
    const errorText = await response.text();
    console.error(`Failed to create page: ${response.status} - ${errorText}`);
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
    body: JSON.stringify(content)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to update page content: ${response.status} - ${errorText}`);
    throw new Error(`Failed to update page content: ${response.status}`);
  }

  return await response.json();
}