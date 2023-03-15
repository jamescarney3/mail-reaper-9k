import { getAllThreadIds } from '~/resources/inbox';
import { getThread, getThreadMetadata } from '~/resources/threads';

const execute = (): void => {
  const threadIds = getAllThreadIds();
  threadIds.forEach((id) => {
    const thread = getThread(id);
    Logger.log(getThreadMetadata(thread));
  })
};

// TODO: move this to a types declaration file?
declare global {
  function execute(): void;
}

global.execute = execute;

// import or export keywords let TS know that it should consider this a module
// and not complain about augmenting the global scope
export default global.execute;
