const _ = require('lodash');
const log4js = require('log4js');
const logger = log4js.getLogger('ReportExcel');

const Excel = require('exceljs');
const SiteChect = require('./chart/SiteChart');

class ReportExcel {

    constructor(options) {
        this.options = options;
    }

    genReport(report) {
        return new Promise(async (resolve, reject) => {
            this.report = report;
            logger.info('ReportExcel init', this.options);
            // 讀取樣板檔案
            this.workbook = new Excel.Workbook();
            await this.workbook.xlsx.readFile(this.options.StyleFile);
            const worksheet = this.workbook.getWorksheet(this.options.StyleSheet);

            // 取得欄位寬度
            let colWidth = [];
            for (let i = 1; i <= 20; i++) {
                let aColumn = worksheet.getColumn(i);
                colWidth.push(aColumn.width);
            }
            console.log('colWidth', colWidth);
            // 取得列高
            // 列高目前都一樣，依據字型大小縮放

            // 取得報表基本樣式
            const bgGray = worksheet.getCell('B1').style;
            const bgWhite = worksheet.getCell('B2').style;

            const reportTitle = worksheet.getCell('H3').style;
            const reportSummary = worksheet.getCell('C7').style;
            const blockTitle = worksheet.getCell('C12').style;
            const blockContent = worksheet.getCell('F12').style;
            const tableTitle_L = worksheet.getCell('C23').style;
            const tableBody_L = worksheet.getCell('C24').style;
            const tableTitle_R = worksheet.getCell('D23').style;
            const tableBody_R = worksheet.getCell('D24').style;



            // 產生新的活頁表
            let outputSheet = this.workbook.addWorksheet("台電測試站", {
                pageSetup: { paperSize: 12 }
            });

            // 設定欄位寬度
            for (let i = 1; i <= 20; i++) {
                let aColumn = outputSheet.getColumn(i);
                aColumn.width = colWidth[i - 1];
            }

            const BG_ROW_COUNT = 200;
            const RP_ROW_COUNT = 100;
            // 填報表背景顏色
            for (let i = 1; i <= BG_ROW_COUNT; i++) {
                let aRow = outputSheet.getRow(i);
                // 灰底
                for (let j = 1; j <= 20; j++) {
                    let aCell = aRow.getCell(j);
                    aCell.style = bgGray;
                }
                // 白底
                if (i > 1 && i < RP_ROW_COUNT) {
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
            aCell.font = reportTitle.font;
            startRow += 2;

            // ====================================================================================================
            // 報表Summary
            // ====================================================================================================
            const SummaryRows = 5;
            for (let i = startRow; i < startRow + SummaryRows; i++) {
                let aRow = outputSheet.getRow(i);
                // 填滿區塊底色
                for (let i = 3; i <= 13; i++) {
                    let aCell = aRow.getCell(i);
                    aCell.style = reportSummary;
                }
                switch (i) {
                    case startRow + 1: {
                        outputSheet.mergeCells(`C${i}:F${i}`);
                        let aCell = aRow.getCell(3);
                        aCell.value = `  公司　${report.companyName}`;
                        break;
                    }
                    case startRow + 2: {
                        outputSheet.mergeCells(`C${i}:F${i}`);
                        let aCell = aRow.getCell(3);
                        aCell.value = `  報表產生時間　${report.reportDate}`;
                        break;
                    }
                    case startRow + 3: {
                        outputSheet.mergeCells(`C${i}:F${i}`);
                        let aCell = aRow.getCell(3);
                        aCell.value = `  報告內容時間　${report.reportSDate}~${report.reportEate}`;
                        break;
                    }
                }
            }
            startRow += SummaryRows;
            startRow += 2;

            // ====================================================================================================
            // 站台營運服務狀態
            // ====================================================================================================
            aRow = outputSheet.getRow(startRow);
            outputSheet.mergeCells(`C${startRow}:E${startRow}`);
            aCell = aRow.getCell(3);
            aCell.value = '站台營運服務狀態';
            aCell.style = blockTitle;
            for (let i = 4; i <= 13; i++) {
                let aCell = aRow.getCell(i);
                aCell.style = blockContent;
            }
            startRow += 2;
            // 服務狀態彙總說明
            const ServiceSummaryRows = 7;
            const expressLabel = [`  各站台 MXview 主機營運狀況`, `  以是否發生 MXview One Server Alert 區分`, `  Critical Site  當月發生過 Critical Event`,
                `  Warning Site  當月未發生Critical Event 但有 Warning Event`, `  Health Site  當月未發生 Critical Event 和 Warning Event`,
            ];
            for (let i = startRow; i < startRow + ServiceSummaryRows; i++) {
                let aRow = outputSheet.getRow(i);
                // 填滿區塊底色
                for (let j = 3; j <= 7; j++) {
                    let aCell = aRow.getCell(j);
                    aCell.style = reportSummary;
                }

                // 填欄位說明
                switch (i) {
                    case startRow + 1:
                    case startRow + 2:
                    case startRow + 3:
                    case startRow + 4:
                    case startRow + 5:
                        outputSheet.mergeCells(`C${i}:G${i}`);
                        let aCell = aRow.getCell(3);
                        aCell.value = expressLabel[i - startRow - 1];
                        break;
                }
            }
            startRow += ServiceSummaryRows;
            startRow += 2;

            // 彙總數字
            let title = ['', 'Health Site', 'Warning Site', 'Critical Site', 'Total'];
            for (let i = 0; i < report.reportData.length; i++) {
                let aInfo = report.reportData[i];
                aInfo.Total = aInfo.Health + aInfo.Warning + aInfo.Critical;
            }
            // 將資料依照日期排序
            report.reportData = _.sortBy(report.reportData, ['Month']);

            for (let i = startRow; i <= startRow + (report.reportData.length + 1); i++) {
                let aRow = outputSheet.getRow(i);
                switch (i) {
                    case startRow: {
                        // 表格標題
                        for (let j = 0; j < 5; j++) {
                            let aCell = aRow.getCell(j + 3);
                            aCell.value = title[j];
                            aCell.style = tableTitle_R;
                        }
                        break;
                    }
                    default:
                        // 數值
                        let aInfo = report.reportData[i - startRow - 1];
                        if (aInfo) {
                            let aCell = aRow.getCell(3);
                            aCell.style = tableBody_L;
                            aCell.value = aInfo.Month;
                            aCell = aRow.getCell(4);
                            aCell.style = tableBody_R;
                            aCell.value = aInfo.Health;
                            aCell = aRow.getCell(5);
                            aCell.style = tableBody_R;
                            aCell.value = aInfo.Warning;
                            aCell = aRow.getCell(6);
                            aCell.style = tableBody_R;
                            aCell.value = aInfo.Critical;
                            aCell = aRow.getCell(7);
                            aCell.style = tableBody_R;
                            aCell.value = aInfo.Total;
                        }

                        break;
                }
            }

            // 繪圖
            const options2 = {
                leftWidth: 50, rightWidth: 20, topHeight: 20, bottomHeight: 70,
                rectColor: ['#5B9BD5', '#ED7D31', '#A5A5A5', '#FFC000', '#229B2F', '#6495ED']
            };
            const aSiteChect = new SiteChect(540, 300, options2);
            // 繪製圖檔並產生png buffer
            aSiteChect.setChartData(report.reportData).paint();
            const buffer = aSiteChect.getCanvasBuffer();

            // 加入excel workbook
            const imageId3 = this.workbook.addImage({
                buffer: buffer,
                extension: 'png',
            });
            outputSheet.addImage(imageId3, { tl: { col: 7.5, row: 13 }, ext: { width: 540, height: 300 } });

            // ====================================================================================================
            // 站台營運服務狀態
            // ====================================================================================================


            startRow += 10;
            console.log('startRow', startRow);

            // 刪除style頁面
            this.workbook.removeWorksheet(worksheet.id);
            resolve(true);
        });

    }

    async getReportBuffer() {
        // 產生Excel檔案Buffer
        if (this.workbook != null) {
            const buffer = await this.workbook.xlsx.writeBuffer();
            // console.log(buffer);
            return buffer;
        } else {
            return null;
        }
    }

}

module.exports = ReportExcel;
