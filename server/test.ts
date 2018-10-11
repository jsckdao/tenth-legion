process.env.TS_NODE_PROJECT = './tsconfig.json';
require('ts-mocha');
import * as Mocha from 'mocha';

const mocha = new Mocha();
mocha.timeout(10000);
mocha.addFile(`./server/test/UserController.test.ts`);
mocha.run((failures) => {
  process.on('exit', () => {
    process.exit(failures); // exit with non-zero status if there were failures
  });
});
