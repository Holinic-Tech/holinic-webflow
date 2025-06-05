#!/usr/bin/env node

// Direct translation script that runs in GitHub Actions (US region)
// This bypasses Cloudflare Workers to avoid region restrictions

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Get inputs from environment or command line
const urlPatterns = process.env.URL_PATTERNS ? process.env.URL_PATTERNS.split('\n').filter(p => p.trim()) : ['the-haircare-challenge'];
const targetLanguage = process.env.TARGET_LANGUAGE || 'de';
const action = process.env.ACTION || 'translate';

// API keys from environment
const WEBFLOW_TOKEN = process.env.WEBFLOW_TOKEN || '916a2cf88a0b2b44ae5a03850e8f731b582b2943f132004e25d3bd7f8459dfbb';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const WEBFLOW_SITE_ID = '62cbaa353a301eb715aa33d0';

console.log('🚀 Starting direct translation...');
console.log(`Target language: ${targetLanguage}`);
console.log(`URL patterns: ${urlPatterns.join(', ')}`);
console.log(`Action: ${action}`);

async function getWebflowPages() {
  const response = await fetch(`https://api.webflow.com/v2/sites/${WEBFLOW_SITE_ID}/pages`, {
    headers: {
      'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Webflow API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.pages || [];
}

function filterPagesByPatterns(pages, patterns) {
  return pages.filter(page => {
    const slug = page.slug || '';
    
    return patterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(slug);
      } else {
        return slug === pattern;
      }
    });
  });
}

async function getPageContent(pageId) {
  const response = await fetch(`https://api.webflow.com/v2/pages/${pageId}/dom`, {
    headers: {
      'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get page content: ${response.status} - ${errorText}`);
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

  function extractFromNodes(nodes) {
    if (!nodes || !Array.isArray(nodes)) return;
    
    for (const node of nodes) {
      if (node.text !== undefined && node.text !== null) {
        let textContent = '';
        let htmlContent = '';
        
        if (typeof node.text === 'object' && node.text.text) {
          textContent = node.text.text;
          htmlContent = node.text.html || '';
        } else if (typeof node.text === 'string') {
          textContent = node.text;
          htmlContent = node.text;
        }
        
        if (textContent && textContent.trim()) {
          content.texts.push({
            id: node.id || Math.random().toString(36),
            text: textContent,
            html: htmlContent,
            tag: node.tag,
            attributes: node.attributes || {}
          });
        }
      }
      
      if (node.tag === 'a' && node.attributes?.href) {
        const href = node.attributes.href;
        content.links.push({
          id: node.id || Math.random().toString(36),
          originalHref: href,
          newHref: processLinkForLocalization(href, targetLanguage),
          shouldUpdate: shouldUpdateLink(href),
          linkType: getLinkType(href)
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

function processLinkForLocalization(href, lang) {
  if (href.includes('checkout.hairqare.co/buy/')) {
    return href.replace('checkout.hairqare.co/buy/', `checkout.hairqare.co/${lang}/buy/`);
  }
  
  if (href.includes('join.hairqare.co/') && !href.includes(`/${lang}/`)) {
    return href.replace('join.hairqare.co/', `join.hairqare.co/${lang}/`);
  }
  
  if (href.startsWith('/') && !href.startsWith(`/${lang}/`)) {
    return `/${lang}${href}`;
  }
  
  return href;
}

function shouldUpdateLink(href) {
  return href.includes('checkout.hairqare.co') || 
         href.includes('join.hairqare.co') || 
         href.startsWith('/');
}

function getLinkType(href) {
  if (href.includes('checkout.hairqare.co')) return 'checkout';
  if (href.includes('join.hairqare.co')) return 'quiz';
  if (href.startsWith('/')) return 'internal';
  return 'external';
}

async function translateWithOpenAI(content, targetLanguage) {
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

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
      'OpenAI-Organization': 'org-28gTXkK79Dwavp7PrHOIqG1e',
      'OpenAI-Project': 'proj_wZf0IPqwIEKAtsjFZDoq5KTa'
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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  let messageContent = data.choices[0].message.content;
  
  // Handle markdown-wrapped JSON
  if (messageContent.includes('```json')) {
    messageContent = messageContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  } else if (messageContent.includes('```')) {
    messageContent = messageContent.replace(/```\n?/g, '').trim();
  }
  
  const translatedContent = JSON.parse(messageContent);
  
  const inputTokens = data.usage.prompt_tokens;
  const outputTokens = data.usage.completion_tokens;
  const cost = (inputTokens / 1000000) * 0.15 + (outputTokens / 1000000) * 0.60;
  
  return { translations: translatedContent, cost };
}

function applyTranslations(originalContent, translations, links) {
  const textMap = {};
  translations.texts.forEach(t => {
    textMap[t.id] = t.text;
  });
  
  const linkMap = {};
  links.forEach(link => {
    linkMap[link.id] = link;
  });
  
  function updateNodes(nodes) {
    if (!nodes || !Array.isArray(nodes)) return nodes;
    
    return nodes.map(node => {
      const updatedNode = { ...node };
      
      if (updatedNode.text !== undefined && updatedNode.text !== null && textMap[updatedNode.id]) {
        const translatedText = textMap[updatedNode.id];
        
        if (typeof updatedNode.text === 'object' && updatedNode.text.text) {
          updatedNode.text = {
            ...updatedNode.text,
            text: translatedText,
            html: translatedText
          };
        } else {
          updatedNode.text = translatedText;
        }
      }
      
      if (updatedNode.tag === 'a' && updatedNode.attributes?.href) {
        const linkInfo = linkMap[updatedNode.id];
        if (linkInfo && linkInfo.shouldUpdate) {
          updatedNode.attributes = {
            ...updatedNode.attributes,
            href: linkInfo.newHref
          };
        }
      }
      
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

async function createWebflowPage(pageData) {
  // Note: Webflow API v2 doesn't support creating static pages programmatically
  // We'll simulate the creation and provide instructions for manual creation
  console.log(`📝 Page creation simulation: ${pageData.slug}`);
  console.log(`   Title: ${pageData.title}`);
  console.log(`   Slug: ${pageData.slug}`);
  console.log(`   ⚠️  Manual creation required in Webflow dashboard`);
  
  return {
    id: 'manual-creation-required',
    slug: pageData.slug,
    title: pageData.title,
    manual: true
  };
}

async function updatePageContent(pageId, content) {
  if (pageId === 'manual-creation-required') {
    // Save translated content to a file for manual import
    console.log(`💾 Saving translated content for manual import...`);
    return { saved: true, content };
  }

  const response = await fetch(`https://api.webflow.com/v2/pages/${pageId}/dom`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(content)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update page content: ${response.status}`);
  }

  return await response.json();
}

async function translatePage(page) {
  console.log(`\nTranslating page: ${page.slug} to ${targetLanguage}`);
  
  try {
    const pageContent = await getPageContent(page.id);
    const content = extractTranslatableContent(pageContent);
    
    console.log(`Extracted ${content.texts.length} text nodes and ${content.links.length} links`);
    
    const { translations, cost } = await translateWithOpenAI(content, targetLanguage);
    
    const newPageData = {
      title: translations.title,
      slug: `${targetLanguage}-${page.slug}`,
      parentId: null
    };
    
    console.log(`Creating new page: ${newPageData.slug}`);
    const newPage = await createWebflowPage(newPageData);
    
    const updatedContent = applyTranslations(pageContent, translations, content.links);
    const updateResult = await updatePageContent(newPage.id, updatedContent);
    
    if (newPage.manual) {
      console.log(`✅ Translation completed: ${page.slug} → ${newPage.slug} (Cost: $${cost.toFixed(4)})`);
      console.log(`📋 Manual steps required:`);
      console.log(`   1. Create new page in Webflow with slug: ${newPage.slug}`);
      console.log(`   2. Copy content from original page: ${page.slug}`);
      console.log(`   3. Apply translations (saved to output)`);
      
      return { 
        success: true, 
        slug: page.slug, 
        newSlug: newPage.slug, 
        cost,
        manual: true,
        translations: translations,
        translatedContent: updatedContent
      };
    } else {
      console.log(`✅ Successfully translated: ${page.slug} → ${newPage.slug} (Cost: $${cost.toFixed(4)})`);
      return { success: true, slug: page.slug, newSlug: newPage.slug, cost };
    }
    
  } catch (error) {
    console.error(`❌ Failed to translate ${page.slug}:`, error.message);
    return { success: false, slug: page.slug, error: error.message };
  }
}

async function main() {
  if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY is required');
    process.exit(1);
  }

  const results = {
    success: [],
    failed: [],
    totalCost: 0
  };

  try {
    console.log('\nFetching pages from Webflow...');
    const pages = await getWebflowPages();
    console.log(`Total pages: ${pages.length}`);
    
    const matchingPages = filterPagesByPatterns(pages, urlPatterns);
    console.log(`Matching pages: ${matchingPages.length}`);
    
    if (matchingPages.length === 0) {
      console.log('❌ No pages match the provided patterns');
      process.exit(1);
    }
    
    for (const page of matchingPages) {
      const result = await translatePage(page);
      
      if (result.success) {
        results.success.push(result);
        results.totalCost += result.cost || 0;
      } else {
        results.failed.push(result);
      }
      
      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n📊 Summary:');
    console.log(`✅ Success: ${results.success.length} pages`);
    console.log(`❌ Failed: ${results.failed.length} pages`);
    console.log(`💰 Total cost: $${results.totalCost.toFixed(4)}`);
    
    if (results.failed.length > 0) {
      console.log('\nFailed pages:');
      results.failed.forEach(f => console.log(`- ${f.slug}: ${f.error}`));
    }
    
    // Save translations to files for manual import
    const outputDir = path.join(process.cwd(), 'translations', targetLanguage);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    results.success.forEach(result => {
      if (result.manual && result.translations) {
        const filename = `${result.slug}-${targetLanguage}.json`;
        const filepath = path.join(outputDir, filename);
        
        const output = {
          originalSlug: result.slug,
          newSlug: result.newSlug,
          targetLanguage,
          cost: result.cost,
          translations: result.translations,
          manualSteps: [
            `1. Create new page in Webflow with slug: ${result.newSlug}`,
            `2. Set page title to: ${result.translations.title}`,
            `3. Copy content from original page: ${result.slug}`,
            `4. Apply text translations using the mapping below`,
            `5. Update SEO title and description`
          ]
        };
        
        fs.writeFileSync(filepath, JSON.stringify(output, null, 2));
        console.log(`💾 Saved translation file: ${filepath}`);
      }
    });
    
    // Output for GitHub Actions
    console.log(`::set-output name=results::${JSON.stringify(results)}`);
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

main();