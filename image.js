const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')
const width = 1200;
const height = 600;
const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');

context.fillStyle = '#fff';
context.fillRect(0, 0, width, height);

const text = 'Hello, World!';
context.textBaseline = 'top';
context.fillStyle = '#3574d4';
const textWidth = context.measureText(text).width;
context.fillRect(600 - textWidth / 2 - 10, 170 - 5, textWidth + 20, 120);
context.fillStyle = '#fff';
context.fillText(text, 600, 170);

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./test.png', buffer);