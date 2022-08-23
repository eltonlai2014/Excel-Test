const log4js = require('log4js');
const logger = log4js.getLogger('RectChart');
const CommonChart = require('./CommonChart');
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
        console.log('RectChart setChartData ...');
    }

    paint() {
        const aContext = this.context;
        aContext.fillStyle = '#fff';
        aContext.fillRect(0, 0, this.cWidth, this.cHeight);
        
        const text = 'Hello, World!';
        aContext.font = 'bold 20pt Menlo';
        aContext.textBaseline = 'top';
        aContext.fillStyle = '#3574d4';
        const textWidth = aContext.measureText(text).width;
        aContext.fillRect(this.cWidth/2 - textWidth / 2 - 10, this.cHeight/2 - 5, textWidth + 20, 120);
        aContext.fillStyle = '#fff';
        aContext.textAlign = 'center';
        aContext.fillText(text, this.cWidth/2, this.cHeight/2);        
    }


}
module.exports = RectChart;
