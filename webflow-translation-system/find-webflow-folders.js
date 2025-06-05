// Find Webflow folders using REST API v2

const WEBFLOW_TOKEN = '916a2cf88a0b2b44ae5a03850e8f731b582b2943f132004e25d3bd7f8459dfbb';
const SITE_ID = '62cbaa353a301eb715aa33d0';

async function findFolders() {
    console.log('Fetching all pages from Webflow...\n');
    
    try {
        const response = await fetch(`https://api.webflow.com/v2/sites/${SITE_ID}/pages`, {
            headers: {
                'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            const error = await response.text();
            console.error('Failed to fetch pages:', response.status, error);
            return;
        }
        
        const data = await response.json();
        const pages = data.pages || [];
        
        console.log(`Found ${pages.length} total pages\n`);
        
        // Build parent-child relationships
        const pageMap = {};
        const childrenByParent = {};
        
        pages.forEach(page => {
            pageMap[page.id] = page;
            const parentId = page.parentId || 'root';
            if (!childrenByParent[parentId]) {
                childrenByParent[parentId] = [];
            }
            childrenByParent[parentId].push(page);
        });
        
        // Find pages that are folders (have children)
        const folders = pages.filter(page => {
            return childrenByParent[page.id] && childrenByParent[page.id].length > 0;
        });
        
        console.log(`Found ${folders.length} folders (pages with children):\n`);
        
        // Display folder hierarchy
        folders.forEach(folder => {
            const children = childrenByParent[folder.id] || [];
            console.log(`📁 ${folder.title || folder.slug}`);
            console.log(`   ID: ${folder.id}`);
            console.log(`   Slug: /${folder.slug}`);
            console.log(`   Children: ${children.length}`);
            console.log(`   Parent: ${folder.parentId || 'root'}`);
            
            // Show first few children
            if (children.length > 0) {
                console.log(`   Child pages:`);
                children.slice(0, 3).forEach(child => {
                    console.log(`     - ${child.slug}`);
                });
                if (children.length > 3) {
                    console.log(`     ... and ${children.length - 3} more`);
                }
            }
            console.log('');
        });
        
        // Look specifically for language folders
        console.log('\nLooking for language folders (de, fr, es, it, pt, nl)...\n');
        
        const languageCodes = ['de', 'fr', 'es', 'it', 'pt', 'nl'];
        const languageFolders = {};
        
        folders.forEach(folder => {
            if (languageCodes.includes(folder.slug)) {
                languageFolders[folder.slug] = folder;
            }
        });
        
        if (Object.keys(languageFolders).length > 0) {
            console.log('Found language folders:');
            Object.entries(languageFolders).forEach(([lang, folder]) => {
                console.log(`\n${lang.toUpperCase()}:`);
                console.log(`  ID: ${folder.id}`);
                console.log(`  Title: ${folder.title}`);
                console.log(`  Full slug: /${folder.slug}`);
            });
            
            console.log('\n\nAdd these to your wrangler.toml:');
            console.log('\n[vars]');
            console.log(`WEBFLOW_SITE_ID = "${SITE_ID}"`);
            Object.entries(languageFolders).forEach(([lang, folder]) => {
                console.log(`WEBFLOW_FOLDER_ID_${lang.toUpperCase()} = "${folder.id}"`);
            });
        } else {
            console.log('No language folders found with slugs: de, fr, es, it, pt, nl');
            console.log('\nShowing all folders to help you identify the right ones:');
            
            folders.forEach(folder => {
                console.log(`\nFolder: "${folder.title || folder.slug}"`);
                console.log(`  ID: ${folder.id}`);
                console.log(`  Slug: /${folder.slug}`);
            });
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
}

findFolders();