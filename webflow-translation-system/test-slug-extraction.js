// Test slug extraction
function extractPageSlug(url) {
  // Remove protocol and domain
  const cleanUrl = url.replace(/^https?:\/\/[^\/]+/, '');
  // Remove leading slash
  return cleanUrl.replace(/^\//, '');
}

// Test cases
const testUrls = [
  'hairqare.co/de/the-haircare-challenge',
  'https://hairqare.co/de/the-haircare-challenge',
  'http://hairqare.co/de/the-haircare-challenge',
  '/de/the-haircare-challenge',
  'de/the-haircare-challenge'
];

console.log('Testing slug extraction:\n');
testUrls.forEach(url => {
  const slug = extractPageSlug(url);
  console.log(`Input:  "${url}"`);
  console.log(`Output: "${slug}"`);
  console.log('---');
});