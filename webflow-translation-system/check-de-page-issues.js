#!/usr/bin/env node
// Check specific issues on de/the-haircare-challenge page
require('dotenv').config();
const fetch = require('node-fetch');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;
const LOCALE_ID = '684230454832f0132d5f6ccf'; // German locale

async function checkGermanPage() {
  console.log('🔍 Checking de/the-haircare-challenge page for issues...\n');

  try {
    // Get the page DOM with German locale
    const pageSlug = 'the-haircare-challenge';
    const pagesUrl = `https://api.webflow.com/v2/sites/${SITE_ID}/pages`;
    
    const pagesResponse = await fetch(pagesUrl, {
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const { pages } = await pagesResponse.json();
    const page = pages.find(p => p.slug === pageSlug);
    
    if (!page) {
      throw new Error('Page not found');
    }

    console.log(`Found page: ${page.title} (${page.id})\n`);

    // Fetch all nodes with German locale
    const allNodes = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const domUrl = `https://api.webflow.com/v2/sites/${SITE_ID}/pages/${page.id}/dom?locale=${LOCALE_ID}&limit=${limit}&offset=${offset}`;
      
      const response = await fetch(domUrl, {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log(`Error response: ${errorText}`);
        throw new Error(`Failed to fetch DOM: ${response.status}`);
      }

      const data = await response.json();
      allNodes.push(...data.nodes);

      if (data.nodes.length < limit || allNodes.length >= (data.pagination?.total || data.totalNodes || 0)) {
        break;
      }

      offset += limit;
    }

    console.log(`Total nodes: ${allNodes.length}\n`);

    // Check for issues
    const issues = {
      currency: [],
      challengeTranslation: [],
      goodHairDays: []
    };

    allNodes.forEach(node => {
      if (node.type === 'text' && node.text) {
        const text = node.text.text || '';
        const html = node.text.html || '';
        const content = html || text;

        // Check for USD currency
        if (content.match(/\$\d+/) || content.match(/\d+\s*\$/) || content.match(/US\$/)) {
          issues.currency.push({
            nodeId: node.id,
            text: content.substring(0, 100) + (content.length > 100 ? '...' : '')
          });
        }

        // Check for 14-Day Haircare Challenge variations
        if (content.match(/14-Day Haircare Challenge/i) || 
            content.match(/14 Day Haircare Challenge/i) ||
            content.match(/14-Tage-Haarpflege Challenge/i)) {
          issues.challengeTranslation.push({
            nodeId: node.id,
            text: content.substring(0, 100) + (content.length > 100 ? '...' : '')
          });
        }

        // Check for Good hair days
        if (content.match(/Good hair days/i) || content.match(/Gute Haartage/i)) {
          issues.goodHairDays.push({
            nodeId: node.id,
            text: content.substring(0, 100) + (content.length > 100 ? '...' : '')
          });
        }
      }
    });

    // Report findings
    console.log('🔍 FOUND ISSUES:\n');
    
    console.log(`💵 Currency symbols (${issues.currency.length} found):`);
    issues.currency.forEach(issue => {
      console.log(`   Node ${issue.nodeId}: "${issue.text}"`);
    });
    
    console.log(`\n📅 "14-Day Haircare Challenge" variations (${issues.challengeTranslation.length} found):`);
    issues.challengeTranslation.forEach(issue => {
      console.log(`   Node ${issue.nodeId}: "${issue.text}"`);
    });
    
    console.log(`\n💇 "Good hair days" variations (${issues.goodHairDays.length} found):`);
    issues.goodHairDays.forEach(issue => {
      console.log(`   Node ${issue.nodeId}: "${issue.text}"`);
    });

    console.log('\n✅ Check complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkGermanPage();