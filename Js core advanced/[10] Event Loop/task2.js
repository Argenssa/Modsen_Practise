const axios = require('axios');

async function fetchData(url, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await axios.get(url, {
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response.data;
    } catch (error) {
        throw error;
    }
}


fetchData('http://localhost:3001/data', 5000)
    .then(data => console.log('Data:', data))
    .catch(error => console.error('Fetch error:', error));
