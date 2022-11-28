const log4js = require('log4js');
const logger = log4js.getLogger('SiteChart');
const CommonChart = require('./CommonChart');
const _ = require('lodash');
// require('canvas-5-polyfill');
class SiteChart extends CommonChart {

    constructor(cWidth, cHeight, options) {
        super(cWidth, cHeight, options);
        this.myInit(options);
    }

    myInit(options) {
        logger.info('SiteChart init');
        // 方塊顏色
        this.rectColor = options.rectColor || ['#5B9BD5', '#ED7D31', '#A5A5A5', '#FFC000', '#229B2F', '#6495ED'];
    }

    setChartData(data) {
        logger.info('SiteChart setChartData ...');
        super.setChartData(data);
        this.chartData = data;
        // let data = [
        //     {Month: '六月', Health: 97, Warning: 2, Critical: 1},
        //     {Month: '七月', Health: 97, Warning: 2, Critical: 1},
        //     {Month: '八月', Health: 97, Warning: 2, Critical: 1}
        // ]
        // 遍歷歷史資料計算最大值最小值
        this.maxValue = 0;
        for (let i = 0; i < data.length; i++) {
            let aInfo = data[i];
            aInfo.Total = aInfo.Health + aInfo.Warning + aInfo.Critical;
            this.maxValue = Math.max(this.maxValue, aInfo.Total);
        }
        // 將資料依照日期排序
        data = _.sortBy(data, ['Month']);
        console.log('data', data, this.maxValue);
        // 取坐標軸最大值
        this.axisY_Max = this.getPrettyUnit(this.maxValue);
        return this;
    }

    getChartInfo() {
        console.log(this.leftWidth, this.chartWidth, this.rightWidth);
        console.log(this.topHeight, this.chartHeight, this.bottomHeight);
    }
    paint() {
        logger.info('SiteChart paint ...');
        this.getChartInfo();
        const fontStyle_Normal = '';
        const fontStyle_Bold = 'bold';
        // 背景色
        const aContext = this.context;
        aContext.fillStyle = '#ffffff';
        aContext.fillRect(0, 0, this.cWidth, this.cHeight);

        // 外框線
        const bolderColor = '#AAAAAA';
        const borderWidth = 1;
        this.clearLineTo(aContext, 0, 0, this.cWidth, 0, bolderColor, borderWidth);
        this.clearLineTo(aContext, 0, this.cHeight - 1, this.cWidth, this.cHeight - 1, bolderColor, borderWidth);
        this.clearLineTo(aContext, 0, 0, 0, this.cHeight - 1, bolderColor, borderWidth);
        this.clearLineTo(aContext, this.cWidth - 1, 0, this.cWidth - 1, this.cHeight - 1, bolderColor, borderWidth);

        // 圖標題
        // const title_FontSize = 16 ;
        // const title_Font = 'Arial' ;
        // const title_Color = '#000000';
        // this.drawString(aContext, this.site_id, this.leftWidth, this.topHeight / 2, title_FontSize, title_Font, fontStyle_Normal, title_Color, 'left', 'middle');

        // X Y軸線
        const axisColor = '#CCCCCC';
        const axisWidth = 1;
        this.clearLineTo(aContext, this.leftWidth - 1, this.topHeight, this.leftWidth - 1, this.topHeight + this.chartHeight, axisColor, axisWidth);
        this.clearLineTo(aContext, this.leftWidth - 1, this.topHeight + this.chartHeight, this.cWidth - this.rightWidth, this.topHeight + this.chartHeight, axisColor, axisWidth);

        // 畫Y軸座標與水平線
        const axisY_FontSize = 10;
        const yLines = 5;
        const label_Font = 'Arial';
        const label_Color = '#333333';
        for (let i = 0; i < yLines; i++) {
            const yPos = this.topHeight + i * this.chartHeight / yLines;
            if (i > 0) {
                // 水平線
                // this.dashedLineTo(aContext, this.leftWidth - 1, yPos, this.cWidth - this.rightWidth, yPos, axisColor, axisWidth);
                this.clearLineTo(aContext, this.leftWidth - 1, yPos, this.cWidth - this.rightWidth, yPos, axisColor, axisWidth);
            }
            // 座標
            this.drawString(aContext, (yLines - i) * this.axisY_Max / yLines, this.leftWidth - 4, yPos, axisY_FontSize, label_Font, fontStyle_Normal, label_Color, 'right', 'middle');
        }
        // 最小值座標
        this.drawString(aContext, '0', this.leftWidth - 4, this.topHeight + this.chartHeight + 2, axisY_FontSize, label_Font, fontStyle_Normal, label_Color, 'right', 'bottom');
        this.drawString(aContext, 'Sites', this.leftWidth - 4, this.topHeight + this.chartHeight + 4, axisY_FontSize, label_Font, fontStyle_Normal, label_Color, 'right', 'top');

        // 畫趨勢圖
        aContext.save();
        const unitWidth = this.chartWidth / this.chartData.length;
        let key = ['Health', 'Warning', 'Critical', 'Total'];
        let chartWidth = 4;
        for (let j = 0; j < key.length; j++) {
            let aKey = key[j];
            let fromX = null;
            let fromY = null;
            for (let i = 0; i < this.chartData.length; i++) {
                let aInfo = this.chartData[i];
                const xPos = this.leftWidth + (i + 0.5) * unitWidth;
                // this.axisY_Max
                let yPos = this.topHeight + ((this.axisY_Max - aInfo[aKey]) / this.axisY_Max) * this.chartHeight;
                // console.log(xPos, yPos, aInfo.time);
                if (fromX != null && fromY != null) {
                    this.clearLineTo(aContext, fromX, fromY, xPos, yPos, this.rectColor[(j % this.rectColor.length)], chartWidth);
                }
                fromX = xPos;
                fromY = yPos;

                // 日期Label
                if (j == 0) {
                    this.drawString(aContext, aInfo.Month, xPos, this.topHeight + this.chartHeight + 4, 10, label_Font, fontStyle_Normal, label_Color, 'center', 'top');
                }
            }
        }

        // 畫圖例說明
        let hintWidth = 30;
        let hintHeight = 6;

        let yPos = this.cHeight - 16;
        for (let i = 0; i < key.length; i++) {
            let xPos = this.leftWidth + (this.chartWidth / key.length) * i;
            this.drawString(aContext, key[i], xPos + hintWidth + 4, yPos, 10, label_Font, fontStyle_Normal, label_Color, 'left', 'moddle');
            this.fillRectEx(aContext, xPos, yPos - hintHeight - 2, hintWidth, hintHeight, this.rectColor[i]);
        }

        aContext.restore();
        return this;
    }

}
module.exports = SiteChart;