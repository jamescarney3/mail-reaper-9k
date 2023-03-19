import { RULES_SHEET_NAME } from '~/configs/constants-initializer';
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

export const getSpreadsheetRules = (sheetsId: string, pageName: string) => {
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

export const getSourceDataRules = (): Array<Rule> => {
  return sourceDataRules;
};

export const importRules = (sheetsId?: string, pageName?: string): Array<Rule> => {
  if ([sheetsId, pageName].every(Boolean)) {
    return getSpreadsheetRules(sheetsId, pageName);
  } else {
    return getSourceDataRules();
  }
};


export default { importRules };
