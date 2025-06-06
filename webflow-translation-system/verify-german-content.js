#!/usr/bin/env node

const fetch = require('node-fetch');

async function verifyGermanContent() {
  console.log('🔍 Verifying German content on live page...\n');
  
  const url = 'https://hairqare.co/de/the-haircare-challenge';
  
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Check for German translations we know should be there
    const checks = [
      {
        pattern: /14-Tage-Haarpflege-Challenge/,
        description: '"14-Tage-Haarpflege-Challenge" translation'
      },
      {
        pattern: /Tage mit perfektem Haar/,
        description: '"Tage mit perfektem Haar" (Good hair days)'
      },
      {
        pattern: /€\d+|€ \d+|\d+€/,
        description: 'EUR currency symbol (€)'
      },
      {
        pattern: /Reduziere Haarausfall/i,
        description: '"Reduziere Haarausfall" (Reduce hair loss)'
      },
      {
        pattern: /gesünderes.*Haar|Haar.*gesünderes/i,
        description: 'German text about healthier hair'
      }
    ];
    
    console.log(`Checking: ${url}\n`);
    console.log('Results:');
    console.log('--------');
    
    let foundCount = 0;
    checks.forEach(check => {
      const found = check.pattern.test(html);
      console.log(`${found ? '✅' : '❌'} ${check.description}`);
      if (found) {
        foundCount++;
        // Show sample match
        const match = html.match(check.pattern);
        if (match) {
          const context = html.substring(html.indexOf(match[0]) - 50, html.indexOf(match[0]) + 50);
          console.log(`   Found: "...${context.replace(/\n/g, ' ').trim()}..."`);
        }
      }
    });
    
    console.log(`\n📊 Summary: ${foundCount}/${checks.length} German elements found`);
    
    if (foundCount === 0) {
      console.log('\n❌ No German content found - page may still be showing English');
      console.log('   This could mean:');
      console.log('   - Publishing hasn\'t completed yet');
      console.log('   - CDN cache needs to refresh');
      console.log('   - Need to publish from Webflow Designer');
    } else if (foundCount < checks.length) {
      console.log('\n⚠️  Some German content found but not all');
      console.log('   Page may be partially updated');
    } else {
      console.log('\n✅ All German translations are live!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run
if (require.main === module) {
  verifyGermanContent();
}