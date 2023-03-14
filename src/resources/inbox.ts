const categories = ['PROMOTIONS', 'SOCIAL'];
const threadsQuery = categories.reduce((q, cat) => (`${q} AND NOT in:${cat}`),'in:INBOX');

// returns the ids of all emails in primary inbox; see categories and query above
export const getAllThreadIds = (): string[] => {
  const fetchNextIds = (currentIds: string[] = [], token: string | null = null): string[] => {
    // 'me' string literal tells the list method to look at my personal inbox
    const threadsList = Gmail.Users.Threads.list('me', { q: threadsQuery, pageToken: token });
    const { threads = [], nextPageToken } = threadsList;
    const threadIds = threads.map((thread: { id: string }) => thread.id);
    const idResults = [...currentIds, ...threadIds];

    return nextPageToken ? fetchNextIds(idResults, nextPageToken) : idResults;
  };

  return fetchNextIds();
};


export default { getAllThreadIds };
