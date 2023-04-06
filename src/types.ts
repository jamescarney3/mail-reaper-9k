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

// NB: using a namespace here since all application types are defined or
// aliased in this module, if this ever expands to use ES2015 module syntax
// to manage types these can get defined as module exports but the namespace
// approach seems efficient for now
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
export type Template = GoogleAppsScript.HTML.HtmlTemplate;
