#!/usr/bin/env node

// Test if page is accessible via web
const fetch = require('node-fetch');

async function testPageAccess() {
  const urls = [
    'https://hairqare.co/de/the-haircare-challenge',
    'https://hairqare.co/the-haircare-challenge',
    'https://hairqare.co/es-the-haircare-challenge'
  ];
  
  console.log('\n🌐 Testing page accessibility...\n');
  
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow'
      });
      
      console.log(`URL: ${url}`);
      console.log(`Status: ${response.status} ${response.statusText}`);
      console.log(`Final URL: ${response.url}`);
      console.log('---\n');
    } catch (error) {
      console.log(`URL: ${url}`);
      console.log(`Error: ${error.message}`);
      console.log('---\n');
    }
  }
}

testPageAccess();