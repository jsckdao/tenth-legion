import { GET, POST, LogicError, DELETE, defaultOption } from '../commons/MVC';
import { PageCondition } from '../commons/DataBase';
import { getPageFromParams, waitLater } from '../commons/Utils';
import {Md5} from 'ts-md5/dist/md5';
import { omit } from 'underscore';
import { User } from '../commons/Models';
import { submitLog, submitLogByUser } from './Log';

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
GET('/users', defaultOption, async (context) => {
  let pageCond = getPageFromParams(context.params);
  let pageData = await context.dbSession.findByPage('user', pageCond);
  pageData.data = pageData.data.map(user => omit(user, 'password'));
  return pageData;
});

/**
 * 根据 id 加载单个用户
 */
GET('/user/:id', defaultOption, async ({ dbSession, params }) => {
  let user = await dbSession.findOne('user', { id: params.id, disabled: 0 });
  if (!user) {
    throw new LogicError('没有找到用户');
  }
  return omit(user, 'password');
});

/**
 * 新加用户
 */
POST('/user', defaultOption,  async (context) => {
  let { username, password, name, skype, email } = context.params;
  verifyUsername(username);
  verifyPassword(password);

  if (await context.dbSession.exists('user', { username })) {
    throw new LogicError('该用户名已经存在');
  }

  let data = {
    username,
    name,
    password: hashStr(password),
    skype,
    email
  };
  let res = await context.dbSession.insert('user', data);
  await submitLog(context, '添加新用户', omit(data, 'password'));

  return { id: res.insertId, ... omit(data, 'password') };
});

/**
 * 修改用户信息
 */
POST('/user/:id', defaultOption, async (context) => {
  let { password, id, ... data } = context.params;
  if (password) {
    verifyPassword(password);
    data['password'] = hashStr(password);
  }
  await context.dbSession.update('user', data, { id });
  await submitLog(context, '修改用户信息', omit(data, 'password'));
  return { };
});

/**
 * 注销一个用户
 */
DELETE('/user/:id', defaultOption, async (context) => {
  let { id } = context.params;
  let user = await context.dbSession.findOne('user', { id });
  if (!user) {
    throw new LogicError('不存在的用户');
  }
  await context.dbSession.update('user', { disabled: 1 }, { id });
  await submitLog(context, '注销用户', omit(user, 'password'));
  return {};
});

/**
 * 用户登录
 */
POST('/login', { mustLogin: false }, async (context) => {
  let { username, password } = context.params;
  let user = (await context.dbSession.findOne('user', { username, disabled: 0 })) as User;
  if (!user) {
    throw new LogicError('用户不存!');
  }

  if (user.password != hashStr(password)) {
    throw new LogicError('密码错误');
  }

  // 设置 token
  let token = hashStr(user.username + '-' + new Date().getTime()).toString();
  let onlineUser = { token, ... omit(user, 'password') };
  await context.userCache.set(token, onlineUser);

  // await waitLater(1000);
  await submitLogByUser(context, onlineUser, '用户登录');
  return onlineUser;
});

/**
 * 用户登出
 */
POST('/logout', defaultOption, async (context) => {
  let currentUser = await context.currentUser;
  if (!currentUser) {
    throw new LogicError('未登录');
  }
  await submitLog(context, '用户登出');
  await context.userCache.remove(currentUser.token);
  return {};
});


