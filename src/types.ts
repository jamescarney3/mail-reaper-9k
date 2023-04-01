export type Rule = {
  source: string,
  sender: string,
  subject?: string,
  label?: string,
  markRead?: boolean,
}

export type ThreadMetadata = {
  sender: string,
  subject: string,
}

// GAS aliases
export type GmailLabel = GoogleAppsScript.Gmail.GmailLabel;
export type GmailThread = GoogleAppsScript.Gmail.GmailThread;
