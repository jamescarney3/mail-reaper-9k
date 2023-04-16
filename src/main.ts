import {
  LOG_REPORT_DATA,
  RESULTS_SHEET_ID,
  RESULTS_SHEET_NAME,
  SEND_DIGEST_EMAIL,
  DIGEST_ARCHIVE_LABEL,
} from '~/configs/constants-initializer';
import { listThreadIds, getThread, getThreadMetadata, updateThread } from '~/resources/threads';
import { ensureLabel } from '~/resources/inbox';
import { matchToRule, isDigest } from '~/resources/rules';
import { createReportEntry, logReportEntry } from '~/resources/reports';
import { createDigest, addDigestReportEntry, generateTemplate, sendDigestEmail } from '~/resources/digest';


// TODO: move this to an initializer?
const getResultsSheet = () => {
  const dataLogSpreadsheet = SpreadsheetApp.openById(RESULTS_SHEET_ID);
  return dataLogSpreadsheet.getSheetByName(RESULTS_SHEET_NAME);
};

const execute = (): void => {
  const digest = createDigest();

  const threadIds = listThreadIds();
  const resultsSheet = LOG_REPORT_DATA ? getResultsSheet() : null;

  threadIds.forEach((id) => {
    const thread = getThread(id);
    const metadata = getThreadMetadata(thread);
    const ruleMatch = matchToRule(metadata.sender, metadata.subject);
    const digestMatch = isDigest(metadata.sender, metadata.subject);

    if (ruleMatch) {
      const { label: labelName, markRead = true } = ruleMatch;
      const label = labelName ? ensureLabel(labelName) : null;
      updateThread(thread, { label, markRead });
      thread.moveToArchive();

      const reportEntry = createReportEntry(thread, ruleMatch);

      if (LOG_REPORT_DATA) {
        logReportEntry(resultsSheet, reportEntry);
      }

      if (SEND_DIGEST_EMAIL) {
        addDigestReportEntry(digest, reportEntry);
      }
    }

    if (digestMatch) {
      updateThread(thread, { label: ensureLabel(DIGEST_ARCHIVE_LABEL), markRead: true });
      thread.moveToArchive();
    }
  });

  if (SEND_DIGEST_EMAIL) {
    const digestTemplate = generateTemplate(digest);
    sendDigestEmail(digestTemplate);
  }
};

declare global {
  function execute(): void;
}

global.execute = execute;
