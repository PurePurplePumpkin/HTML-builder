const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');
const stream = new fs.WriteStream(filePath);
const lines = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
lines.write('Привет! Напиши что-нибудь\n');
lines.on('line', (line) => {
    if (line === 'exit') {
        lines.close();
    } else {
        stream.write(`${line}\n`)
    }
});
lines.on('close', () => {
    console.log('Пока!');
});
