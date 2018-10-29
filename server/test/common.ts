import { configure as dbConfigure, resetDataBase } from '../commons/DataBase';
import { configure as cacheConfigure } from '../commons/Cache';
import { expressApp } from '../commons/MVC';
import '../controllers';
import * as request from 'promisify-supertest';
import * as assert from 'assert';


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


export function login() {
  return request(app).post('/api/login').send({ username: 'admin', password: 'a123123' }).expect(200).end().then((res) => {
    let { body: { token }} = res;
    assert.ok(token, '没有获取token');
    return token;
  });
}
