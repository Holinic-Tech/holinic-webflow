// Check the status of current translations

const WORKER_URL = 'https://holinic-webflow-translation-worker.dndgroup.workers.dev';

async function checkStatus() {
    console.log('Checking worker status...\n');
    
    try {
        // Try to get status from the worker
        const response = await fetch(`${WORKER_URL}/status`, {
            headers: {
                'Authorization': 'Bearer test-token'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Status response:', JSON.stringify(data, null, 2));
        } else {
            console.log('Status endpoint returned:', response.status);
        }
        
        // Also let's check if the worker is responsive
        console.log('\nChecking if worker is responsive...');
        const healthResponse = await fetch(WORKER_URL);
        console.log('Worker health check:', healthResponse.status, healthResponse.statusText);
        
    } catch (error) {
        console.error('Error checking status:', error.message);
    }
}

checkStatus();