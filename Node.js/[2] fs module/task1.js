const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'public');
const extension = '.txt';
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.error('Unable to scan directory: ' + err);
    }


    files.forEach((file) => {
        if (path.extname(file).toLowerCase() === extension) {
            fs.unlink(path.join(directoryPath, file), (err) => {
                if (err) {
                    console.error(`Error deleting file ${file}: ${err}`);
                } else {
                    console.log(`Deleted file: ${file}`);
                }
            });
        }
    });


    setTimeout(() => {

        fs.readdir(directoryPath, (err, remainingFiles) => {
            if (err) {
                return console.error('Unable to scan directory: ' + err);
            }

            console.log('Remaining files:');
            remainingFiles.forEach((file) => {
                console.log(file);
            });
        });
    }, 1000);
});
