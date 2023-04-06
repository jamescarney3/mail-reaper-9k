// Mail Reaper rules should either come from a data module in the source code
// or from an external Google Sheets document
// TODO: describe this in the README
export type RulesSourceString = 'data module' | 'sheets doc';
export const RULES_SOURCE: RulesSourceString = 'data module';

// any string, must correspond to a Google Sheets document page containing
// rule definitions if RULES_SOURCE above is set to 'sheets doc'
export const RULES_SHEET_NAME = 'Mail Reaper Rules';


// GOOGLE SHEETS RESULTS LOG

// Google Sheets unique document id as defined in env variable; better to keep
// this out of the source in order not to publish in the repo, but could
// technincally be defined as a string literal here for debugging purposes
export const RULES_SHEET_ID: string = process.env.RULES_SHEET_ID;

export type LogReportDataOption = true | false;
export const LOG_REPORT_DATA: LogReportDataOption = false;
export const RESULTS_SHEET_ID: string = process.env.RESULTS_SHEET_ID;
export const RESULTS_SHEET_NAME = 'Mail Reaper Results';


// EMAIL DIGESTS

// whether to send a digest email with a report of all emails processed
// by the application on a given run
export type DigestEmailOption = true | false;
export const SEND_DIGEST_EMAIL: DigestEmailOption = false;

// any string; must match filename of email digest html template in src/assets
export const EMAIL_TEMPLATE_LOCATION = 'email-digest';

// any string;
export const DIGEST_EMAIL_SUBJECT_PREFIX = 'Mail Reaper Digest for';

// any string; Gmail label under which to file digest emails
export const DIGEST_ARCHIVE_LABEL = 'Mail Reaper Digests';

// email address to which digest emails are sent, stored as env var
export const USER_EMAIL: string = process.env.USER_EMAIL;
