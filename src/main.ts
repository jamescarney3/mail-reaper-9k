import { getAllThreadIds } from '~/inbox';

const execute = (): void => {
  const threadIds = getAllThreadIds();
  Logger.log(threadIds);
};

// TODO: move this to a types declaration file?
declare global {
  function execute(): void;
}

global.execute = execute;

// import or export keywords let TS know that it should consider this a module
// and not complain about augmenting the global scope
export default global.execute;
