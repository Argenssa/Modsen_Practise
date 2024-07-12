const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

let items = [
    { id: 1, name: 'Item 1', description: 'This is item 1' },
    { id: 2, name: 'Item 2', description: 'This is item 2' },
];

// Эндпоинт для получения списка элементов
app.get('/items', (req, res) => {
    res.json(items);
});

app.get('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const item = items.find(i => i.id === itemId);

    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

app.post('/items', (req, res) => {
    const newItem = {
        id: items.length ? items[items.length - 1].id + 1 : 1,
        name: req.body.name,
        description: req.body.description,
    };
    items.push(newItem);
    res.status(201).json(newItem);
});

app.put('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const itemIndex = items.findIndex(i => i.id === itemId);

    if (itemIndex >= 0) {
        const updatedItem = {
            id: itemId,
            name: req.body.name,
            description: req.body.description,
        };
        items[itemIndex] = updatedItem;
        res.json(updatedItem);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
