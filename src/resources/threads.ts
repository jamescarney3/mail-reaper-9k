type ThreadMetadata = {
  sender: string,
  subject: string,
}

export const getThread = (id: string) => {
  return GmailApp.getThreadById(id);
};

export const getThreadMetadata = (thread: ReturnType<typeof getThread>): ThreadMetadata => {
  return {
    sender: thread.getMessages().reverse()[0].getFrom(),
    subject: thread.getFirstMessageSubject(),
  };
};

export default { getThread, getThreadMetadata };
