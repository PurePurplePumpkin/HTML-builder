const fs = require('fs');
const path = require('path');

async function copys(dirPath, dirCopyPath) {
    await fs.promises.mkdir(dirCopyPath, { recursive: true });
    const copyFiles = await fs.promises.readdir(dirCopyPath);
    for (const file of copyFiles) {
        await fs.promises.rm(path.join(dirCopyPath, file), { recursive: true});
    }
    const files = await fs.promises.readdir(dirPath, {withFileTypes: true});
    for (const file of files) {
        let src = path.join(dirPath, file.name);
        let dst = path.join(dirCopyPath, file.name);
        if (file.isDirectory()) {
            copys(src, dst);
        } else {
            await fs.promises.copyFile(src, dst);
        }
    }
}

(async () => {
    await fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
    const dirCopyPath = path.join(__dirname, 'project-dist', 'assets');
    const dirPath = path.join(__dirname, 'assets');
    copys(dirPath, dirCopyPath);
    const write = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
    const files = await fs.promises.readdir(path.join(__dirname, 'styles'));
    for (const file of files) {
        if (path.extname(file) === '.css') {
            const read = fs.createReadStream(path.join(__dirname, 'styles', file));
            read.on('data', (data) => {
                write.write(data);
            });
        }
    }
    const template = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf8');
    template.on('readable', () => {
        let data = template.read();
        if(null !== data) {
            const regexp = RegExp('{{(.*)}}','g');
            const matches = data.matchAll(regexp);
            (async () => {
                for (const match of matches) {
                    const partPath = path.join(__dirname, 'components', match[1] + '.html');
                    const part = await fs.promises.readFile(partPath, 'utf8');
                    data = data.replace(match[0], part);
                }
                const index = path.join(__dirname, 'project-dist', 'index.html');
                await fs.promises.writeFile(index, data);
            })();
        }
    });
})()