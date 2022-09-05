const log4js = require('log4js');
const logger = log4js.getLogger('PdfCanvas');
const { createCanvas, loadImage } = require('canvas')
const DrawLib = require('./chart/DrawLib');
class PdfCanvas extends DrawLib{

    constructor(cWidth, cHeight, options) {
        super();			
        this.cWidth = cWidth;
        this.cHeight = cHeight;
        this.init(options);
    }

    init(options) {
        logger.info('PdfCanvas init');
        // 計算畫面大小
        this.leftWidth = options.leftWidth || 50;
        this.rightWidth = options.rightWidth || 20;
        this.chartWidth = this.cWidth - this.leftWidth - this.rightWidth;

        this.topHeight = options.topHeight || 50;
        this.bottomHeight = options.bottomHeight || 20;
        this.chartHeight = this.cHeight - this.topHeight - this.bottomHeight;

        this.canvas = createCanvas(this.cWidth, this.cHeight, 'pdf');
        this.context = this.canvas.getContext('2d');
    }

    paint() {
        // On first page
        this.context.font = '22px Sans';
        this.context.fillText('Hello World', this.leftWidth, this.topHeight);

        this.context.addPage();
        // Now on second page
        this.context.font = '22px Sans'
        // drawString(ctx, txt, x, y, size, font, fontStyle, color, align, base) {
        // this.context.fillText('Hello World 中文', this.leftWidth, this.topHeight);
        this.drawString(this.context, 'Hello World 中文', this.leftWidth, this.topHeight, 22, 'Microsoft Sans Serif', '', '#CC0000', 'left', 'bottom');
        this.drawString(this.context, 'Hello World 中文', this.leftWidth + this.chartWidth, this.topHeight, 22, 'Microsoft Sans Serif', '', '#CC0000', 'right', 'bottom')

        this.drawBgString(this.context, 123, this.leftWidth, this.topHeight + 100 , 10, 'Sans', '', '#FFFFFF', '#CC0000', 'center', 'bottom');
    }

    // 取得畫布 buffer資料
    getCanvasBuffer() {
        return this.canvas.toBuffer('application/pdf');
    }

}
module.exports = PdfCanvas;