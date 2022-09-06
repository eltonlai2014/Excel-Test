const fs = require('fs');
const path = require('path');
const _ = require('lodash');

if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}
const log4js = require('log4js');
const logger = log4js.getLogger('index');

logFilename = 'logs/log';
log4js.addLayout('json', function (config) {
    return function (logEvent) {
        logEvent.caller = logEvent.fileName + ':' + logEvent.lineNumber;
        return JSON.stringify(logEvent) + config.separator;
    };
});

log4js.configure({
    appenders: {
        out: {
            type: 'console',
        },
        task: {
            type: 'dateFile',
            // layout: { type: 'json', separator: ',' },
            filename: logFilename,
            alwaysIncludePattern: true,
            numBackups: 15,
        },
    },
    categories: {
        default: {
            appenders: ['out', 'task'],
            level: 'INFO',
            enableCallStack: true,
        },
    },
});


// 讀取圖檔資訊
let chartData = null;
// read dataFile
const dataFile = path.join('chart_data.json').normalize();
const hasFile = fs.existsSync(dataFile);
logger.info('load dataFile', hasFile, dataFile);
if (hasFile) {
    try {
        const file = fs.readFileSync(dataFile, 'utf8');
        chartData = JSON.parse(file);
    } catch (err) {
        logger.error(err);
    }
}
// logger.info('chartData', chartData);

let xMap = {};
let deviceMap = {};
for (let i = 0; i < chartData.length; i++) {
    // site內 type 次數加總
    let aKey = chartData[i].site_id;
    let aTypeKey = chartData[i].type;
    if (!xMap[aKey]) {
        xMap[aKey] = {};
    }
    if (!xMap[aKey][aTypeKey]) {
        xMap[aKey][aTypeKey] = {};
        xMap[aKey][aTypeKey].count = chartData[i].eventcount;
        xMap[aKey][aTypeKey].detail = [];
    }
    else {
        xMap[aKey][aTypeKey].count += chartData[i].eventcount;
    }
    xMap[aKey][aTypeKey].detail.push(chartData[i]);

    // site內 device->type 分組
    let aDeviceKey = chartData[i].device_id;
    if (!deviceMap[aDeviceKey]) {
        deviceMap[aDeviceKey] = {};
        deviceMap.site_id = chartData[i].site_id;
    }
    if (!deviceMap[aDeviceKey][aTypeKey]) {
        deviceMap[aDeviceKey][aTypeKey] = {};
        deviceMap[aDeviceKey][aTypeKey].count = chartData[i].eventcount;
        deviceMap[aDeviceKey][aTypeKey].detail = [];
    }
    else {
        deviceMap[aDeviceKey][aTypeKey].count += chartData[i].eventcount;
    }
    deviceMap[aDeviceKey][aTypeKey].detail.push(chartData[i]);
}

const options2 = {
    leftWidth: 50, rightWidth: 20, topHeight: 50, bottomHeight: 20,
    rectColor: ['#808080', '#B0C4DE', '#E6E6FA', '#FFF0F5', '#008080', '#6495ED']
};
const PdfCanvas = require('./PdfCanvas');
// A4 = 595 x 842
const aPdfCanvas = new PdfCanvas(595, 842, options2);

// 繪製圖檔並產生png buffer    
let aKey = '5395af66cfb8ce68';
aPdfCanvas.setChartData(xMap[aKey]).setSiteId(aKey).paint();
// aPdfCanvas.paint();
const buffer2 = aPdfCanvas.getCanvasBuffer();

fs.writeFileSync('./test.pdf', buffer2);