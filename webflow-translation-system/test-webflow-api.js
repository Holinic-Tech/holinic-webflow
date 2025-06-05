// Direct test of Webflow API to understand the response structure

const WEBFLOW_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = '62cbaa353a301eb715aa33d0';

if (!WEBFLOW_TOKEN) {
    console.error('Please set WEBFLOW_TOKEN environment variable');
    process.exit(1);
}

async function testWebflowAPI() {
    console.log('Testing Webflow API...\n');
    
    try {
        // 1. Get all pages
        console.log('1. Fetching all pages...');
        const pagesResponse = await fetch(`https://api.webflow.com/v2/sites/${SITE_ID}/pages`, {
            headers: {
                'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
                'Accept': 'application/json'
            }
        });
        
        if (!pagesResponse.ok) {
            const error = await pagesResponse.text();
            console.error(`Failed to fetch pages: ${pagesResponse.status}`);
            console.error(error);
            return;
        }
        
        const pagesData = await pagesResponse.json();
        const pages = pagesData.pages || [];
        
        console.log(`Found ${pages.length} pages`);
        
        // Find the-haircare-challenge pages
        const challengePages = pages.filter(p => p.slug && p.slug.includes('the-haircare-challenge'));
        console.log(`\nFound ${challengePages.length} pages with 'the-haircare-challenge':`);
        challengePages.forEach(p => console.log(`  - ${p.slug} (ID: ${p.id})`));
        
        // 2. Get DOM for the first matching page
        if (challengePages.length > 0) {
            const testPage = challengePages.find(p => p.slug === 'the-haircare-challenge') || challengePages[0];
            console.log(`\n2. Fetching DOM for page: ${testPage.slug}`);
            
            const domResponse = await fetch(`https://api.webflow.com/v2/pages/${testPage.id}/dom`, {
                headers: {
                    'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
                    'Accept': 'application/json'
                }
            });
            
            if (!domResponse.ok) {
                const error = await domResponse.text();
                console.error(`Failed to fetch DOM: ${domResponse.status}`);
                console.error(error);
                return;
            }
            
            const domData = await domResponse.json();
            
            console.log('\nDOM Structure:');
            console.log(`- Title: ${domData.title}`);
            console.log(`- Has nodes: ${domData.nodes ? 'Yes' : 'No'}`);
            console.log(`- Node count: ${domData.nodes ? domData.nodes.length : 0}`);
            
            if (domData.nodes && domData.nodes.length > 0) {
                console.log('\nFirst 3 nodes:');
                domData.nodes.slice(0, 3).forEach((node, i) => {
                    console.log(`\nNode ${i + 1}:`);
                    console.log(`  - Type: ${node.type || 'unknown'}`);
                    console.log(`  - Tag: ${node.tag || 'none'}`);
                    console.log(`  - Has text: ${node.text !== undefined ? 'Yes' : 'No'}`);
                    if (node.text !== undefined) {
                        console.log(`  - Text type: ${typeof node.text}`);
                        console.log(`  - Text value: ${JSON.stringify(node.text).substring(0, 100)}...`);
                    }
                    console.log(`  - Has children: ${node.children ? 'Yes' : 'No'}`);
                    console.log(`  - Full node: ${JSON.stringify(node).substring(0, 200)}...`);
                });
                
                // Find nodes with text
                console.log('\nAnalyzing text nodes...');
                let textNodeCount = 0;
                let nonStringTextNodes = [];
                
                function analyzeNodes(nodes, path = '') {
                    if (!nodes || !Array.isArray(nodes)) return;
                    
                    nodes.forEach((node, i) => {
                        const nodePath = `${path}[${i}]`;
                        
                        if (node.text !== undefined) {
                            textNodeCount++;
                            if (typeof node.text !== 'string') {
                                nonStringTextNodes.push({
                                    path: nodePath,
                                    type: typeof node.text,
                                    value: node.text,
                                    isArray: Array.isArray(node.text),
                                    sample: JSON.stringify(node.text).substring(0, 100)
                                });
                            }
                        }
                        
                        if (node.children) {
                            analyzeNodes(node.children, `${nodePath}.children`);
                        }
                    });
                }
                
                analyzeNodes(domData.nodes);
                
                console.log(`\nTotal text nodes: ${textNodeCount}`);
                console.log(`Non-string text nodes: ${nonStringTextNodes.length}`);
                
                if (nonStringTextNodes.length > 0) {
                    console.log('\nNon-string text nodes found:');
                    nonStringTextNodes.slice(0, 5).forEach(node => {
                        console.log(`\n  Path: ${node.path}`);
                        console.log(`  Type: ${node.type}`);
                        console.log(`  Is Array: ${node.isArray}`);
                        console.log(`  Sample: ${node.sample}`);
                    });
                }
            }
            
            // Save full response for analysis
            const fs = require('fs').promises;
            await fs.writeFile('webflow-dom-response.json', JSON.stringify(domData, null, 2));
            console.log('\nFull DOM response saved to webflow-dom-response.json');
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the test
testWebflowAPI();