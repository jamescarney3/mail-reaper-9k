// Mail Reaper rules should either come from a data module in the source code
// or from an external Google Sheets document
// TODO: describe this in the README
type RulesSourceString = 'data module' | 'sheets doc';
export const RULES_SOURCE: RulesSourceString = 'data module';

// any string, must correspond to a Google Sheets document page containing
// rule definitions if RULES_SOURCE above is set to 'sheets doc'
export const RULES_SHEET_NAME: string = 'Mail Reaper Rules';

// Google Sheets unique document id as defined in env variable; better to keep
// this out of the source in order not to publish in the repo, but could
// technincally be defined as a string literal here for debugging purposes
export const RULES_SHEET_ID: string = process.env.RULES_SHEET_ID;

export const LOG_REPORT_DATA: boolean = false;
export const RESULTS_SHEET_ID: string = process.env.RESULTS_SHEET_ID;
export const RESULTS_SHEET_NAME: string = 'Mail Reaper Results';
