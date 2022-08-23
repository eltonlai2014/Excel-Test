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
        this.leftWidth = 100;
        this.rightWidth = 100;
        this.chartWidth = this.cWidth - this.leftWidth - this.rightWidth;

        this.topHeight = 50;
        this.bottomHeight = 100;
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

    setChartData(data) {
        console.log('CommonChart setChartData ...');
    }

}
module.exports = CommonChart;
