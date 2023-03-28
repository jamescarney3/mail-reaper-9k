import { RULES_SHEET_ID, RULES_SHEET_NAME, RULES_SOURCE } from '~/configs/constants-initializer';
import sourceDataRules from '~/data/rules-data';
import { Rule } from '~/types';


const formatHeaderKey = (header: string): string => {
  return header
    .split('')
    .reduce((acc, char, idx) => {
      // dash, underscore, and space are supported delimiters, start a new word
      if (['-', '_', ' '].includes(char)) return [...acc, []];
      const lastWord = acc.pop();
      if (lastWord.length) return [...acc, lastWord.concat(char.toLowerCase())];
      return [...acc, lastWord.concat(idx === 0 ? char : char.toUpperCase())];
    }, [[]])
    .map((word) => word.join(''))
    .join('');
};

const getSpreadsheetRules = (sheetsId: string, pageName: string) => {
  const mailReaperSheet = SpreadsheetApp.openById(sheetsId);
  const rulesPage = mailReaperSheet.getSheetByName(pageName);
  const rows = rulesPage.getDataRange().getValues();

  return rows.reduce((currentRules, row, rowIdx) => {
    if (rowIdx === 0) return currentRules;
    const headers = rows[0].map(formatHeaderKey);

    const rule = row.reduce((currentRule, col, colIdx) => {
      const header = headers[colIdx];
      return { ...currentRule, [header]: col };
    }, {});

    return [...currentRules, rule];
  }, []);
};

// NB: exporting this underscore-prefixed func to testing purposes; any module
// that uses the rules list should import the rules var set to the result of
// an invocation of this function
export const _getRules = (rulesSource: string): Array<Rule> => {
  if (rulesSource === 'data module') {
    return sourceDataRules;
  } else if (rulesSource === 'sheets doc') {
    return getSpreadsheetRules(RULES_SHEET_ID, RULES_SHEET_NAME);
  // NB: arguably superfluous 'else' branch here since, per its type in the
  // constants initializer, RULES_SOURCE can only ever be one of a union
  // of string literals that should correspond 1:1 to the conditions in this
  // statement; at least if anyone manages to change this in a way that beats
  // the compiler, it will throw
  } else {
    throw new Error('RULES_SOURCE config string invalid');
  }
};

// NB: invoking and exporting the result of the _getRules func above in order
// not to have to pass in an env var each time any other module needs to
// reference the rules list
//
// arguably an anti-pattern, but engaging in some dependency injection here
// allows the application to only have to read rules data from a Sheets
// document once at runtime if it is configured to read it from there at all;
// upside is speed (1 maximum GAS service method call in this module to get
// rules) and simplicity of any other module being able to import rules as
// a variable without needing to invoke anything or pass env vars
//
// another considered approach would have been to import the rules list into
// the main script and then pass it to any functions/methods that needed it,
// but injecting the dependency here seems more in keeping with the (vaguely)
// object-oriented patterns the application implements (inspired by the GAS
// services/APIs it uses); it makes certain aspects of testing/naming/organizing
// more difficult, but it makes others easier
//
// good idea? maybe, maybe not - time will tell
export const rules: Array<Rule> = _getRules(RULES_SOURCE);


export default { rules };
