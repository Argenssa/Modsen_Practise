const path = require('path');

const filePath = process.argv[2];

if (!filePath) {
    console.error('Please provide a file path as an argument.');
    process.exit(1);
}

const directoryName = path.dirname(filePath);
const fileExtension = path.extname(filePath);


console.log(`Directory Name: ${directoryName}`);
console.log(`File Extension: ${fileExtension}`);
