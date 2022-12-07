const fs = require('fs');
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

const { ReportExcel } = require('./bundle');
const start = async () => {
     // 準備報表資料
    const report = {};
    report.companyName = '台電';
    report.reportDate = '2022/09/01';
    report.reportSDate = '2022/06/01';
    report.reportEate = '2022/08/31';

    report.reportData = {
        title: '111',
        data: [
            { Month: 202201, Health: 97, Warning: 2, Critical: 2 },
            { Month: 202202, Health: 96, Warning: 2, Critical: 1 },
            { Month: 202203, Health: 98, Warning: 2, Critical: 3 },
            { Month: 202204, Health: 97, Warning: 2, Critical: 2 },
            { Month: 202205, Health: 96, Warning: 2, Critical: 1 },
            { Month: 202206, Health: 98, Warning: 2, Critical: 3 },
            { Month: 202207, Health: 97, Warning: 2, Critical: 2 },
            { Month: 202209, Health: 96, Warning: 2, Critical: 1 },
            // { Month: 202208, Health: 98, Warning: 2, Critical: 3 },
            // { Month: 202204, Health: 97, Warning: 2, Critical: 2 },
            // { Month: 202205, Health: 96, Warning: 2, Critical: 1 },
            // { Month: 202206, Health: 98, Warning: 2, Critical: 3 },
            // { Month: 202207, Health: 97, Warning: 2, Critical: 2 },
            // { Month: 202209, Health: 96, Warning: 2, Critical: 1 },
            // { Month: 202208, Health: 98, Warning: 2, Critical: 3 },
        ]
    }

    report.reportData2 = {
        title: 'aaa',
        data: [
            { Month: 202207, Health: 884, Warning: 0, Critical: 6 },
            // { Month: 202209, Health: 96, Warning: 2, Critical: 1 },
            // { Month: 202208, Health: 98, Warning: 2, Critical: 3 },        
        ]
    }

    report.reportData3 = {
        RankList: [
            { EventType: 99, Rank: [{ SiteId: '123', SiteName: 'aaa', Times: 300}, { SiteId: '123', SiteName: 'bbb', Times: 200 }, { SiteId: '123', SiteName: 'ccc', Times: 100 }] },
            { EventType: 1, Rank: [{ SiteId: '123', SiteName: 'aaa', Times: 10}, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }] },
            { EventType: 2, Rank: [{ SiteId: '123', SiteName: 'aaa', Times: 9}, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }] },
            { EventType: 3, Rank: [{ SiteId: '123', SiteName: 'aaa', Times: 9}, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }] },
            { EventType: 4, Rank: [{ SiteId: '123', SiteName: 'aaa', Times: 8}, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }] },
            { EventType: 5, Rank: [{ SiteId: '123', SiteName: 'aaa', Times: 7}, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }] },
            { EventType: 6, Rank: [{ SiteId: '123', SiteName: 'aaa', Times: 7}, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }] },
            { EventType: 7, Rank: [{ SiteId: '123', SiteName: 'aaa', Times: 7}, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }] },
            { EventType: 8, Rank: [{ SiteId: '123', SiteName: 'aaa', Times: 6}, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }] },
            { EventType: 9, Rank: [{ SiteId: '123', SiteName: 'aaa', Times: 5}, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }] },
            { EventType: 10, Rank: [{ SiteId: '123', SiteName: 'aaa', Times: 5}, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }] },
        ],
    }

    report.reportData4 = {
        RankList: [
            { EventType: 99, Rank: [{ SiteId: '123', SiteName: 'bbb', Times: 300}, { SiteId: '123', SiteName: 'bbb', Times: 200 }, { SiteId: '123', SiteName: 'ccc', Times: 100 }] },
            { EventType: 1, Rank: [{ SiteId: '123', SiteName: 'bbb', Times: 10}, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }] },
            { EventType: 2, Rank: [{ SiteId: '123', SiteName: 'bbb', Times: 9}, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }] },
            { EventType: 3, Rank: [{ SiteId: '123', SiteName: 'bbb', Times: 9}, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }] },
            { EventType: 4, Rank: [{ SiteId: '123', SiteName: 'bbb', Times: 8}, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }] },
            { EventType: 5, Rank: [{ SiteId: '123', SiteName: 'bbb', Times: 7}, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }] },
            { EventType: 6, Rank: [{ SiteId: '123', SiteName: 'bbb', Times: 7}, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }] },
            { EventType: 7, Rank: [{ SiteId: '123', SiteName: 'bbb', Times: 7}, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }] },
            { EventType: 8, Rank: [{ SiteId: '123', SiteName: 'bbb', Times: 6}, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }] },
            { EventType: 9, Rank: [{ SiteId: '123', SiteName: 'bbb', Times: 5}, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }] },
            { EventType: 10, Rank: [{ SiteId: '123', SiteName: 'bbb', Times: 5}, { SiteId: '123', SiteName: 'aaa', Times: 10 }, { SiteId: '123', SiteName: 'aaa', Times: 10 }] },
        ],
    }

    // 指定報表樣式檔
    const options = {
        StyleFile: 'Style.xlsx',
        StyleSheet: 'Style',
        OperationBlock: true,
        NetworkDeviceBlock: true,
        CriticalEventBlock: true,
        WarningEventBlock: true,
        chartOptions : {
            chartWidth: 540, chartHeight: 300,
            leftWidth: 50, rightWidth: 20, topHeight: 20, bottomHeight: 70,
            chartLineWidth: 2,
            chartColor: ['#5B9BD5', '#ED7D31', '#A5A5A5', '#FFC000', '#229B2F', '#6495ED']
        }        
    }
    const aExcel = new ReportExcel(options);
    // 設定資料與產生報表，並取得buffer
    const buffer = await aExcel.genReport(report);

    // 存檔
    try {
        fs.writeFileSync('ReportOrg.xlsx', buffer);
        logger.info("ok");
    } catch (err) {
        logger.error(err);
    }

}

start();