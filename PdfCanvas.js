const log4js = require('log4js');
const logger = log4js.getLogger('PdfCanvas');
const _ = require('lodash');
const { createCanvas, loadImage } = require('canvas')
const DrawLib = require('./chart/DrawLib');
class PdfCanvas extends DrawLib {

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
        this.chartHeight = this.chartHeight * 0.5;
        this.canvas = createCanvas(this.cWidth, this.cHeight, 'pdf');
        this.context = this.canvas.getContext('2d');

        // 方塊顏色
        this.rectColor = options.rectColor || ['#808080', '#B0C4DE', '#E6E6FA', '#FFF0F5', '#229B2F', '#6495ED'];
    }

    setChartData(data) {
        logger.info('RectChart setChartData ...');
        super.setChartData(data);
        this.chartData = data;
        // 遍歷各 event 計算最大值
        this.maxEventCount = 0;
        this.eventList = [];
        _.forEach(this.chartData, (value, key) => {
            // logger.info('key', key, 'value', value);
            this.eventList.push(key);
            this.maxEventCount = Math.max(this.maxEventCount, value.count);
        });
        this.axisY_Max = this.getPrettyUnit(this.maxEventCount);
        return this;
    }

    setSiteId(site_id) {
        this.site_id = site_id;
        return this;
    }

    drawRectImg() {
        logger.info('RectChart paint ...');

        const fontStyle_Normal = '';
        const fontStyle_Bold = 'bold';
        // 背景色
        const aContext = this.context;
        aContext.fillStyle = '#ffffff';
        aContext.fillRect(0, 0, this.cWidth, this.cHeight);

        // 圖標題
        const title_FontSize = 16;
        const title_Font = 'Arial';
        const title_Color = '#000000';
        this.drawString(aContext, this.site_id, this.leftWidth, this.topHeight / 2, title_FontSize, title_Font, fontStyle_Normal, title_Color, 'left', 'middle');

        // X Y軸線
        const axisColor = '#000000';
        const axisWidth = 1;
        this.clearLineTo(aContext, this.leftWidth - 1, this.topHeight, this.leftWidth - 1, this.topHeight + this.chartHeight, axisWidth, axisColor, axisWidth);
        this.clearLineTo(aContext, this.leftWidth - 1, this.topHeight + this.chartHeight, this.cWidth - this.rightWidth, this.topHeight + this.chartHeight, axisColor, axisWidth);

        // 畫Y軸座標與水平線
        const axisY_FontSize = 10;
        const yLines = 5;
        const label_Font = 'Arial';
        const label_Color = '#000000';
        for (let i = 0; i < yLines; i++) {
            const yPos = this.topHeight + i * this.chartHeight / yLines;
            if (i > 0) {
                // 水平線
                this.dashedLineTo(aContext, this.leftWidth - 1, yPos, this.cWidth - this.rightWidth, yPos, axisColor, axisWidth);
            }
            // 座標
            this.drawString(aContext, (yLines - i) * this.axisY_Max / yLines, this.leftWidth - 4, yPos, axisY_FontSize, label_Font, fontStyle_Normal, label_Color, 'right', 'middle');
        }
        this.drawString(aContext, '0', this.leftWidth - 4, this.topHeight + this.chartHeight, axisY_FontSize, label_Font, fontStyle_Normal, label_Color, 'right', 'middle');

        // 畫方塊
        const unitWidth = this.chartWidth / (this.eventList.length + 1);
        const rectWidth = unitWidth * 0.6;
        const eventLabelYPos = this.topHeight + this.chartHeight + this.bottomHeight / 2;
        for (let i = 0; i < this.eventList.length; i++) {
            const aInfo = this.chartData[this.eventList[i]];
            const rechHeight = (aInfo.count / this.axisY_Max) * this.chartHeight;
            const xPos = this.leftWidth + (i + 1) * unitWidth;
            this.fillRectEx(aContext, xPos - rectWidth / 2, this.topHeight + this.chartHeight, rectWidth, -rechHeight, this.rectColor[(i % this.rectColor.length)]);
            // this.clearLineTo(aContext, xPos, this.topHeight, xPos, this.topHeight + this.chartHeight);
            // 數值 Label
            // drawBgString(ctx, txt, x, y, size, font, color, bgcolor, align, base)
            if (aInfo.count == this.maxEventCount && this.maxEventCount > 0) {
                this.drawBgStringRoundRect(aContext, aInfo.count, xPos, this.topHeight + this.chartHeight - rechHeight - 2, 10, label_Font, fontStyle_Bold, '#FFFFFF', '#CC0000', 'center', 'bottom');
            } else {
                this.drawBgStringRoundRect(aContext, aInfo.count, xPos, this.topHeight + this.chartHeight - rechHeight - 2, 10, label_Font, fontStyle_Normal, label_Color, '#FFFFFF', 'center', 'bottom');
            }

            // 畫 eventType Label
            this.drawString(aContext, this.eventList[i], xPos, eventLabelYPos, 10, label_Font, fontStyle_Normal, label_Color, 'center', 'middle');
        }
        return this;
    }

    drawYAxis_Debug() {
        let aFontSize = 10;
        let aFont = 'Microsoft Sans Serif';
        let aFontStyle = '';
        let unit = 20;
        for (let i = 0; i < this.cHeight; i += unit) {
            this.drawString(this.context, i, 4, i, aFontSize, aFont, aFontStyle, '#000000', 'left', 'bottom');
        }
    }

    paint() {
        let aFontSize = 14;
        let aFont = 'Microsoft Sans Serif';
        let aFontStyle = '';
        // On first page
        this.drawRectImg();
        this.drawString(this.context, 'Hello World 中文', this.leftWidth, this.topHeight + this.chartHeight + this.bottomHeight + 30, aFontSize, aFont, aFontStyle, '#CC0000', 'left', 'bottom');

        // Now on second page
        this.context.addPage();
        this.drawYAxis_Debug();

        // a table to draw
        let rows = 10;
        let rowHeight = this.chartHeight / rows;
        let axisColor = '000000';
        let axisWidth = 1;
        let titleBgColor = '#dddddd';

        // 標題列底色
        this.fillRectEx(this.context, this.leftWidth, this.topHeight, this.chartWidth, rowHeight, titleBgColor);
        // 水平線
        for (let i = 0; i <= rows; i++) {
            let yPos = Math.round(this.topHeight + i * rowHeight);
            this.clearLineTo(this.context, this.leftWidth, yPos, this.cWidth - this.rightWidth, yPos, axisColor, axisWidth);
        }
        // 垂直線
        let xPos = [0, 100, 200, 400, this.cWidth - this.rightWidth - this.leftWidth];
        for (let i = 0; i < xPos.length; i++) {
            this.clearLineTo(this.context, this.leftWidth + xPos[i], this.topHeight, this.leftWidth + xPos[i], this.topHeight + this.chartHeight, axisColor, axisWidth);
        }
        // 表格內容
        for (let i = 1; i <= rows; i++) {
            let yPos = Math.round(this.topHeight + i * rowHeight - rowHeight / 2);
            for (let j = 0; j < xPos.length - 1; j++) {
                let aXPos = this.leftWidth + xPos[j] + 4;
                let aContent = '標題 ' + i + '_' + j;
                if (i != 1) {
                    aContent = '內容 ' + i + '_' + j;
                }
                this.drawString(this.context, aContent, aXPos, yPos, aFontSize, aFont, aFontStyle, '#333333', 'left', 'middle');
            }
        }

        // 表格title
        this.drawString(this.context, '用畫的假表格', this.leftWidth, this.topHeight - 4, aFontSize, aFont, aFontStyle, '#000000', 'left', 'bottom');

        // this.drawString(this.context, 'Hello World 中文', this.leftWidth + this.chartWidth, this.topHeight, aFontSize, aFont, '', '#CC0000', 'right', 'bottom')

        this.drawBgStringRoundRect(this.context, 123, this.leftWidth, this.topHeight + 100, 10, aFont, aFontStyle, '#FFFFFF', '#CC0000', 'center', 'bottom');
    }

    // 取得畫布 buffer資料
    getCanvasBuffer() {
        return this.canvas.toBuffer('application/pdf');
    }

}
module.exports = PdfCanvas;