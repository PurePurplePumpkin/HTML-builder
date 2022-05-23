const fs = require('fs');
const path = require('path');

(async () => {
    dirPath = path.join(__dirname, 'secret-folder');
    const files = await fs.promises.readdir(dirPath, {withFileTypes: true});
    for (const file of files) {
        if (!file.isDirectory()) {
            const name = path.parse(file.name);
            const size = await fs.promises.stat(path.join(dirPath, file.name));
            console.log(`${name.name} - ${name.ext.slice(1)} - ${size.size/1024}kb`);
        }
    }
})()