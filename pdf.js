const fs = require('fs');
const options2 = {
    leftWidth: 50, rightWidth: 20, topHeight: 50, bottomHeight: 20,
    rectColor: ['#808080', '#B0C4DE', '#E6E6FA', '#FFF0F5', '#008080', '#6495ED']
};
const PdfCanvas = require('./PdfCanvas');
const aPdfCanvas = new PdfCanvas(600, 800, options2);

aPdfCanvas.paint();
const buffer2 = aPdfCanvas.getCanvasBuffer();

fs.writeFileSync('./test.pdf', buffer2);