import { LOG_REPORT_DATA, RESULTS_SHEET_ID, RESULTS_SHEET_NAME } from '~/configs/constants-initializer';
import { listThreadIds, getThread, getThreadMetadata, updateThread } from '~/resources/threads';
import { ensureLabel } from '~/resources/inbox';
import { matchToRule } from '~/resources/rules';
import { createReportEntry, logReportEntry } from '~/resources/reports';


// TODO: move this to an initializer?
const getResultsSheet = () => {
  const dataLogSpreadsheet = SpreadsheetApp.openById(RESULTS_SHEET_ID);
  return dataLogSpreadsheet.getSheetByName(RESULTS_SHEET_NAME);
};

const execute = (): void => {
  const threadIds = listThreadIds();
  const resultsSheet = LOG_REPORT_DATA ? getResultsSheet() : null;

  threadIds.forEach((id) => {
    const thread = getThread(id);
    const metadata = getThreadMetadata(thread);
    const ruleMatch = matchToRule(metadata.sender, metadata.subject);

    if (ruleMatch) {
      const { label: labelName, markRead = true } = ruleMatch;
      const label = labelName ? ensureLabel(labelName) : null;
      updateThread(thread, { label, markRead });
      thread.moveToArchive();

      const reportEntry = createReportEntry(thread, ruleMatch);

      if (LOG_REPORT_DATA) {
        logReportEntry(resultsSheet, reportEntry);
      }

      Logger.log(reportEntry);
    }
  });

};

// TODO: move this to a types declaration file?
declare global {
  function execute(): void;
}

global.execute = execute;

// import or export keywords let TS know that it should consider this a module
// and not complain about augmenting the global scope
export default global.execute;
