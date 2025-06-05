#!/usr/bin/env node

// Comprehensive Webflow API Guide
// This script demonstrates all key Webflow API v2 operations

const fetch = require('node-fetch') || global.fetch;

const WEBFLOW_TOKEN = process.env.WEBFLOW_TOKEN || '916a2cf88a0b2b44ae5a03850e8f731b582b2943f132004e25d3bd7f8459dfbb';
const SITE_ID = '62cbaa353a301eb715aa33d0';

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m'
};

function log(message, type = 'info') {
    const typeColors = {
        info: colors.blue,
        success: colors.green,
        warning: colors.yellow,
        error: colors.red
    };
    console.log(`${typeColors[type]}${message}${colors.reset}`);
}

// 1. Get Site Information
async function getSiteInfo() {
    log('\n=== Getting Site Information ===', 'info');
    
    try {
        const response = await fetch(`https://api.webflow.com/v2/sites/${SITE_ID}`, {
            headers: {
                'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const site = await response.json();
        log(`Site Name: ${site.displayName}`, 'success');
        log(`Site ID: ${site.id}`, 'success');
        log(`Custom Domains: ${site.customDomains?.join(', ') || 'None'}`, 'success');
        
        return site;
    } catch (error) {
        log(`Error fetching site info: ${error.message}`, 'error');
    }
}

// 2. List All Collections
async function listCollections() {
    log('\n=== Listing All Collections ===', 'info');
    
    try {
        const response = await fetch(`https://api.webflow.com/v2/sites/${SITE_ID}/collections`, {
            headers: {
                'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        const collections = data.collections || [];
        
        log(`Found ${collections.length} collections:`, 'success');
        collections.forEach(col => {
            console.log(`  - ${col.displayName} (ID: ${col.id}, Slug: ${col.slug})`);
        });
        
        return collections;
    } catch (error) {
        log(`Error fetching collections: ${error.message}`, 'error');
        return [];
    }
}

// 3. List All Pages (Static Pages)
async function listPages() {
    log('\n=== Listing All Static Pages ===', 'info');
    
    try {
        const response = await fetch(`https://api.webflow.com/v2/sites/${SITE_ID}/pages`, {
            headers: {
                'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        const pages = data.pages || [];
        
        log(`Found ${pages.length} static pages:`, 'success');
        pages.slice(0, 10).forEach(page => {
            console.log(`  - ${page.title} (Slug: /${page.slug}, ID: ${page.id})`);
        });
        if (pages.length > 10) {
            console.log(`  ... and ${pages.length - 10} more`);
        }
        
        return pages;
    } catch (error) {
        log(`Error fetching pages: ${error.message}`, 'error');
        return [];
    }
}

// 4. Create a Static Page
async function createStaticPage(title, slug) {
    log(`\n=== Creating Static Page: ${title} ===`, 'info');
    
    const pageData = {
        title: title,
        slug: slug,
        parentId: null  // Set this to a page ID to create nested pages
    };
    
    try {
        const response = await fetch(`https://api.webflow.com/v2/sites/${SITE_ID}/pages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pageData)
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`HTTP ${response.status}: ${error}`);
        }
        
        const page = await response.json();
        log(`✅ Created page: ${page.title}`, 'success');
        log(`   URL: /${page.slug}`, 'success');
        log(`   ID: ${page.id}`, 'success');
        
        return page;
    } catch (error) {
        log(`Error creating page: ${error.message}`, 'error');
        return null;
    }
}

// 5. Create a Collection Item (CMS Item)
async function createCollectionItem(collectionId, itemData) {
    log(`\n=== Creating Collection Item ===`, 'info');
    
    try {
        const response = await fetch(`https://api.webflow.com/v2/collections/${collectionId}/items`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                isArchived: false,
                isDraft: false,
                fieldData: itemData
            })
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`HTTP ${response.status}: ${error}`);
        }
        
        const item = await response.json();
        log(`✅ Created collection item`, 'success');
        log(`   ID: ${item.id}`, 'success');
        
        return item;
    } catch (error) {
        log(`Error creating collection item: ${error.message}`, 'error');
        return null;
    }
}

// 6. Get Page DOM Content
async function getPageDOM(pageId) {
    log(`\n=== Getting Page DOM ===`, 'info');
    
    try {
        const response = await fetch(`https://api.webflow.com/v2/pages/${pageId}/dom`, {
            headers: {
                'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const dom = await response.json();
        log(`✅ Retrieved DOM for page`, 'success');
        log(`   Nodes: ${dom.nodes?.length || 0}`, 'success');
        
        return dom;
    } catch (error) {
        log(`Error fetching DOM: ${error.message}`, 'error');
        return null;
    }
}

// 7. Update Page DOM Content
async function updatePageDOM(pageId, domContent) {
    log(`\n=== Updating Page DOM ===`, 'info');
    
    try {
        const response = await fetch(`https://api.webflow.com/v2/pages/${pageId}/dom`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(domContent)
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`HTTP ${response.status}: ${error}`);
        }
        
        log(`✅ Updated page DOM`, 'success');
        return true;
    } catch (error) {
        log(`Error updating DOM: ${error.message}`, 'error');
        return false;
    }
}

// Main function with examples
async function main() {
    log(`${colors.bright}=== Webflow API v2 Complete Guide ===${colors.reset}\n`);
    
    // Get command line arguments
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
        case 'info':
            await getSiteInfo();
            break;
            
        case 'collections':
            await listCollections();
            break;
            
        case 'pages':
            await listPages();
            break;
            
        case 'create-page':
            const title = args[1] || 'Test Page';
            const slug = args[2] || `test-page-${Date.now()}`;
            await createStaticPage(title, slug);
            break;
            
        case 'all':
            await getSiteInfo();
            await listCollections();
            await listPages();
            break;
            
        default:
            console.log(`
${colors.bright}Usage:${colors.reset}
  node webflow-api-guide.js <command> [options]

${colors.bright}Commands:${colors.reset}
  info          - Get site information
  collections   - List all collections
  pages         - List all static pages
  create-page   - Create a test page
                  Usage: create-page "Page Title" "page-slug"
  all           - Run all information commands

${colors.bright}Key Points:${colors.reset}
  1. Static pages are created with POST /sites/{site_id}/pages
     - No collection ID needed for static pages
     - Required: title, slug
     - Optional: parentId (for nested pages)
  
  2. CMS/Collection items are created with POST /collections/{collection_id}/items
     - Requires collection ID
     - Creates dynamic content, not pages
  
  3. The translation system creates static pages, not collection items

${colors.bright}Environment Variables:${colors.reset}
  WEBFLOW_TOKEN - Your Webflow API token (currently using default)
            `);
    }
}

// Run the script
main().catch(error => {
    log(`Fatal error: ${error.message}`, 'error');
    process.exit(1);
});