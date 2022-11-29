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

const ReportExcel = require('./ReportExcel');
const start = async () => {

    // 準備報表資料
    const report = {};
    report.companyName = '台電';
    report.reportDate = '2022/09/01';
    report.reportSDate = '2022/06/01';
    report.reportEate = '2022/08/31';

    report.reportData = [
        { Month: 202207, Health: 97, Warning: 2, Critical: 2 },
        { Month: 202206, Health: 96, Warning: 2, Critical: 1 },
        { Month: 202208, Health: 98, Warning: 2, Critical: 3 }
    ]

    report.reportData2 = [
        { Month: 202207, Health: 94, Warning: 0, Critical: 6 },
        { Month: 202206, Health: 88, Warning: 5, Critical: 7 },
        { Month: 202208, Health: 98, Warning: 3, Critical: 1 }
    ]

    // 指定報表樣式檔
    const options = {
        StyleFile: 'Style.xlsx',
        StyleSheet: 'Style',
        OperationBlock: true,
        NetworkDeviceBlock: true,
        CriticalEventBlock: true,
        WarningEventBlock: false,
    }
    const aExcel = new ReportExcel(options);
    // 設定資料與產生報表
    await aExcel.genReport(report);
    // 取得buffer
    const buffer = await aExcel.getReportBuffer();

    // 存檔
    try {
        fs.writeFileSync('styleTest.xlsx', buffer);
        console.log("ok");
    } catch (err) {
        console.error(err);
    }

}

start();