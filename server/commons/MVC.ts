import * as express from 'express';
import { DBSession, openSession } from './DataBase';
import { Cache } from './Cache';
import { parse as parseUrl } from 'url';
import { join } from 'path';
import { json } from 'body-parser';
import * as fs from 'fs';
import { User } from './Models';

export const expressApp = express();

export interface OnlineUser extends User {

  token: string;

}

/**
 *
 */
export class ApiRequestContext {

  private _dbSession: DBSession;

  private _token: string;

  private _currentUser: OnlineUser;

  /**
   * 在线用户缓存
   */
  readonly userCache = new Cache<OnlineUser>('onlineUser');

  /**
   * 数据库会话
   */
  get dbSession(): DBSession {
    if (!this._dbSession) {
      this._dbSession = openSession();
    }
    return this._dbSession;
  }

  /**
   * 数据库会话是否被开启
   */
  get hasOpenDBSession() {
    return !!this._dbSession;
  }

  /**
   * 当前访问的用户
   */
  get currentUser(): Promise<OnlineUser> {
    if (!this._token) {
      return Promise.resolve(null);
    }

    if (this._currentUser) {
      return Promise.resolve(this._currentUser);
    }

    return this.userCache.get(this._token).then(user => this._currentUser = user);
  }

  constructor(public readonly params: any) {
    this._token = params.token;
  }
}

export class LogicError extends Error {
  constructor(message: string, public code = 0) {
    super(message);
  }
}

/**
 * 让业务处理过程始终处在安全中
 * @param context
 * @param handle
 */
async function runInSafe(paramsData: any, options: HandleOptions, handle: (ApiRequestContext) => Promise<any>) {
  let context: ApiRequestContext;
  try {
    context = new ApiRequestContext(paramsData);

    // 检查登录状态
    if (options.mustLogin) {
      if ((await context.currentUser) == null) {
        throw new LogicError('必须先登录');
      }
    }

    let res = await handle(context);

    // 如果发现开启了数据库事务, 提交当前事务
    if (context.hasOpenDBSession && context.dbSession.hasBeginTransation) {
      await context.dbSession.commit();
    }
    return res;
  }
  catch(err) {
    // 如果发现开启了数据库事务, 回滚当前事务
    if (context && context.hasOpenDBSession && context.dbSession.hasBeginTransation) {
      await context.dbSession.rollback();
    }
    throw err;
  }
  finally {
    // 关闭数据库
    if (context && context.hasOpenDBSession) {
      context.dbSession.close();
    }
  }
}

function register(method: string, path: string, options: HandleOptions, handle: (context: ApiRequestContext) => Promise<any>) {
  expressApp.route('/api' + path)[method]((req: express.Request, res: express.Response) => {
    let { params, query, body } = req;
    let paramsData = {};
    try {
      let U = parseUrl(req.url, true);
      paramsData = Object.assign(body, params, U.query);
    }
    catch(e) {}

    runInSafe(paramsData, options, handle).then((result) => {
      res.status(200);
      res.json(result);
    }).catch(err => {
      if (err instanceof LogicError) {
        res.status(400);
        res.json({ message: err.message, code: err.code });
      }
      else {
        res.status(500);
        res.json({ message: err.message });
        console.error(err);
      }
    });
  });
}

export interface HandleOptions {
  mustLogin?: boolean;
}

export const defaultOption: HandleOptions = {
  mustLogin: true
};

export function GET(path: string, options: HandleOptions,  handle: (context: ApiRequestContext) => Promise<any>) {
  register('get', path, options, handle);
  return handle;
}

export function POST(path: string, options: HandleOptions, handle: (context: ApiRequestContext) => Promise<any>) {
  register('post', path, options, handle);
  return handle;
}

export function PUT(path: string, options: HandleOptions, handle: (context: ApiRequestContext) => Promise<any>) {
  register('put', path, options, handle);
  return handle;
}

export function DELETE(path: string, options: HandleOptions, handle: (context: ApiRequestContext) => Promise<any>) {
  register('delete', path, options, handle);
  return handle;
}


const webBase = join(__dirname, '../public');

expressApp.use('/', express.static(webBase));
expressApp.use('/api', json());

// expressApp.get('*', (req, res) => {
//   fs.exists(join(webBase, 'index.html'), (exists) => {
//     if (exists) {
//       let out = fs.createReadStream(join(webBase, 'index.html'));
//       out.pipe(res);
//     }
//     else {
//       res.status(404);
//       res.end('404');
//     }
//   });
// });
