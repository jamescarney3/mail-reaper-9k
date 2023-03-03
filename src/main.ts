const greet = (user: string) => {
  Logger.log('hello ' + user);
};

// TODO: move this to a types declaration file
declare global {
  function greet(user: string): void;
}

global.greet = greet;

// import or export keywords let TS know that it should consider this a module
// and not complain about augmenting the global scope
export default global.greet;