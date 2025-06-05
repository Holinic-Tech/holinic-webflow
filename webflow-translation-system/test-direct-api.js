// Direct test of the translation worker

const WORKER_URL = 'https://holinic-webflow-translation-worker.dndgroup.workers.dev';
const WEBFLOW_TOKEN = process.env.WEBFLOW_TOKEN;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const AUTH_TOKEN = process.env.WORKER_AUTH_TOKEN || 'test-token';

async function testWorker() {
    if (!WEBFLOW_TOKEN) {
        console.error('Please set WEBFLOW_TOKEN environment variable');
        return;
    }
    
    console.log('Testing worker with exact pattern match...\n');
    
    // Test 1: With slash
    console.log('Test 1: Pattern with slash "/the-haircare-challenge"');
    await makeRequest(['/the-haircare-challenge']);
    
    // Test 2: Without slash
    console.log('\nTest 2: Pattern without slash "the-haircare-challenge"');
    await makeRequest(['the-haircare-challenge']);
    
    // Test 3: Exact match
    console.log('\nTest 3: Exact page slug match "the-haircare-challenge"');
    await makeRequest(['the-haircare-challenge']);
    
    // Test 4: Wildcard
    console.log('\nTest 4: Wildcard pattern "*haircare-challenge"');
    await makeRequest(['*haircare-challenge']);
}

async function makeRequest(patterns) {
    try {
        const payload = {
            urlPatterns: patterns,
            targetLanguage: 'de',
            action: 'translate',
            webflowToken: WEBFLOW_TOKEN,
            openaiKey: OPENAI_KEY || 'sk-test'
        };
        
        console.log('Payload:', JSON.stringify(payload, null, 2));
        
        const response = await fetch(`${WORKER_URL}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AUTH_TOKEN}`
            },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        
        console.log('Response:', response.status);
        console.log('Result summary:');
        console.log(`- Success: ${result.success?.length || 0} pages`);
        console.log(`- Failed: ${result.failed?.length || 0} pages`);
        console.log(`- Total pages processed: ${(result.success?.length || 0) + (result.failed?.length || 0)}`);
        
        if (result.error) {
            console.log('Error:', result.error);
        }
        
    } catch (error) {
        console.error('Request failed:', error.message);
    }
}

testWorker();