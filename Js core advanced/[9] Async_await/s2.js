const express = require('express');
const app = express();
const port = 3002;

app.use(express.json());

app.post('/process', (req, res) => {
    const receivedData = req.body;
    console.log('Data received from first server:', receivedData);

    // Обработка данных
    const processedData = {
        ...receivedData,
        processed: true,
        timestamp: new Date().toISOString()
    };

    res.json(processedData);
});

app.listen(port, () => {
    console.log(`Second server listening at http://localhost:${port}`);
});
