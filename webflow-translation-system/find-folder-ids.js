// Script to find Webflow folder IDs

const WEBFLOW_TOKEN = process.env.WEBFLOW_TOKEN || '916a2cf88a0b2b44ae5a03850e8f731b582b2943f132004e25d3bd7f8459dfbb';
const SITE_ID = '62cbaa353a301eb715aa33d0';

async function findFolders() {
    console.log('Finding Webflow folders...\n');
    
    try {
        // Get all pages to find folders
        const response = await fetch(`https://api.webflow.com/v2/sites/${SITE_ID}/pages`, {
            headers: {
                'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.error('Failed to fetch pages:', response.status);
            return;
        }
        
        const data = await response.json();
        const pages = data.pages || [];
        
        // Find pages that look like folders (usually have specific naming or structure)
        console.log('Looking for language folders...\n');
        
        // Group pages by parentId to understand structure
        const pagesByParent = {};
        const pagesById = {};
        
        pages.forEach(page => {
            pagesById[page.id] = page;
            const parentId = page.parentId || 'root';
            if (!pagesByParent[parentId]) {
                pagesByParent[parentId] = [];
            }
            pagesByParent[parentId].push(page);
        });
        
        // Look for pages with slugs like 'de', 'fr', etc.
        const languageSlugs = ['de', 'fr', 'es', 'it', 'pt', 'nl'];
        const languageFolders = {};
        
        pages.forEach(page => {
            if (languageSlugs.includes(page.slug)) {
                languageFolders[page.slug] = {
                    id: page.id,
                    title: page.title,
                    slug: page.slug,
                    isFolder: pagesByParent[page.id] && pagesByParent[page.id].length > 0
                };
            }
        });
        
        console.log('Found language folders:');
        Object.entries(languageFolders).forEach(([lang, folder]) => {
            console.log(`\n${lang.toUpperCase()}:`);
            console.log(`  ID: ${folder.id}`);
            console.log(`  Title: ${folder.title}`);
            console.log(`  Slug: ${folder.slug}`);
            console.log(`  Has children: ${folder.isFolder}`);
        });
        
        // Also show the page structure
        console.log('\n\nPage Structure (first 20 pages):');
        pages.slice(0, 20).forEach(page => {
            const parent = page.parentId ? pagesById[page.parentId] : null;
            console.log(`- ${page.slug} (ID: ${page.id})${parent ? ` → parent: ${parent.slug}` : ' → root'}`);
        });
        
        // Generate the environment variables needed
        console.log('\n\nAdd these to your wrangler.toml:');
        console.log('[vars]');
        Object.entries(languageFolders).forEach(([lang, folder]) => {
            console.log(`WEBFLOW_FOLDER_ID_${lang.toUpperCase()} = "${folder.id}"`);
        });
        
    } catch (error) {
        console.error('Error:', error);
    }
}

findFolders();