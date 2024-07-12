const fs = require('fs');
const path = require('path');


const inputFilePath = path.join(__dirname, 'input.txt');
const outputFilePath = path.join(__dirname, 'output.txt');

const readStream = fs.createReadStream(inputFilePath);


readStream.on('error', (err) => {
    console.error(`Error reading file: ${err.message}`);
});

const writeStream = fs.createWriteStream(outputFilePath);

writeStream.on('error', (err) => {
    console.error(`Error writing file: ${err.message}`);
});

readStream.pipe(writeStream);

writeStream.on('finish', () => {
    console.log('File has been copied successfully.');
});
