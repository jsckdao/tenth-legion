import { GET, POST, LogicError } from '../commons/MVC';
import { PageCondition } from '../commons/DataBase';
import { getPageFromParams } from '../commons/Utils';
import {Md5} from 'ts-md5/dist/md5';
import { omit } from 'underscore';

/**
 * 对密码进行加密
 * @param passwd
 */
function hashStr(passwd) {
  let salt = Md5.hashAsciiStr(passwd);
  return Md5.hashStr(salt + '-' + passwd);
}

function verifyPassword(passwd) {
  if (!/^.{6,20}$/.test(passwd)) {
    throw new LogicError('密码长度为 6-20');
  }
}

function verifyUsername(username) {
  if (!/^\w{6,20}$/.test(username)) {
    throw new LogicError('用户名必须是 6-20 位的字符或数字');
  }
}

/**
 * 用户查询
 */
GET('/users', (context) => {
  let pageCond = getPageFromParams(context.params);
  return context.dbSession.findByPage('user', pageCond);
});

/**
 * 新加用户
 */
POST('/user', async (context) => {
  let { username, password } = context.params;
  verifyUsername(username);
  verifyPassword(password);

  if (await context.dbSession.exists('user', { username })) {
    throw new LogicError('该用户名已经存在');
  }

  let data = {
    username,
    password: hashStr(password)
  };
  let res = await context.dbSession.insert('user', data);

  return { id: res.insertId, ... omit(data, 'password') };
});

/**
 * 修改用户信息
 */
POST('/user/:id', (context) => {
  let { password, id, ... data } = context.params;
  if (password) {
    verifyPassword(password);
    data['password'] = hashStr(password);
  }
  return context.dbSession.update('user', data, { id });
});

