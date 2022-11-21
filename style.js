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

const Excel = require('exceljs');

const start = async ()=>{
    // 讀取樣板檔案
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile('Report_Template.xlsx');
    let worksheet = workbook.getWorksheet('公司報表');

    // 取得欄位寬度
    const colWidth = [];
    for (let i = 1; i <= 20; i++) {
        let aColumn = worksheet.getColumn(i);
        colWidth.push(aColumn.width);
    }
    console.log('colWidth', colWidth);
    // 取得列高
    // 列高目前都一樣

    // 取得樣式
    const bgGray = worksheet.getCell('B1').style;
    const bgWhite = worksheet.getCell('B2').style;

    const reportTitle = worksheet.getCell('C3').style;
    const blockTitle = worksheet.getCell('C13').style;
    const blockContent = worksheet.getCell('D13').style;
    const tableTitle_L = worksheet.getCell('C24').style;
    const tableBody_L = worksheet.getCell('C25').style;
    const tableTitle_R = worksheet.getCell('D24').style;
    const tableBody_R = worksheet.getCell('D25').style;

    let outputSheet = workbook.addWorksheet("台電測試站");

    for (let i = 1; i <= 20; i++) {
        let aColumn = outputSheet.getColumn(i);
        aColumn.width = colWidth[i - 1];
    }

    // 填報表背景顏色
    for (let i = 1; i <= 200; i++) {
        let aRow = outputSheet.getRow(i);
        // 灰底
        for (let j = 1; j <= 20; j++) {
            let aCell = aRow.getCell(j);
            aCell.style = bgGray;
        }
        // 白底
        if (i > 1 && i < 40) {
            for (let j = 2; j <= 14; j++) {
                let aCell = aRow.getCell(j);
                aCell.style = bgWhite;
            }
        }
    }

    // 報表標題
    let startRow = 3;
    let aRow = outputSheet.getRow(startRow);
    let aCell = aRow.getCell(8);
    aCell.value = '公司報表_台電';
    aCell.style = reportTitle;

    // 站台營運服務狀態
    startRow += 3;
    aRow = outputSheet.getRow(startRow);
    aCell = aRow.getCell(3);
    aCell.value = '站台營運服務狀態';
    aCell.style = blockTitle;    

    for (let i = 3; i <= 12; i++) {
        let aCell = aRow.getCell(i + 1);
        aCell.value = '';
        aCell.style = blockContent;
    }

    startRow += 1;
    for (let i = startRow; i <= startRow + 10; i++) {
        let aRow = outputSheet.getRow(i);
        let aStyle_L = tableTitle_L;
        let aStyle_R = tableTitle_R;
        if(i > startRow) {
            aStyle_L = tableBody_L;
            aStyle_R = tableBody_R;            
        }
        for (let i = 1; i < 2; i++) {
            let aCell = aRow.getCell(i + 1);
            aCell.value = i;
            aCell.style = aStyle_L;
        }
        for (let i = 2; i < 10; i++) {
            let aCell = aRow.getCell(i + 1);
            aCell.value = i;
            aCell.style = aStyle_R;
        }
    }    
    startRow += 10;
    console.log('startRow', startRow);

    // 刪除style頁面
    workbook.removeWorksheet(worksheet.id);
    // 產生Excel檔案
    workbook.xlsx.writeFile("styleTest.xlsx");
    console.log("ok");    
}

start();