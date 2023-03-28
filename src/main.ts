import { listThreadIds, getThread, getThreadMetadata } from '~/resources/threads';
import { matchToRule } from '~/resources/rules';


const execute = (): void => {
  const threadIds = listThreadIds();

  threadIds.forEach((id) => {
    const thread = getThread(id);
    const metadata = getThreadMetadata(thread);
    const ruleMatch = matchToRule(metadata.sender, metadata.subject);

    Logger.log(ruleMatch);
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
