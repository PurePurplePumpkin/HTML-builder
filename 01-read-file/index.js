const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const stream = new fs.ReadStream(filePath, 'utf8');
stream.on('data', (data) => console.log(data));
