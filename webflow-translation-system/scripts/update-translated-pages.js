#!/usr/bin/env node

// Update manually created translated pages with translation content

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const WEBFLOW_TOKEN = process.env.WEBFLOW_TOKEN || '916a2cf88a0b2b44ae5a03850e8f731b582b2943f132004e25d3bd7f8459dfbb';
const SITE_ID = '62cbaa353a301eb715aa33d0';

async function getWebflowPages() {
  const response = await fetch(`https://api.webflow.com/v2/sites/${SITE_ID}/pages`, {
    headers: {
      'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to get pages: ${response.status}`);
  }

  const data = await response.json();
  return data.pages || [];
}

async function getPageContent(pageId) {
  const response = await fetch(`https://api.webflow.com/v2/pages/${pageId}/dom`, {
    headers: {
      'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to get page content: ${response.status}`);
  }

  return await response.json();
}

async function updatePageContent(pageId, content) {
  const response = await fetch(`https://api.webflow.com/v2/pages/${pageId}/dom`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(content)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update page content: ${response.status} - ${error}`);
  }

  return await response.json();
}

function applyTranslations(originalContent, translations) {
  // Create a map of text IDs to translations
  const textMap = {};
  translations.texts.forEach(t => {
    textMap[t.id] = t.text;
  });
  
  // Recursively update nodes
  function updateNodes(nodes) {
    if (!nodes || !Array.isArray(nodes)) return nodes;
    
    return nodes.map(node => {
      const updatedNode = { ...node };
      
      // Update text content if we have a translation
      if (updatedNode.id && textMap[updatedNode.id] && updatedNode.text !== undefined) {
        // Handle Webflow v2 API text structure
        if (typeof updatedNode.text === 'object' && updatedNode.text.text) {
          updatedNode.text = {
            ...updatedNode.text,
            text: textMap[updatedNode.id],
            html: textMap[updatedNode.id]
          };
        } else {
          updatedNode.text = textMap[updatedNode.id];
        }
      }
      
      // Recursively update children
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

async function updateTranslatedPage(translatedPage, translationFile) {
  console.log(`\nUpdating page: ${translatedPage.slug}`);
  
  try {
    // Load translation data
    const translationData = JSON.parse(fs.readFileSync(translationFile, 'utf8'));
    
    // Get current page content
    const currentContent = await getPageContent(translatedPage.id);
    
    // Apply translations
    const updatedContent = applyTranslations(currentContent, translationData.translations);
    
    // Update the page
    await updatePageContent(translatedPage.id, updatedContent);
    
    console.log(`✅ Successfully updated: ${translatedPage.slug}`);
    return { success: true, page: translatedPage.slug };
    
  } catch (error) {
    console.error(`❌ Failed to update ${translatedPage.slug}: ${error.message}`);
    return { success: false, page: translatedPage.slug, error: error.message };
  }
}

async function main() {
  const language = process.argv[2] || 'de';
  const specificSlug = process.argv[3]; // Optional: update only a specific page
  
  console.log(`🔄 Updating ${language} translated pages...`);
  console.log(`Looking for translation files in: translations/${language}/`);
  
  const results = {
    success: [],
    failed: [],
    notFound: []
  };
  
  try {
    // Get all pages from Webflow
    const pages = await getWebflowPages();
    console.log(`Found ${pages.length} total pages in Webflow`);
    
    // Filter for translated pages matching the language pattern
    const translatedPages = pages.filter(page => {
      if (specificSlug) {
        return page.slug === `${language}-${specificSlug}`;
      }
      return page.slug.startsWith(`${language}-`);
    });
    
    console.log(`Found ${translatedPages.length} ${language} translated pages`);
    
    if (translatedPages.length === 0) {
      console.log(`\n⚠️  No pages found with ${language}- prefix`);
      console.log('\nMake sure you have:');
      console.log(`1. Created pages in Webflow with slugs like: ${language}-the-haircare-challenge`);
      console.log('2. Published or saved the pages');
      return;
    }
    
    // Process each translated page
    for (const page of translatedPages) {
      // Extract original slug (remove language prefix)
      const originalSlug = page.slug.replace(`${language}-`, '');
      const translationFile = path.join('translations', language, `${originalSlug}-${language}.json`);
      
      if (fs.existsSync(translationFile)) {
        const result = await updateTranslatedPage(page, translationFile);
        if (result.success) {
          results.success.push(result.page);
        } else {
          results.failed.push(result);
        }
      } else {
        console.log(`⚠️  No translation file found for: ${page.slug}`);
        console.log(`   Expected: ${translationFile}`);
        results.notFound.push(page.slug);
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Summary
    console.log('\n📊 Update Summary:');
    console.log(`✅ Success: ${results.success.length} pages`);
    console.log(`❌ Failed: ${results.failed.length} pages`);
    console.log(`⚠️  Missing translations: ${results.notFound.length} pages`);
    
    if (results.failed.length > 0) {
      console.log('\nFailed updates:');
      results.failed.forEach(f => console.log(`- ${f.page}: ${f.error}`));
    }
    
    if (results.notFound.length > 0) {
      console.log('\nPages without translation files:');
      results.notFound.forEach(p => console.log(`- ${p}`));
    }
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Usage instructions
if (process.argv.includes('--help')) {
  console.log('Usage: node update-translated-pages.js [language] [specific-slug]');
  console.log('\nExamples:');
  console.log('  node update-translated-pages.js de                    # Update all German pages');
  console.log('  node update-translated-pages.js fr                    # Update all French pages');
  console.log('  node update-translated-pages.js de the-haircare-challenge  # Update specific page');
  console.log('\nPrerequisites:');
  console.log('1. Pages must already exist in Webflow with language prefix (e.g., de-the-haircare-challenge)');
  console.log('2. Translation files must exist in translations/[language]/ directory');
  process.exit(0);
}

main();