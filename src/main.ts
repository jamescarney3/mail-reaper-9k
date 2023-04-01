import { listThreadIds, getThread, getThreadMetadata, updateThread } from '~/resources/threads';
import { ensureLabel } from '~/resources/inbox';
import { matchToRule } from '~/resources/rules';


const execute = (): void => {
  const threadIds = listThreadIds();

  threadIds.forEach((id) => {
    const thread = getThread(id);
    const metadata = getThreadMetadata(thread);
    const ruleMatch = matchToRule(metadata.sender, metadata.subject);

    if (ruleMatch) {
      const { label: labelName, markRead = true } = ruleMatch;
      const label = labelName ? ensureLabel(labelName) : null;
      updateThread(thread, { label, markRead });
      thread.moveToArchive();
      Logger.log(thread.isInInbox());
      Logger.log(thread.getLabels());
      Logger.log(thread.isUnread());
    }
  });

};

// TODO: move this to a types declaration file?
declare global {
  function execute(): void;
}

global.execute = execute;

// import or export keywords let TS know that it should consider this a module
// and not complain about augmenting the global scope
export default global.execute;
