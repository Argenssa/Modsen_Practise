const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, 'file1.txt');
const outputFilePath = path.join(__dirname, 'file3.txt');

console.time('Async File Operations');

const readStream = fs.createReadStream(inputFilePath, { encoding: 'utf8' });
const writeStream = fs.createWriteStream(outputFilePath, { encoding: 'utf8' });

readStream.on('error', (err) => {
    console.error('Error reading file:', err);
});

writeStream.on('error', (err) => {
    console.error('Error writing file:', err);
});

writeStream.on('finish', () => {
    console.log('File read and written successfully using asynchronous streams.');
    console.timeEnd('Async File Operations');
});

readStream.pipe(writeStream);
