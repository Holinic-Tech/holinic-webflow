#!/usr/bin/env node

// View translations from backup file
const fs = require('fs');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('\nUsage: node view-translations.js <backup-file.json>\n');
  
  // List available backup files
  const files = fs.readdirSync('.').filter(f => f.startsWith('backup-') && f.endsWith('.json'));
  if (files.length > 0) {
    console.log('Available backup files:');
    files.forEach(f => console.log(`  - ${f}`));
  }
  process.exit(1);
}

try {
  const data = JSON.parse(fs.readFileSync(args[0], 'utf8'));
  
  console.log('\n📄 TRANSLATION RESULTS\n');
  console.log('=' .repeat(80));
  
  let count = 0;
  data.nodes.forEach(node => {
    if (node.type === 'text' && node.text) {
      count++;
      console.log(`\n[${count}] Node ID: ${node.id}`);
      console.log('-'.repeat(80));
      console.log('ORIGINAL: (English)');
      console.log(`"${node.text.text}"`);
      console.log('\nTRANSLATED: (Target Language)');
      console.log(`"${node.text.text}"`);
      
      if (node.text.html && node.text.html !== node.text.text) {
        console.log('\nHTML:');
        console.log(node.text.html);
      }
    }
  });
  
  console.log('\n' + '='.repeat(80));
  console.log(`\n✅ Total translations: ${count}\n`);
  
  // Create a simple HTML file for easier viewing
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Translation Results</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    .translation { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
    .original { background-color: #f0f0f0; padding: 10px; margin: 10px 0; }
    .translated { background-color: #e8f5e9; padding: 10px; margin: 10px 0; }
    .node-id { color: #666; font-size: 0.9em; }
    h1 { color: #333; }
  </style>
</head>
<body>
  <h1>Translation Results</h1>
  <p>File: ${args[0]}</p>
  <p>Total translations: ${count}</p>
  
  ${data.nodes.filter(n => n.type === 'text' && n.text).map((node, i) => `
    <div class="translation">
      <div class="node-id">Node ${i + 1} (ID: ${node.id})</div>
      <div class="original">
        <strong>Original:</strong><br>
        ${node.text.text}
      </div>
      <div class="translated">
        <strong>Translated:</strong><br>
        ${node.text.text}
      </div>
    </div>
  `).join('')}
</body>
</html>
  `;
  
  const htmlFile = args[0].replace('.json', '.html');
  fs.writeFileSync(htmlFile, htmlContent);
  console.log(`📄 HTML view saved to: ${htmlFile}\n`);
  
} catch (error) {
  console.error('Error reading file:', error.message);
}