import { RULES_SHEET_NAME, RESULTS_SHEET_NAME, RULES_SHEET_HEADERS, RESULTS_SHEET_HEADERS } from '~/configs/constants-initializer';


const setupDataSheet = (): void => {
  const mailReaperSpreadsheet = SpreadsheetApp.create('Mail Reaper 9000');
  const spreadsheetUrl: string = mailReaperSpreadsheet.getUrl();
  const spreasheetId: string = mailReaperSpreadsheet.getId();

  mailReaperSpreadsheet.insertSheet();
  const [rulesSheet, resultsSheet] = mailReaperSpreadsheet.getSheets();

  rulesSheet.setName(RULES_SHEET_NAME);
  rulesSheet.appendRow(RULES_SHEET_HEADERS);
  rulesSheet.setFrozenRows(1);

  resultsSheet.setName(RESULTS_SHEET_NAME);
  resultsSheet.appendRow(RESULTS_SHEET_HEADERS);
  resultsSheet.setFrozenRows(1);

  Logger.log('Sheets doc ID: ' + spreasheetId);
  Logger.log('Edit rules and review logs at ' + spreadsheetUrl);
};

declare global {
  function setupDataSheet(): void;
}

global.setupDataSheet = setupDataSheet;
