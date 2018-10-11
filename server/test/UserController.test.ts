import * as request from 'promisify-supertest';
import 'mocha';
import { testAfter, testBefore, app } from './common';
import * as assert from 'assert';

function login() {
  return request(app).post('/api/login').send({ username: 'admin', password: 'a123123' }).expect(200).end();
}

describe('UserController Testing', () => {

  before(testBefore);
  after(testAfter);

  it('admin login test', () => login());

  it('wrong user login test', () => {
    return request(app).post('/api/login').send({ username: 'cake222', password: 'a123123' }).expect(400).end();
  });

  it('uncheck register', () => {
    return request(app).post('/api/user')
      .set('Accept', 'application/json')
      .send({ username: 'cake1100', password: 'fjnnnens', name: '曹操' })
      .expect(400).end();
  });

  it('uncheck search', () => {
    return request(app).get('/api/users').expect(400).end();
  });

  it('normal register', async () => {
    console.time('login-test');
    let res = await login();
    console.timeEnd('login-test');
    let { body: { token }} = res;
    assert.ok(token, '没有获取token');
    console.time('register-test');
    res = await request(app).post('/api/user').send({ username: 'cake1100', password: 'ffssfdf', name: '曹操', token }).expect(200).end();
    console.timeEnd('register-test');

    // let { body: { id }} = res;
    // assert.ok(id, '没有获取ID');
    // res = await request(app).get('/api/users?token=' + token).expect(200);
    // let { body } = res;
    // assert.ok(body.total > 1, '没有添加成功');

    return res;
  });
});
