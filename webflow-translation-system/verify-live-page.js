#!/usr/bin/env node

const fetch = require('node-fetch');

async function verifyLivePage() {
  console.log('\n🌐 Checking live German page content...\n');
  
  try {
    const response = await fetch('https://hairqare.co/de/challenge');
    const html = await response.text();
    
    // Look for specific content mentioned by user
    const checks = [
      { pattern: /14-Tage-Haarpflege-Masterclass/g, name: '14-Tage-Haarpflege-Masterclass' },
      { pattern: /\$99/g, name: '$99' },
      { pattern: /\$29/g, name: '$29' },
      { pattern: /\$35/g, name: '$35' },
      { pattern: /\$39/g, name: '$39' },
      { pattern: /\$15/g, name: '$15' },
      { pattern: /\$20/g, name: '$20' },
      { pattern: /€99/g, name: '€99' },
      { pattern: /€29/g, name: '€29' },
      { pattern: /€35/g, name: '€35' },
      { pattern: /Haarpflege-Journal/g, name: 'Haarpflege-Journal' },
      { pattern: /285€/g, name: '285€' },
      { pattern: /324€/g, name: '324€' }
    ];
    
    console.log('📋 Content check results:\n');
    
    checks.forEach(check => {
      const matches = html.match(check.pattern);
      const count = matches ? matches.length : 0;
      
      if (count > 0) {
        if (check.name.includes('$')) {
          console.log(`❌ Found ${count} instances of "${check.name}" (needs conversion to €)`);
        } else {
          console.log(`✅ Found ${count} instances of "${check.name}"`);
        }
      }
    });
    
    // Extract snippets with dollar signs
    console.log('\n📝 Snippets with $ signs:\n');
    const dollarMatches = html.match(/[^>]{0,50}\$\d+[^<]{0,50}/g);
    if (dollarMatches) {
      dollarMatches.slice(0, 10).forEach((match, i) => {
        console.log(`${i + 1}. ...${match.trim()}...`);
      });
    }
    
    // Check if this is the right page
    console.log('\n🔍 Page verification:');
    if (html.includes('14-Tage-Haarpflege')) {
      console.log('✅ This is the German challenge page');
    }
    if (html.includes('SELF-CARE SPECIAL')) {
      console.log('✅ Contains SELF-CARE SPECIAL section');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run
if (require.main === module) {
  verifyLivePage();
}