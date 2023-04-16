import { RESULTS_SHEET_HEADERS } from '~/configs/constants-initializer';
import { Reports, Rule, GmailThread, Sheet } from '~/types';


// expect a GmailThread instance as positional arg here and don't worry about
// inserting another abstraction layer; GmailThreads are first class citizens
// with their shape already specified in the GAS types package, so this might
// as well use that
export const createReportEntry = (thread: GmailThread, rule: Rule): Reports.Entry => {
  return {
    // match data
    source: rule.source,
    sender: thread.getMessages().slice(-1)[0].getFrom(),
    senderMatch: rule.sender, // from rule
    subject: thread.getFirstMessageSubject(),
    subjectMatch: rule.subject, // from rule

    // rule actions
    label: rule.label,
    markRead: rule.markRead,

    // more metadata
    received: thread.getLastMessageDate().toString(),
    archived: new Date().toString(),
    permalink: thread.getPermalink(),
    id: thread.getId(),
  };
};

// TODO: consider whether this belongs in a resource/service module for
// Google Sheets operations; probably fine for now for this to live in a
// the module that collects reporting-related functionality until it's
// determined if that's really a mashup of some other stuff
//
// NB: eschewing injecting the sheet as a dependency here, could see the
// initializer moving to a config module in the future
export const logReportEntry = (sheet: Sheet, entry: Reports.Entry): void => {
  sheet.appendRow(RESULTS_SHEET_HEADERS.map((header) => (entry[header as keyof Reports.Entry])));
};

export default { createReportEntry, logReportEntry };
