import { GmailLabel } from '~/types';


export const ensureLabel = (labelName: string): GmailLabel => {
  const label = GmailApp.getUserLabelByName(labelName);
  return label || GmailApp.createLabel(labelName);
};


export default { ensureLabel };
