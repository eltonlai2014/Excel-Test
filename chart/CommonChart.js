const log4js = require('log4js');
const logger = log4js.getLogger('CommonChart');
const { createCanvas, loadImage } = require('canvas');
class CommonChart {

    constructor(cWidth, cHeight) {
        this.cWidth = cWidth;
        this.cHeight = cHeight;
        this.init();
    }

    init() {
        logger.info('CommonChart init');

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

    getChartInfo() {
        return this.chartWidth + " " + this.chartHeight
    }
    getCanvasBuffer(imageType) {
        imageType = imageType || 'image/png';
        const buffer = this.canvas.toBuffer(imageType);
        return buffer;
    }

    drawString(ctx, txt, x, y, size, font, color, align, base) {
        // 畫字串
        color = color || "#000000";
        base = base || "bottom";
        align = align || "left";
        font = font || "Arial";
        ctx.save();
        ctx.fillStyle = color;
        ctx.font = size + "pt " + font;
        ctx.textAlign = align;
        ctx.textBaseline = base;
        if (size <= 8) {
            //因為chrome字型指定9px就不能更小，故用ctx.scale縮放處理 (x,y,size 先放大兩倍，再scale 0.5) 
            //放大前先紀錄
            size *= 2;
            x *= 2;
            y *= 2;
            ctx.font = size + "pt " + font;
            ctx.scale(0.5, 0.5);
            ctx.fillText(txt, x, y);
        }
        else {
            ctx.fillText(txt, x, y);
        }
        let wordWidth = ctx.measureText(txt).width;
        //回復
        ctx.restore();
        return wordWidth;
    }

    drawLine(ctx, x1, y1, x2, y2, color, width) {
        width = width || 1;
        color = color || '#000000';
        ctx.beginPath();
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    drawDashLine(ctx, x1, y1, x2, y2, color, width, dashStyle) {
        // 設置線條樣式
        dashStyle = dashStyle || [3, 3];
        ctx.setLineDash(dashStyle);
        this.drawLine(ctx, x1, y1, x2, y2, width, color);
        // 恢復實線
        ctx.setLineDash([]);
    }

    // 圓角矩形
    drawRoundRect(ctx, x, y, width, height, radius, fill, stroke, lineWidth) {
        if (typeof stroke === "undefined") {
            stroke = true;
        }
        if (typeof fill === "undefined") {
            fill = false;
        }
        if (typeof radius === "undefined") {
            radius = 5;
        }
        lineWidth = lineWidth || 1.2;
        //x = Math.round(x);
        //y = Math.round(y);
        ctx.save();
        ctx.translate(0.5, 0.5);
        ctx.beginPath();
        // 畫圓角
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.lineWidth = lineWidth;
        ctx.closePath();
        if (stroke) {
            ctx.stroke();
        }
        if (fill) {
            ctx.fill();
        }
        ctx.restore();
    }

    // 畫清晰虛線
    dashedLineTo(ctx, fromX, fromY, toX, toY, lineColor, lineWidth, pattern) {
        // 設置線條樣式
        pattern = pattern || [3, 3];
        ctx.save();
        ctx.setLineDash(pattern);
        this.clearLineTo(ctx, fromX, fromY, toX, toY, lineColor, lineWidth);
        // 恢復實線
        ctx.restore();
    }

    // 畫清晰直線，避免antialias
    clearLineTo(ctx, fromX, fromY, toX, toY, lineColor, lineWidth) {
        // default lineWidth -> 1px lineColor -> #FFFFFF
        lineWidth = lineWidth || 1;
        lineColor = lineColor || '#000000';
        // 避免畫線時產生antialias，save()->translate()->restore()
        ctx.save();
        ctx.translate(0.5, 0.5);
        // draw line
        fromX = Math.round(fromX);
        fromY = Math.round(fromY);
        toX = Math.round(toX);
        toY = Math.round(toY);
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = lineColor;
        ctx.stroke();
        ctx.restore();
    }

    // 虛線
    /*
    dashedLineToEx(ctx, fromX, fromY, toX, toY, lineColor, lineWidth, pattern) {
        // default interval distance -> 5px
        if (typeof pattern === "undefined") {
            pattern = 5;
        }
        lineWidth = lineWidth || 1;
        lineColor = lineColor || '#FFFFFF';
        // 避免畫線時產生antialias，save()->translate()->restore()
        ctx.save();
        ctx.translate(0.5, 0.5);
        // calculate the delta x and delta y
        var dx = (toX - fromX);
        var dy = (toY - fromY);
        var distance = Math.floor(Math.sqrt(dx * dx + dy * dy));
        var dashlineInteveral = (pattern <= 0) ? distance : (distance / pattern);
        var deltay = (dy / distance) * pattern;
        var deltax = (dx / distance) * pattern;
        // draw dash line
        ctx.beginPath();
        for (var dl = 0; dl < dashlineInteveral; dl++) {
            if (dl % 2) {
                ctx.lineTo(Math.round(fromX + dl * deltax), Math.round(fromY + dl * deltay));
            } else {
                ctx.moveTo(Math.round(fromX + dl * deltax), Math.round(fromY + dl * deltay));
            }

        }
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = lineColor;
        ctx.stroke();
        ctx.restore();
    }
    */

    // 任意線段，避免antialias，用矩形模擬
    /*
    public drawLineNoAliasing(ctx: CanvasRenderingContext2D, sx: number, sy: number, tx: number, ty: number, lineColor?: string): void {
        lineColor = lineColor || '#FFFFFF';
        let dist = Syspower.Util.DBP(sx, sy, tx, ty); // length of line
        let ang = Syspower.Util.getAngle(tx - sx, ty - sy); // angle of line
        ctx.save();
        ctx.fillStyle = lineColor;
        for (let i = 0; i < dist; i++) {
            // for each point along the line
            ctx.fillRect(Math.round(sx + Math.cos(ang) * i), // round for perfect pixels
                Math.round(sy + Math.sin(ang) * i), // thus no aliasing
                1, 1); // fill in one pixel, 1x1
        }
        ctx.restore();
    }
    */

    // 畫清晰矩形 !!注意自訂方法名稱不要取為跟物件既有的名子重覆，否則效能會很差
    drawRectEx(ctx, x, y, width, height, color, lineWidth) {
        this.clearLineTo(ctx, x, y, x + width, y, color, lineWidth);
        this.clearLineTo(ctx, x + width, y, x + width, y + height, color, lineWidth);
        this.clearLineTo(ctx, x + width, y + height, x, y + height, color, lineWidth);
        this.clearLineTo(ctx, x, y + height, x, y, color, lineWidth);
    }

    fillRectEx(ctx, x, y, width, height, color) {
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.fillStyle = color;
        ctx.fill();
    }


    setChartData(data) {
        console.log('CommonChart setChartData ...');
    }

}
module.exports = CommonChart;
