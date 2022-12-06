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

const ReportExcelSite = require('./ReportExcelSite');
const start = async () => {

    // 準備報表資料
    const report = {};
    report.companyName = '台電';
    report.siteName = '彰林 PS';
    report.reportDate = '2022/09/01';
    report.reportSDate = '2022/06/01';
    report.reportEate = '2022/08/31';

    report.reportData = {
        // title: '111',
        data: [
            { Month: 202201, Warning: 2, Critical: 2 },
            { Month: 202202, Warning: 2, Critical: 0 },
            { Month: 202203, Warning: 2, Critical: 3 },
            { Month: 202204, Warning: 2, Critical: 0 },
            { Month: 202205, Warning: 2, Critical: 1 },
            { Month: 202206, Warning: 2, Critical: 3 },
            // { Month: 202207, Health: 97, Warning: 2, Critical: 2 },
            // { Month: 202209, Health: 96, Warning: 2, Critical: 1 },
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
        // title: '111',        
        data: [
            { Month: 202207, Health: 94, Warning: 0, Critical: 12 },
            { Month: 202209, Health: 96, Warning: 2, Critical: 1 },
            { Month: 202208, Health: 98, Warning: 2, Critical: 3 },
        ]
    }

    report.reportData3 = {
        RankTotal:52, 
        RankList: [
            { EventType: 1, EventName: 'Device unreachable', Count: 10},
            { EventType: 2, EventName: 'Network alert', Count: 8},
            { EventType: 3, EventName: 'Ethernet port alert', Count: 1},
            { EventType: 4, EventName: 'Fiber port alert', Count: 3},
            { EventType: 5, EventName: 'Power supply alert', Count: 10},
            { EventType: 6, EventName: 'Network intrusion alert', Count: 2},
            { EventType: 7, EventName: 'Device security alert', Count: 2},
            { EventType: 8, EventName: 'Device Status Alert', Count: 1},
            { EventType: 9, EventName: 'MXview One Server Alert', Count: 5},
            { EventType: 10, EventName: 'GOOSE', Count: 10},
        ],
    }

    report.reportData4 = {
        RankTotal:52, 
        RankList: [
            { EventType: 4, Categroy: 'Fiber port alert', EventName: 'SFP voltage below threshold', Count: 3},
            { EventType: 5, Categroy: 'Power supply alert', EventName: 'PWR 1 Off->On', Count: 10},
            { EventType: 6, Categroy: 'Network intrusion alert', EventName: 'Too many login failures, web access temporarily blocked', Count: 2},
            { EventType: 7, Categroy: 'Device security alert', EventName: 'Login Fail', Count: 2},
            { EventType: 8, Categroy: 'Device Status Alert', EventName: 'Config. Changed', Count: 1},
            { EventType: 1, Categroy: 'Device unreachable', EventName: 'Device SNMP unreachable', Count: 10},
            { EventType: 2, Categroy: 'Network alert', EventName: 'Topology Changed', Count: 8},
            { EventType: 3, Categroy: 'Ethernet port alert', EventName: 'Input bandwidth utilization is over the threshold.', Count: 1},            
            { EventType: 9, Categroy: 'MXview One Server Alert', EventName: 'Free memory < 20%', Count: 5},
            { EventType: 10, Categroy: 'GOOSE', EventName: 'GOOSE timeout', Count: 10},
        ],
    }

    // 指定報表樣式檔
    const options = {
        StyleFile: 'StyleSite.xlsx',
        StyleSheet: 'Style',
        OperationBlock: true,
        NetworkDeviceBlock: true,
        EventTypeBlock: true,
        EventRankBlock: true,
        WarningEventBlock: false,
        chartOptions : {
            chartWidth: 540, chartHeight: 300,
            leftWidth: 50, rightWidth: 20, topHeight: 20, bottomHeight: 70,
            chartLineWidth: 2,
            chartColor: ['#5B9BD5', '#ED7D31', '#A5A5A5', '#FFC000', '#229B2F', '#6495ED']
        }
    }
    const aExcel = new ReportExcelSite(options);
    // 設定資料與產生報表，並取得buffer
    const buffer = await aExcel.genReport(report);

    // 存檔
    try {
        fs.writeFileSync('ReportSite.xlsx', buffer);
        logger.info("ok");
    } catch (err) {
        logger.error(err);
    }

}

start();