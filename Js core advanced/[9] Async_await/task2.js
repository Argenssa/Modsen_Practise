const axios = require('axios');

async function fetchData() {
    try {
        const response1 = await axios.get('http://localhost:3001/data');
        const data = response1.data;
        console.log('Data from first server:', data);

        const response2 = await axios.post('http://localhost:3002/process', data);
        const processedData = response2.data;
        console.log('Processed data from second server:', processedData);
    } catch (error) {
        console.error('Error:', error);
    }
}


fetchData();
