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
