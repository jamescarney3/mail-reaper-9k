// ----- RULES -----

// Mail Reaper rules either come from a data module in the source code or
// from an external Google Sheets document
// TODO: describe this in the README
export type RulesSourceString = 'data module' | 'sheets doc';
export const RULES_SOURCE: RulesSourceString = 'sheets doc';

// Google Sheets unique document id as defined in env variable so better
// to keep this out of the source in order not to publish in the repo;
// this is the Sheets ID for the document containing a formatted rules
// sheet
//
// NB: this must be set in the .env file if RULES_SOURCE is set to
// 'sheets doc' above
export const RULES_SHEET_ID: string = process.env.RULES_SHEET_ID;

// any string, must correspond to a Google Sheets document page containing
// rule definitions if RULES_SOURCE above is set to 'sheets doc'
//
// NB: this must be set in the .env file if RULES_SOURCE is set to
// 'sheets doc' above, and the sheet itself must be properly formatted;
// see README for sheet formatting specifications
export const RULES_SHEET_NAME = 'Mail Reaper Rules';

// array of strings, these cannot change without risking compromising rules-
// related functionality
//
// TODO: split up constants vs configs
export const RULES_SHEET_HEADERS = [
  'source',
  'sender',
  'subject',
  'label',
  'mark read',
];


// ----- LOGGING -----

// boolean, Mail Reaper can optionally log the results of the operations it performs
// on email threads
export type LogReportDataOption = boolean;
export const LOG_REPORT_DATA: LogReportDataOption = true;

// Google Sheets unique document id as defined in env variable so better
// to keep this out of the source in order not to publish in the repo;
// this is the Sheets ID for the document containing a formatted rules
// sheet
//
// NB: this must be set in the .env file if LOG_REPORT_DATA is set to
// true above
export const RESULTS_SHEET_ID: string = process.env.RESULTS_SHEET_ID;

// any string, must correspond to a Google Sheets document page containing
// rule definitions if RULES_SOURCE above is set to 'sheets doc'
//
// NB: this must be set in the .env file if LOG_REPORT_DATA is set to
// true above, and the sheet itself must be properly formatted; see README
// for sheet formatting specifications
export const RESULTS_SHEET_NAME = 'Mail Reaper Results';

// array of strings, these cannot change without risking compromising log-
// and digest-related functionality
//
// TODO: split up constants vs configs
export const RESULTS_SHEET_HEADERS = [
  'source',
  'from',
  'from match',
  'subject',
  'subject match',
  'label',
  'mark read',
  'received',
  'archived',
  'permalink',
  'id',
];


// ----- EMAIL DIGESTS -----

// boolean, whether to send a digest email with a report of all emails processed
// by the application on a given run
export type DigestEmailOption = true | false;
export const SEND_DIGEST_EMAIL: DigestEmailOption = true;

// any string; must match filename of email digest html template in src/assets
export const EMAIL_TEMPLATE_LOCATION = 'email-digest';

// any string;
export const DIGEST_EMAIL_SUBJECT_PREFIX = 'Mail Reaper Digest for';

// any string; Gmail label under which to file digest emails
export const DIGEST_ARCHIVE_LABEL = 'Mail Reaper Digests';

// email address to which digest emails are sent, stored as env var
export const USER_EMAIL: string = process.env.USER_EMAIL;
