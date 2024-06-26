const express = require('express');
const app = express();
const port = 3001;

app.get('/data', (req, res) => {
    const data = {
        id: 1,
        name: 'Sample Data',
        info: 'This is some sample data from the first server.'
    };
    res.json(data);
});

app.listen(port, () => {
    console.log(`First server listening at http://localhost:${port}`);
});
