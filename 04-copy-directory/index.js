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

const dirCopyPath = path.join(__dirname, 'files-copy');
const dirPath = path.join(__dirname, 'files');
copys(dirPath, dirCopyPath);