import * as express from 'express';
import { DBSession, openSession } from './DataBase';
import { Cache } from './Cache';
import { parse as parseUrl } from 'url';
import { join } from 'path';
import { json } from 'body-parser';
import * as fs from 'fs';

export const expressApp = express();

export interface OnlineUser {

  token?: string;

  username?: string;

}

/**
 *
 */
export class ApiRequestContext {

  private _dbSession: DBSession;

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

  get hasOpenDBSession() {
    return !!this._dbSession;
  }

  constructor(public readonly params: any) { }
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
async function runInSafe(paramsData: any, handle: (ApiRequestContext) => Promise<any>) {
  let context: ApiRequestContext;
  try {
    context = new ApiRequestContext(paramsData);
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

function register(method: string, path: string, handle: (context: ApiRequestContext) => Promise<any>) {
  expressApp.route('/api' + path)[method]((req: express.Request, res: express.Response) => {
    let { params, query, body } = req;
    let paramsData = {};
    try {
      let U = parseUrl(req.url, true);
      paramsData = Object.assign(body, params, U.query);
      console.log('params', paramsData);
    }
    catch(e) {}

    runInSafe(paramsData, handle).then((result) => {
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

export function GET(path: string, handle: (context: ApiRequestContext) => Promise<any>) {
  register('get', path, handle);
  return handle;
}

export function POST(path: string, handle: (context: ApiRequestContext) => Promise<any>) {
  register('post', path, handle);
  return handle;
}

export function PUT(path: string, handle: (context: ApiRequestContext) => Promise<any>) {
  register('put', path, handle);
  return handle;
}

export function DELETE(path: string, handle: (context: ApiRequestContext) => Promise<any>) {
  register('delete', path, handle);
  return handle;
}


const webBase = join(__dirname, '../public');

expressApp.use('/', express.static(webBase));
expressApp.use('/api', json());


expressApp.get('*', (req, res) => {
  fs.exists(join(webBase, 'index.html'), (exists) => {
    if (exists) {
      let out = fs.createReadStream(join(webBase, 'index.html'));
      out.pipe(res);
    }
    else {
      res.status(404);
      res.end('404');
    }
  });
});
