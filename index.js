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


const data = [
    {
        firstName: "John",
        lastName: "Bailey",
        purchasePrice: 1000,
        paymentsMade: 100,
    },
    {
        firstName: "Leonard",
        lastName: "Clark",
        purchasePrice: 1000,
        paymentsMade: 150,
    },
    {
        firstName: "Phil",
        lastName: "Knox",
        purchasePrice: 1000,
        paymentsMade: 200,
    },
    {
        firstName: "Sonia",
        lastName: "Glover",
        purchasePrice: 1000,
        paymentsMade: 250,
    },
    {
        firstName: "Adam",
        lastName: "Mackay",
        purchasePrice: 1000,
        paymentsMade: 350,
    },
    {
        firstName: "Lisa",
        lastName: "Ogden",
        purchasePrice: 1000,
        paymentsMade: 400,
    },
    {
        firstName: "Elizabeth",
        lastName: "Murray",
        purchasePrice: 1000,
        paymentsMade: 500,
    },
    {
        firstName: "Caroline",
        lastName: "Jackson",
        purchasePrice: 1000,
        paymentsMade: 350,
    },
    {
        firstName: "Kylie",
        lastName: "James",
        purchasePrice: 1000,
        paymentsMade: 900,
    },
    {
        firstName: "Harry",
        lastName: "Peake",
        purchasePrice: 1000,
        paymentsMade: 1000,
    },
];

const Excel = require('exceljs');
// need to create a workbook object. Almost everything in ExcelJS is based off of the workbook object.
let workbook = new Excel.Workbook();

let worksheet = workbook.addWorksheet("Debtors");

// ?????????????????????????????????key
worksheet.columns = [
    { header: "??????", key: "firstName" },
    { header: "Last Name", key: "lastName" },
    { header: "Purchase Price", key: "purchasePrice" },
    { header: "Payments Made", key: "paymentsMade" },
    { header: "Amount Remaining", key: "amountRemaining" },
    { header: "% Remaining", key: "percentRemaining" },
];

// force the columns to be at least as long as their header row.
// Have to take this approach because ExcelJS doesn't have an autofit property.
worksheet.columns.forEach((column) => {
    if (column.header) {
        column.width = column.header.length < 12 ? 12 : column.header?.length;
    }
});

// Make the header bold.
// Note: in Excel the rows are 1 based, meaning the first row is 1 instead of 0.
worksheet.getRow(1).font = { bold: true };


// Dump all the data into Excel
data.forEach((e, index) => {
    // row 1 is the header.
    const rowIndex = index + 2;

    // By using destructuring we can easily dump all of the data into the row without doing much
    // We can add formulas pretty easily by providing the formula property.
    worksheet.addRow({
        ...e,
        amountRemaining: {
            formula: `=C${rowIndex}-D${rowIndex}`,
        },
        percentRemaining: {
            formula: `=E${rowIndex}/C${rowIndex}`,
        },
    });
});

const totalNumberOfRows = worksheet.rowCount;

// Add the total Rows
worksheet.addRow([
    "",
    "Total",
    {
        formula: `=sum(C2:C${totalNumberOfRows})`,
    },
    {
        formula: `=sum(D2:D${totalNumberOfRows})`,
    },
    {
        formula: `=sum(E2:E${totalNumberOfRows})`,
    },
    {
        formula: `=E${totalNumberOfRows + 1}/C${totalNumberOfRows + 1}`,
    },
]);

// Set the way columns C - F are formatted
const figureColumns = [3, 4, 5, 6];
figureColumns.forEach((i) => {
    worksheet.getColumn(i).numFmt = "$0.00";
    worksheet.getColumn(i).alignment = { horizontal: "center" };
});

// Column F needs to be formatted as a percentage.
worksheet.getColumn(6).numFmt = "0.00%";

// loop through all of the rows and set the outline style.
// ??????
worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
    worksheet.getCell(`A${rowNumber}`).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        // right: {style: 'none'}
    };

    const insideColumns = ["B", "C", "D", "E"];

    insideColumns.forEach((v) => {
        worksheet.getCell(`${v}${rowNumber}`).border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: undefined },
            right: { style: undefined },
        };
    });

    worksheet.getCell(`F${rowNumber}`).border = {
        top: { style: "thin" },
        left: { style: undefined },
        bottom: { style: "thin" },
        right: { style: "thin" },
    };
});

// The last A cell needs to have some of it's borders removed.\
// ????????? ?????????????????????
worksheet.getCell(`A${worksheet.rowCount}`).border = {
    top: { style: "thin" },
    left: { style: undefined },
    bottom: { style: undefined },
    right: { style: "thin" },
};


const totalCell = worksheet.getCell(`B${worksheet.rowCount}`);
totalCell.font = { bold: true };
totalCell.alignment = { horizontal: "center" };

// Create a freeze pane, which means we'll always see the header as we scroll around.
// ????????????
worksheet.views = [{ state: "frozen", xSplit: 2, ySplit: 1, activeCell: "C2" }];


let worksheet2 = workbook.addWorksheet("Debtors2");
// ???????????????????????????
let myTable = {
    name: 'MyTable',
    ref: 'A1',
    headerRow: true,
    style: {
        theme: 'TableStyleMedium4',
        showRowStripes: true,
    },
    columns: [],
    rows: []
}

myTable.columns.push({ name: 'Date', filterButton: true });
myTable.columns.push({ name: 'Amount', filterButton: true });

for (let i = 0; i < 20; i++) {
    myTable.rows.push([new Date('2019-07-20'), i]);
}

worksheet2.addTable(myTable);

let myTable2 = (JSON.parse(JSON.stringify(myTable)));
myTable2.name = "MyTable2";
myTable2.ref = "E1";

worksheet2.addTable(myTable2);


worksheet2.views = [{ state: "frozen", ySplit: 1 }];
worksheet2.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
// Keep in mind that reading and writing is promise based.

// ????????????????????????
const imageId = workbook.addImage({
    filename: `images\\gitlab.jpg`,
    extension: 'jpeg',
});
worksheet2.addImage(imageId, { tl: { col: 10, row: 10 }, ext: { width: 140, height: 90 } });

// ??????????????????
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
    // site??? type ????????????
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

    // site??? device->type ??????
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

logger.info('xMap', xMap);
// logger.info('deviceMap', deviceMap);

// ??????
const RectChect = require('./chart/RectChart');
const options = {
    leftWidth: 50, rightWidth: 20, topHeight: 50, bottomHeight: 20,
    rectColor :['#808080', '#B0C4DE', '#E6E6FA', '#FFF0F5', '#008080', '#6495ED']
};

let chartPos = [
    { col:16, row:2 }, 
    { col:16, row:20 }, 
];

let counter = 0 ;
_.forEach(xMap, (value, key) => {
    console.log(key, value);
    const aRectChart = new RectChect(600, 300, options);
    // console.log(aRectChart.getChartInfo());
    // ?????????????????????png buffer    
    aRectChart.setChartData(value).setSiteId(key).paint();
    const buffer = aRectChart.getCanvasBuffer();
    // ??????excel workbook
    const imageId2 = workbook.addImage({
        buffer: buffer,
        extension: 'png',
    });

    worksheet.addImage(imageId2, { tl: { col: chartPos[counter].col, row: chartPos[counter].row }, ext: { width: 600, height: 300 } });
    counter++;
});


// ??????????????????
let chartData2 = null;
// read dataFile
const dataFile2 = path.join('ts_data.json').normalize();
const hasFile2 = fs.existsSync(dataFile);
logger.info('load dataFile', hasFile2, dataFile2);
if (hasFile2) {
    try {
        const file = fs.readFileSync(dataFile2, 'utf8');
        chartData2 = JSON.parse(file);
    } catch (err) {
        logger.error(err);
    }
}

// ??????
const TrendChect = require('./chart/TrendChart');
const options2 = {
    leftWidth: 50, rightWidth: 20, topHeight: 50, bottomHeight: 20,
    rectColor :['#808080', '#B0C4DE', '#E6E6FA', '#FFF0F5', '#008080', '#6495ED']
};

// logger.info('chartData2', chartData2);
const aTrendChect = new TrendChect(600, 300, options2);
// ?????????????????????png buffer    
aTrendChect.setChartData(chartData2).paint();
const buffer = aTrendChect.getCanvasBuffer();

    // ??????excel workbook
    const imageId3 = workbook.addImage({
        buffer: buffer,
        extension: 'png',
    });

    worksheet.addImage(imageId3, { tl: { col: 2, row: 20 }, ext: { width: 600, height: 300 } });

// ??????Excel??????
workbook.xlsx.writeFile("Debtors.xlsx");
console.log("ok");
