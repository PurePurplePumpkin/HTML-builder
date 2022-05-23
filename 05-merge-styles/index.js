const fs = require('fs');
const path = require('path');

(async () => {
    const write = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
    const files = await fs.promises.readdir(path.join(__dirname, 'styles'));
    for (const file of files) {
        if (path.extname(file) === '.css') {
            const read = fs.createReadStream(path.join(__dirname, 'styles', file));
            read.on('data', (data) => {
                write.write(data);
            });
        }
    }
})()