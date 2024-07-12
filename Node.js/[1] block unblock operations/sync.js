const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, 'file1.txt');
const outputFilePath = path.join(__dirname, 'file2.txt');

console.time('Sync File Operations');

try {
    const data = fs.readFileSync(inputFilePath, 'utf8');
    fs.writeFileSync(outputFilePath, data, 'utf8');
    console.log('File read and written successfully using synchronous methods.');
} catch (err) {
    console.error('Error during file operations:', err);
}

console.timeEnd('Sync File Operations');
