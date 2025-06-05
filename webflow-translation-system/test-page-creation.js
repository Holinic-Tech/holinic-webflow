#!/usr/bin/env node

// Test different Webflow API approaches for page creation

const WEBFLOW_TOKEN = '916a2cf88a0b2b44ae5a03850e8f731b582b2943f132004e25d3bd7f8459dfbb';
const SITE_ID = '62cbaa353a301eb715aa33d0';

async function testPageCreation() {
  console.log('Testing Webflow page creation methods...\n');

  // Method 1: Try v2 API with different payload structures
  console.log('1. Testing v2 API with basic payload:');
  try {
    const response = await fetch(`https://api.webflow.com/v2/sites/${SITE_ID}/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        title: 'Test Page v2',
        slug: 'test-page-v2'
      })
    });
    
    const result = await response.text();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${result}\n`);
  } catch (error) {
    console.log(`   Error: ${error.message}\n`);
  }

  // Method 2: Try v1 API format
  console.log('2. Testing v1 API format:');
  try {
    const response = await fetch(`https://api.webflow.com/sites/${SITE_ID}/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          name: 'Test Page v1',
          slug: 'test-page-v1'
        }
      })
    });
    
    const result = await response.text();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${result}\n`);
  } catch (error) {
    console.log(`   Error: ${error.message}\n`);
  }

  // Method 3: Check if we can get collections (pages might be in a collection)
  console.log('3. Checking for collections:');
  try {
    const response = await fetch(`https://api.webflow.com/v2/sites/${SITE_ID}/collections`, {
      headers: {
        'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   Found ${data.collections?.length || 0} collections`);
      if (data.collections?.length > 0) {
        data.collections.slice(0, 3).forEach(col => {
          console.log(`   - ${col.displayName || col.name} (${col.id})`);
        });
      }
    } else {
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${await response.text()}`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}\n`);
  }

  // Method 4: Check page structure to understand duplication
  console.log('\n4. Analyzing existing page structure:');
  try {
    // Get a page to understand its structure
    const pagesResponse = await fetch(`https://api.webflow.com/v2/sites/${SITE_ID}/pages`, {
      headers: {
        'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
        'Accept': 'application/json'
      }
    });
    
    if (pagesResponse.ok) {
      const pagesData = await pagesResponse.json();
      const samplePage = pagesData.pages?.find(p => p.slug === 'the-haircare-challenge');
      
      if (samplePage) {
        console.log('   Sample page structure:');
        console.log(`   - ID: ${samplePage.id}`);
        console.log(`   - Title: ${samplePage.title}`);
        console.log(`   - Slug: ${samplePage.slug}`);
        console.log(`   - Parent ID: ${samplePage.parentId || 'none'}`);
        console.log(`   - Created: ${samplePage.createdOn}`);
        console.log(`   - Published: ${samplePage.publishedOn || 'not published'}`);
        
        // Check if it has a collectionId
        if (samplePage.collectionId) {
          console.log(`   - Collection ID: ${samplePage.collectionId}`);
        }
      }
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Method 5: Try Designer API endpoints
  console.log('\n5. Testing Designer API endpoints:');
  const designerEndpoints = [
    '/designer/sites/{siteId}/pages',
    '/designer/pages',
    '/v1/sites/{siteId}/pages',
    '/pages'
  ];
  
  for (const endpoint of designerEndpoints) {
    const url = `https://api.webflow.com${endpoint.replace('{siteId}', SITE_ID)}`;
    console.log(`   Trying: ${endpoint}`);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WEBFLOW_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Test Designer Page',
          slug: 'test-designer-page'
        })
      });
      
      console.log(`   Status: ${response.status}`);
      if (response.status === 404) {
        console.log('   Endpoint not found');
      } else {
        console.log(`   Response: ${await response.text()}`);
      }
    } catch (error) {
      console.log(`   Error: ${error.message}`);
    }
  }

  console.log('\n\nConclusion:');
  console.log('Webflow API v2 does not support creating static pages programmatically.');
  console.log('Pages can only be created through the Webflow Designer interface.');
  console.log('\nAlternative approaches:');
  console.log('1. Use Webflow\'s CMS Collections for dynamic content');
  console.log('2. Create template pages manually and update content via API');
  console.log('3. Use Webflow\'s Designer Extensions (requires different authentication)');
  console.log('4. Export/import site designs (requires manual intervention)');
}

testPageCreation();