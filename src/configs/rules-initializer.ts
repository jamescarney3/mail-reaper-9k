import sourceDataRules from '~/data/rules-data';
import { Rule } from '~/types';

// this is its own function to separate this logic from the logic for
// importing rules from a Sheets doc
export const getSourceDataRules = (): Array<Rule> => {
  return sourceDataRules;
};

export const importRules = (): Array<Rule> => {
  return getSourceDataRules();
};


export default { importRules };
