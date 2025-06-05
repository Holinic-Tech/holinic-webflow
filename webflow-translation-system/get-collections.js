#!/usr/bin/env node

// Script to get Webflow collections and create pages
// This helps identify collection IDs and understand page creation requirements

const WEBFLOW_TOKEN = process.env.WEBFLOW_TOKEN || '916a2cf88a0b2b44ae5a03850e8f731b582b2943f132004e25d3bd7f8459dfbb';
const SITE_ID = '62cbaa353a301eb715aa33d0';

async function getCollections() {
    console.log('Fetching collections from Webflow...\n');
    
    try {
        // Get all collections for the site
        const response = await fetch(`https://api.webflow.com/v2/sites/${SITE_ID}/collections`, {
            headers: {
                'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            const error = await response.text();
            console.error(`Failed to fetch collections: ${response.status}`);
            console.error(error);
            return;
        }
        
        const data = await response.json();
        const collections = data.collections || [];
        
        console.log(`Found ${collections.length} collections:\n`);
        
        collections.forEach(collection => {
            console.log(`Collection: ${collection.displayName || collection.name}`);
            console.log(`  - ID: ${collection.id}`);
            console.log(`  - Slug: ${collection.slug}`);
            console.log(`  - Last Updated: ${collection.lastUpdated}`);
            console.log('');
        });
        
        return collections;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function createPageExample() {
    console.log('\n--- Page Creation Information ---\n');
    console.log('According to the Webflow API v2 documentation:');
    console.log('- To create a static page, use: POST /sites/{site_id}/pages');
    console.log('- Required fields:');
    console.log('  - title: The page title');
    console.log('  - slug: The URL slug for the page');
    console.log('  - parentId: (optional) Parent page ID for nested pages');
    console.log('');
    console.log('- Collection pages are created differently:');
    console.log('  - Use: POST /collections/{collection_id}/items');
    console.log('  - This creates CMS items, not static pages');
    console.log('');
    console.log('Example static page creation:');
    console.log(`
const pageData = {
    title: "Test Page",
    slug: "test-page",
    parentId: null  // or specify a parent page ID
};

const response = await fetch(\`https://api.webflow.com/v2/sites/\${SITE_ID}/pages\`, {
    method: 'POST',
    headers: {
        'Authorization': \`Bearer \${WEBFLOW_TOKEN}\`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(pageData)
});
`);
}

async function testPageCreation() {
    console.log('\n--- Testing Page Creation ---\n');
    
    const testPageData = {
        title: "API Test Page",
        slug: "api-test-page-" + Date.now(),
        parentId: null
    };
    
    console.log('Creating test page with data:', JSON.stringify(testPageData, null, 2));
    
    try {
        const response = await fetch(`https://api.webflow.com/v2/sites/${SITE_ID}/pages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testPageData)
        });
        
        if (!response.ok) {
            const error = await response.text();
            console.error(`Failed to create page: ${response.status}`);
            console.error(error);
            return;
        }
        
        const createdPage = await response.json();
        console.log('\nSuccessfully created page:');
        console.log(`- ID: ${createdPage.id}`);
        console.log(`- Title: ${createdPage.title}`);
        console.log(`- Slug: ${createdPage.slug}`);
        console.log(`- URL: https://hairqare.co/${createdPage.slug}`);
        
        return createdPage;
    } catch (error) {
        console.error('Error creating page:', error);
    }
}

async function main() {
    console.log('=== Webflow Collections and Page Creation Tool ===\n');
    
    // Get collections
    await getCollections();
    
    // Show page creation info
    await createPageExample();
    
    // Optionally test page creation
    const args = process.argv.slice(2);
    if (args.includes('--test-create')) {
        await testPageCreation();
    } else {
        console.log('\nTo test page creation, run with: node get-collections.js --test-create');
    }
}

// Run the script
main().catch(console.error);