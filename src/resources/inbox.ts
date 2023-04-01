export const ensureLabel = (labelName: string): ReturnType<typeof GmailApp.createLabel> => {
  const label = GmailApp.getUserLabelByName(labelName);
  return label || GmailApp.createLabel(labelName);
};


export default { ensureLabel };
