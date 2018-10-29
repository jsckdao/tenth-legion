import * as request from 'promisify-supertest';
import 'mocha';
import { testAfter, testBefore, app, login } from './common';
import * as assert from 'assert';

describe('UserController Testing', () => {

  before(testBefore);
  after(testAfter);

  it('管理员登录测试', () => login());

  it('不存在用户登录测试', () => {
    return request(app).post('/api/login').send({ username: 'cake222', password: 'a123123' }).expect(400).end();
  });

  it('未登录注册', () => {
    return request(app).post('/api/user')
      .set('Accept', 'application/json')
      .send({ username: 'cake1100', password: 'fjnnnens', name: '曹操' })
      .expect(400).end();
  });

  it('未登录查询', () => {
    return request(app).get('/api/users').expect(400).end();
  });

  it('一般用户的注册查询, 删除操作', async () => {
    let token = await login();
    let res = await request(app).post('/api/user').send({ username: 'cake1100', password: 'ffssfdf', name: '曹操', token }).expect(200).end();
    let { body: { id }} = res;
    assert.ok(id, '没有获取ID');
    let searchRes = await request(app).get('/api/users?token=' + token).expect(200).end();
    let { body } = searchRes;
    assert.ok(body.total > 1, '没有添加成功');

    let getRes = await request(app).get(`/api/user/${id}?token=${token}`).expect(200).end();
    assert.ok(getRes.body.username == 'cake1100', '人员添加有误');
    await request(app).delete(`/api/user/${id}`).send({ token }).expect(200).end();
    await request(app).get(`/api/user/${id}?token=${token}`).send().expect(400).end();
    // return res;
  });

});
