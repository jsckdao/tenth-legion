import { configure as dbConfigure, resetDataBase } from '../commons/DataBase';
import { configure as cacheConfigure } from '../commons/Cache';
import { expressApp } from '../commons/MVC';
import '../controllers';

const cfg = require('../../config.json');
dbConfigure(cfg.test.dataBase);
cacheConfigure(cfg.test.cache);

let server;

export function testBefore(done) {
  server = expressApp.listen(7827);
  resetDataBase(cfg.test.dataBase).then(done).catch(console.error);
}

export function testAfter() {
  server.close();
}

export const app = expressApp;
