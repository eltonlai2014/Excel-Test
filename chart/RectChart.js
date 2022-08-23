const log4js = require('log4js');
const logger = log4js.getLogger('RectChart');
const CommonChart = require('./CommonChart');
const { CanvasRenderingContext2D } = require('canvas');
require('canvas-5-polyfill');
class RectChart extends CommonChart {

    constructor(cWidth, cHeight) {
        super(cWidth, cHeight);
        this.myInit();
    }

    myInit() {
        const self = this;
        console.log('RectChart init');
    }

    setChartData(data) {
        super.setChartData(data);
        this.chartData = data ;
        console.log('RectChart setChartData ...');
    }

    paint() {
        const aContext = this.context;
        aContext.fillStyle = '#ffffff';
        aContext.fillRect(0, 0, this.cWidth, this.cHeight);
        
        // aContext.fillStyle = '#3574d4';
        // aContext.fillRect(this.leftWidth, this.topHeight, this.chartWidth, this.chartHeight);        
        const axisColor = '#000000';
        const axisWidth = 1 ;
        const dashStyle = [3, 3];
        this.drawDashLine(aContext, this.leftWidth-1, this.topHeight, this.leftWidth-1, this.topHeight + this.chartHeight, axisWidth, axisColor, dashStyle);
        this.drawDashLine(aContext, this.leftWidth-1, this.topHeight + this.chartHeight, this.cWidth-this.rightWidth, this.topHeight + this.chartHeight, axisWidth, axisColor, dashStyle);

        const p = new Path2D('M10,80 q100,120 120,20 q140,-50 160,0');
        aContext.strokeStyle = 'red';
        aContext.stroke(p);

    }


}
module.exports = RectChart;
