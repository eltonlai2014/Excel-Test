const log4js = require('log4js');
const logger = log4js.getLogger('CommonChart');
const { createCanvas, loadImage } = require('canvas');
class CommonChart{

    constructor(cWidth, cHeight) {
        this.cWidth = cWidth;
        this.cHeight = cHeight;
        this.init();
    }

    init() {
        const self = this;
        console.log('CommonChart init');

        // 計算畫面大小
        this.leftWidth = 50;
        this.rightWidth = 20;
        this.chartWidth = this.cWidth - this.leftWidth - this.rightWidth;

        this.topHeight = 50;
        this.bottomHeight = 20;
        this.chartHeight = this.cHeight - this.topHeight - this.bottomHeight;

        this.canvas = createCanvas(this.cWidth, this.cHeight);
        this.context = this.canvas.getContext('2d');

    }

    getChartInfo(){
        return this.chartWidth + " " + this.chartHeight
    }
    getCanvasBuffer(imageType) {       
        imageType = imageType || 'image/png';
        const buffer = this.canvas.toBuffer(imageType);
        return buffer ;
    }

    drawLine(ctx, x1, y1, x2, y2, width, color) {
        width = width || 1;
        color = color || '#000000';        
        ctx.beginPath();
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    drawDashLine(ctx, x1, y1, x2, y2, width, color, dashStyle) {
        // 設置線條樣式
        dashStyle = dashStyle || [3, 3];
        ctx.setLineDash(dashStyle);
        this.drawLine(ctx, x1, y1, x2, y2, width, color);
        // 恢復實線
        ctx.setLineDash([]);
    }

    setChartData(data) {
        console.log('CommonChart setChartData ...');
    }

}
module.exports = CommonChart;
