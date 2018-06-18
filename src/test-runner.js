// this is to manually run Jest tests.
// in most envs, you'd just run `jest`, but since this
// is in-browser, this is the only way to run tests consistently

var jest = require('jest-cli');

const jestConfig = {
  rootDir: 'source',
};

jest.runCLI({ config: jestConfig }, '.', () => {});
