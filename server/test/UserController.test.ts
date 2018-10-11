import * as request from 'supertest';
import 'mocha';
import { testAfter, testBefore, app } from './common';
import { doesNotReject } from 'assert';



describe('UserController Testing', () => {

  before(testBefore);
  after(testAfter);

  it('admin login test', (done) => {
    request(app).post('/api/login').send({ username: 'admin', password: 'a123123' }).expect(200, done);
  });

  it('wrong user login test', (done) => {
    request(app).post('/api/login').send({ username: 'cake222', password: 'a123123' }).expect(400, done);
  });

  it('uncheck register', (done) => {
    request(app).post('/api/user')
      .set('Accept', 'application/json')
      .send({ username: 'cake1100', password: 'fjnnnens', name: '曹操' })
      .expect(400, done);
  });

  it('uncheck search', (done) => {
    request(app).get('/api/users').expect(400, done);
  });

});
