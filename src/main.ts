import { importRules } from '~/configs/rules-initializer';

const execute = (): void => {
  Logger.log(importRules());
};

// TODO: move this to a types declaration file?
declare global {
  function execute(): void;
}

global.execute = execute;

// import or export keywords let TS know that it should consider this a module
// and not complain about augmenting the global scope
export default global.execute;
