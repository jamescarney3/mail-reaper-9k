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

export namespace Reports {
  export type Entry = {
    source: string,
    sender: string,
    senderMatch: string, // from rule
    subject: string,
    subjectMatch: string, // from rule
    label?: string,
    markRead?: boolean,
    received: string, // date string
    archived: string, // date string
    permalink: string,
    id: string,
  }

  export type List = Array<Entry>
}

// GAS aliases
export type GmailLabel = GoogleAppsScript.Gmail.GmailLabel;
export type GmailThread = GoogleAppsScript.Gmail.GmailThread;
export type Sheet = GoogleAppsScript.Spreadsheet.Sheet;
