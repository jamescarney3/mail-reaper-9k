import { ThreadMetadata, GmailLabel, GmailThread } from '~/types';


const categories = ['PROMOTIONS', 'SOCIAL'];
const threadsQuery = categories.reduce((q, cat) => (`${q} AND NOT in:${cat}`),'in:INBOX');

export const listThreadIds = (): Array<string> => {
  const fetchNextIds = (currentIds: string[] = [], token: string | null = null): string[] => {
    // 'me' string literal tells the list method to look at my personal inbox
    const threadsList = Gmail.Users.Threads.list('me', { q: threadsQuery, pageToken: token });
    const { threads, nextPageToken } = threadsList;
    // threads can be undefined here!
    const threadIds = (threads || []).map((thread: { id: string }) => thread.id);
    const idResults = [...currentIds, ...threadIds];

    return nextPageToken ? fetchNextIds(idResults, nextPageToken) : idResults;
  };

  return fetchNextIds();
};

export const getThread = (id: string) => {
  return GmailApp.getThreadById(id);
};

export const updateThread = (
  thread: GmailThread,
  options: { label?: GmailLabel, markRead?: boolean },
): GmailThread => {
  const { label, markRead } = options;

  if (label) thread.addLabel(label);
  if (markRead) thread.markRead();
  thread.moveToArchive();
  return thread;
};

export const getThreadMetadata = (thread: GmailThread): ThreadMetadata => {
  return {
    sender: thread.getMessages().reverse()[0].getFrom(),
    subject: thread.getFirstMessageSubject(),
  };
};


export default { listThreadIds, getThread, getThreadMetadata };
