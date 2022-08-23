const log4js = require('log4js');
const logger = log4js.getLogger('RectChart');
const CommonChart = require('./CommonChart');
const { CanvasRenderingContext2D } = require('canvas');
const _ = require('lodash');
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
        this.chartData = data;
        console.log('RectChart setChartData ...');
    }

    setSiteId(site_id) {
        this.site_id = site_id;
    }

    paint() {
        const aContext = this.context;
        aContext.fillStyle = '#ffffff';
        aContext.fillRect(0, 0, this.cWidth, this.cHeight);

        // aContext.fillStyle = '#3574d4';
        // aContext.fillRect(this.leftWidth, this.topHeight, this.chartWidth, this.chartHeight);
        const axisColor = '#000000';
        const axisWidth = 1;

        // clearLineTo(ctx, fromX, fromY, toX, toY, lineColor, lineWidth){
        this.clearLineTo(aContext, this.leftWidth - 1, this.topHeight, this.leftWidth - 1, this.topHeight + this.chartHeight, axisWidth, axisColor, axisWidth);
        this.clearLineTo(aContext, this.leftWidth - 1, this.topHeight + this.chartHeight, this.cWidth - this.rightWidth, this.topHeight + this.chartHeight, axisColor, axisWidth);

        let yLines = 5;
        for (let i = 0; i < yLines; i++) {
            this.dashedLineTo(aContext, this.leftWidth - 1, this.topHeight + i * this.chartHeight / yLines, this.cWidth - this.rightWidth, this.topHeight + i * this.chartHeight / yLines, axisColor, axisWidth);
        }

        // 遍歷各 event 計算最大值
        let maxEventCount = 0;
        let eventList = [];
        _.forEach(this.chartData, (value, key) => {
            // console.log(key);
            // console.log(value);
            eventList.push(key);
            maxEventCount = Math.max(maxEventCount, value.count);
        });

        // 畫長條方塊
        let unitWidth = this.chartWidth / (eventList.length + 1);
        let rectWidth = unitWidth * 0.6;

        const rectColor = '#3574d4';
        const eventLabelYPos = this.topHeight + this.chartHeight + this.bottomHeight / 2;
        for (let i = 0; i < eventList.length; i++) {
            let aInfo = this.chartData[eventList[i]];
            let rechHeight = (aInfo.count / maxEventCount) * this.chartHeight;
            let xPos = this.leftWidth + (i + 1) * unitWidth;
            this.fillRectEx(aContext, xPos - rectWidth / 2, this.topHeight + this.chartHeight, rectWidth, -rechHeight, rectColor);
            this.clearLineTo(aContext, xPos, this.topHeight, xPos, this.topHeight + this.chartHeight);

            // 畫 eventType Label
            // drawString(ctx, txt, x, y, size, font, color, align, base) 
            this.drawString(aContext, eventList[i], xPos, eventLabelYPos, 10, 'Arial', '#000000', 'center', 'middle');
        }

        // const p = new Path2D('M10,80 q100,120 120,20 q140,-50 160,0');
        // aContext.strokeStyle = 'red';
        // aContext.stroke(p);

    }


}
module.exports = RectChart;
